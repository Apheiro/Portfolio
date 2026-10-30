import test from 'node:test';
import assert from 'node:assert/strict';
import { createMosaic } from '../dist/core/index.js';
import {
  glowCycleDuration,
  glowIntensity,
} from '../dist/core/glow.js';
import {
  createTiles,
  distanceToRect,
  relativeRect,
  sizeAtDistance,
} from '../dist/core/geometry.js';

function environment({
  width = 120,
  height = 80,
  ratio = 2,
  left = 100,
  top = 60,
} = {}) {
  const frames = new Map();
  const listeners = new Map();
  const draws = [];
  let id = 0;
  const context = Object.fromEntries(
    [
      'setTransform',
      'clearRect',
      'fillRect',
      'strokeRect',
      'beginPath',
      'moveTo',
      'arcTo',
      'closePath',
      'fill',
      'stroke',
    ].map((name) => [name, (...args) => draws.push({ name, args })]),
  );
  const observer = { observed: new Set(), disconnected: false };
  const view = {
    devicePixelRatio: ratio,
    requestAnimationFrame(callback) {
      frames.set(++id, callback);
      return id;
    },
    cancelAnimationFrame(key) {
      frames.delete(key);
    },
    addEventListener(name, callback) {
      listeners.set(`window:${name}`, callback);
    },
    removeEventListener(name) {
      listeners.delete(`window:${name}`);
    },
    matchMedia() {
      return {
        matches: true,
        addEventListener(name, callback) {
          listeners.set(`media:${name}`, callback);
        },
        removeEventListener(name) {
          listeners.delete(`media:${name}`);
        },
      };
    },
    // biome-ignore lint/style/useNamingConvention: Browser API name in the test fixture.
    ResizeObserver: class {
      constructor(callback) {
        observer.notify = callback;
      }
      observe(target) {
        observer.observed.add(target);
      }
      unobserve(target) {
        observer.observed.delete(target);
      }
      disconnect() {
        observer.disconnected = true;
        observer.observed.clear();
      }
    },
  };
  const document = {
    defaultView: view,
    addEventListener(name, callback) {
      listeners.set(`document:${name}`, callback);
    },
    removeEventListener(name) {
      listeners.delete(`document:${name}`);
    },
  };
  const canvas = {
    clientWidth: width,
    clientHeight: height,
    ownerDocument: document,
    getContext: () => context,
    getBoundingClientRect() {
      return {
        left,
        top,
        right: left + this.clientWidth,
        bottom: top + this.clientHeight,
      };
    },
  };
  return {
    canvas,
    draws,
    observer,
    listeners,
    frames,
    element: {
      ownerDocument: document,
      isConnected: true,
      getBoundingClientRect: () => ({
        left,
        top,
        right: left + 60,
        bottom: top + 40,
      }),
    },
    flush() {
      const pending = [...frames.values()];
      frames.clear();
      for (const callback of pending) callback(0);
    },
  };
}

test('geometry handles an offset, CSS-scaled canvas without a scroll selector', () => {
  const rect = relativeRect(
    { left: 120, top: 90, right: 180, bottom: 150 },
    { left: 100, top: 50, right: 300, bottom: 250 },
    100,
    100,
  );
  assert.deepEqual(rect, {
    left: 10,
    top: 20,
    right: 40,
    bottom: 50,
  });
  assert.equal(distanceToRect(20, 30, rect), 0);
  assert.equal(distanceToRect(43, 54, rect), 5);
});

test('tile generation covers partial rows and rejects invalid sizes', () => {
  assert.equal(createTiles(61, 31, 30).length, 6);
  for (const size of [0, -1, Number.NaN, Number.POSITIVE_INFINITY])
    assert.throws(() => createTiles(100, 100, size), RangeError);
  assert.equal(sizeAtDistance(0, 30, 5, 80), 0);
  assert.equal(sizeAtDistance(40, 30, 5, 80), 17.5);
  assert.equal(sizeAtDistance(100, 30, 5, 80), 30);
  assert.equal(sizeAtDistance(1, 30, 5, 0), 30);
});

test('instances own their rendering, backing resolution, listeners and cleanup', () => {
  const a = environment();
  const b = environment();
  const first = createMosaic(a.canvas);
  const second = createMosaic(b.canvas);
  a.flush();
  b.flush();
  assert.equal(a.canvas.width, 240);
  assert.equal(a.canvas.height, 160);
  const secondDrawCount = b.draws.length;
  first.update({ size: 20 });
  a.flush();
  assert.equal(b.draws.length, secondDrawCount);
  first.refresh();
  assert.equal(a.frames.size, 1);
  first.destroy();
  first.destroy();
  assert.equal(a.frames.size, 0);
  assert.equal(a.listeners.size, 0);
  assert.equal(a.observer.disconnected, true);
  assert.equal(b.observer.disconnected, false);
  second.destroy();
});

