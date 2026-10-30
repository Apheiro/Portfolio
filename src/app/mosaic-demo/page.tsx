'use client';

import {
  MosaicBackground,
  MosaicProvider,
  useMosaicElement,
} from '@apheiro/mosaic/react';
import { StrictMode, useState } from 'react';

function Target({ color }: { color: string }) {
  const [ref, { show, toggle }] = useMosaicElement<HTMLButtonElement>(
    {
      show: { initialState: true, range: 80, minSize: 3 },
      glow: { color, range: 160, duration: 1400 },
    },
  );
  return (
    <button
      ref={ref}
      type='button'
      onClick={toggle}
      aria-pressed={show}
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '20px 28px',
        color: '#fff',
        background: '#13131c',
        border: `1px solid ${color}`,
        borderRadius: 12,
        cursor: 'pointer',
        font: 'inherit',
      }}
    >
      {show ? 'Cerrar apertura' : 'Abrir mosaico'}
    </button>
  );
}

function Example({
  label,
  color,
  initialSize,
}: { label: string; color: string; initialSize: number }) {
  const [size, setSize] = useState(initialSize);
  const [mounted, setMounted] = useState(true);
  const [narrow, setNarrow] = useState(false);
  return (
    <section aria-label={label} style={{ minWidth: 0 }}>
      <h2 style={{ fontSize: 24, margin: '0 0 16px' }}>{label}</h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <label>
          Tamaño: {size} px{' '}
          <input
            aria-label={`Tamaño ${label}`}
            type='range'
            min='12'
            max='48'
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
          />
        </label>
        <button
          type='button'
          onClick={() => setNarrow((value) => !value)}
          style={controlStyle}
        >
          Cambiar ancho
        </button>
        <button
          type='button'
          onClick={() => setMounted((value) => !value)}
          style={controlStyle}
        >
          {mounted ? 'Desmontar' : 'Montar'}
        </button>
      </div>
      <div
        data-demo-container={label}
        style={{
          position: 'relative',
          width: narrow ? '72%' : '100%',
          height: 360,
          overflow: 'hidden',
          borderRadius: 18,
          border: '1px solid #373347',
          background: `radial-gradient(ellipse, ${color}90, #090910 75%)`,
          display: 'grid',
          placeItems: 'center',
          resize: 'vertical',
          minHeight: 180,
        }}
      >
        {mounted && (
          <MosaicProvider>
            <MosaicBackground
              size={size}
              backgroundColor='#090910'
              borderColor='#353143'
              borderRadius={3}
            />
            <Target color={color} />
          </MosaicProvider>
        )}
      </div>
    </section>
  );
}
const controlStyle = {
  background: '#262231',
  color: '#fff',
  border: '1px solid #544965',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
};

export default function MosaicDemo() {
  return (
    <StrictMode>
      <main
        style={{
          background: '#100e17',
          color: '#eeeaf7',
          minHeight: '100vh',
          padding: '80px 24px',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ maxWidth: 1180, margin: 'auto' }}>
          <a href='/' style={{ color: '#c9a7ff' }}>
            ← Portfolio
          </a>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              marginBottom: 12,
            }}
          >
            Mosaic · dos instancias independientes
          </h1>
          <p
            style={{
              color: '#bdb5ce',
              maxWidth: 720,
              lineHeight: 1.6,
              marginBottom: 36,
            }}
          >
            Cada canvas tiene su propio tamaño, animaciones y ciclo de
            vida. Probá abrir una zona, cambiar su contenedor o
            desmontarla: la otra instancia sigue funcionando.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
              gap: 32,
            }}
          >
            <Example
              label='Violeta'
              color='#b474ff'
              initialSize={24}
            />
            <Example label='Verde' color='#46e6b1' initialSize={32} />
          </div>
        </div>
      </main>
    </StrictMode>
  );
}