test('registration opens and closes holes; removing an element restores the grid', () => {
  const env = environment();
  const engine = createMosaic(env.canvas, { size: 20 });
  env.flush();
  const fullCount = env.draws.filter(
    (draw) => draw.name === 'fillRect',
  ).length;
  env.draws.length = 0;
  const handle = engine.registerElement(env.element, {
    show: { initialState: true, range: 0 },
  });
  env.flush();
  assert.ok(
    env.draws.filter((draw) => draw.name === 'fillRect').length <
      fullCount,
  );
  assert.equal(handle.isOpen, true);
  handle.toggle();
  env.draws.length = 0;
  env.flush();
  assert.equal(handle.isOpen, false);
  assert.equal(
    env.draws.filter((draw) => draw.name === 'fillRect').length,
    fullCount,
  );
  handle.open();
  handle.destroy();
  handle.open();
  assert.equal(env.observer.observed.has(env.element), false);
  env.draws.length = 0;
  env.flush();
  assert.equal(
    env.draws.filter((draw) => draw.name === 'fillRect').length,
    fullCount,
  );
  engine.destroy();
});

test('container resize and pixel-ratio changes update backing dimensions', () => {
  const env = environment();
  const engine = createMosaic(env.canvas);
  env.flush();
  env.canvas.clientWidth = 75;
  env.observer.notify();
  env.flush();
  assert.equal(env.canvas.width, 150);
  engine.update({ pixelRatio: 1 });
  env.flush();
  assert.equal(env.canvas.width, 75);
  engine.destroy();
});

test('glow-only options work and rounded tiles are actually drawn', () => {
  const env = environment();
  const engine = createMosaic(env.canvas, { borderRadius: 4 });
  const handle = engine.registerElement(env.element, {
    glow: { color: '#a948ff' },
  });
  handle.open();
  env.flush();
  assert.ok(env.draws.some((draw) => draw.name === 'arcTo'));
  handle.update({ show: { range: 20 }, glow: { color: '#00ffaa' } });
  env.flush();
  handle.close();
  env.flush();
  engine.destroy();
  assert.equal(env.frames.size, 0);
});

test('invalid configuration fails before listeners or frames are allocated', () => {
  const env = environment();
  assert.throws(
    () => createMosaic(env.canvas, { size: 0 }),
    RangeError,
  );
  assert.throws(
    () => createMosaic(env.canvas, { borderColor: 'not-a-color' }),
    TypeError,
  );
  assert.equal(env.frames.size, 0);
  assert.equal(env.listeners.size, 0);
});

test('SSR imports are safe and destroyed instances reject new registrations', () => {
  assert.equal(typeof window, 'undefined');
  const env = environment();
  const engine = createMosaic(env.canvas);
  engine.destroy();
  assert.throws(
    () => engine.registerElement(env.element),
    /destroyed/,
  );
  engine.refresh();
  engine.update({ size: 40 });
  assert.equal(env.frames.size, 0);
});

test('glow propagates outwards and preserves the complete fading tail before repeating', () => {
  const glow = { range: 150, duration: 1000, delay: 150 };
  const cycle = glowCycleDuration(glow);
  const sample = (distance, elapsed) =>
    glowIntensity(distance, elapsed / cycle, glow);
  assert.equal(cycle, 2500);
  assert.equal(sample(15, 0), 0);
  assert.equal(sample(120, 500), 0);
  assert.ok(sample(15, 500) > 0);
  assert.equal(sample(15, 1500), 0);
  assert.ok(sample(120, 1800) > 0);
  assert.ok(sample(135, 2200) > 0);
  assert.ok(sample(135, 2350) < sample(135, 2200));
  for (const distance of [0, 1, 15, 75, 120, 135, 149, 150, 151]) {
    assert.equal(sample(distance, cycle), 0);
    assert.equal(sample(distance, 0), 0);
  }
});

test('a pulse with no spatial delay still rises and fades to its resting color', () => {
  const glow = { range: 100, duration: 800, delay: 0 };
  assert.equal(glowCycleDuration(glow), 800);
  assert.equal(glowIntensity(25, 0, glow), 0);
  assert.equal(glowIntensity(25, 0.5, glow), 0.75);
  assert.ok(
    glowIntensity(25, 0.75, glow) < glowIntensity(25, 0.5, glow),
  );
  assert.equal(glowIntensity(25, 1, glow), 0);
});
