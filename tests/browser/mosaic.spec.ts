import { expect, test } from '@playwright/test';

// Stable pixels make cross-instance interference visible, including reduced-motion behavior.
test('independent canvases survive option changes, resize, scrolling and remount', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mosaic-demo');
  const violet = page.getByRole('region', {
    name: 'Violeta',
    exact: true,
  });
  const green = page.getByRole('region', {
    name: 'Verde',
    exact: true,
  });
  await expect(page.locator('canvas')).toHaveCount(2);
  await expect(violet.locator('canvas')).toHaveJSProperty(
    'width',
    await violet
      .locator('canvas')
      .evaluate((canvas: HTMLCanvasElement) =>
        Math.round(
          canvas.clientWidth * Math.min(devicePixelRatio, 2),
        ),
      ),
  );
  await expect(
    violet.getByRole('button', { name: 'Cerrar apertura' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(() =>
      green
        .locator('canvas')
        .evaluate(
          (canvas: HTMLCanvasElement) =>
            canvas.getContext('2d')?.getImageData(0, 0, 1, 1).data[3],
        ),
    )
    .toBeGreaterThan(0);
  const originalGreen = await green
    .locator('canvas')
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  const originalViolet = await violet
    .locator('canvas')
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  await violet
    .getByRole('button', { name: 'Cerrar apertura' })
    .click();
  await expect(
    violet.getByRole('button', { name: 'Abrir mosaico' }),
  ).toHaveAttribute('aria-pressed', 'false');
  await expect
    .poll(() =>
      violet
        .locator('canvas')
        .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL()),
    )
    .not.toBe(originalViolet);
  await expect
    .poll(() =>
      green
        .locator('canvas')
        .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL()),
    )
    .toBe(originalGreen);
  await violet.getByRole('slider').fill('40');
  await expect(violet.getByText('Tamaño: 40 px')).toBeVisible();
  const oldWidth = await violet
    .locator('canvas')
    .evaluate((canvas: HTMLCanvasElement) => canvas.width);
  await violet.getByRole('button', { name: 'Cambiar ancho' }).click();
  await expect
    .poll(() =>
      violet
        .locator('canvas')
        .evaluate((canvas: HTMLCanvasElement) => canvas.width),
    )
    .toBeLessThan(oldWidth);
  await expect
    .poll(() =>
      green
        .locator('canvas')
        .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL()),
    )
    .toBe(originalGreen);
  await violet.getByRole('button', { name: 'Desmontar' }).click();
  await expect(violet.locator('canvas')).toHaveCount(0);
  await expect(green.locator('canvas')).toHaveCount(1);
  await violet
    .getByRole('button', { name: 'Montar', exact: true })
    .click();
  await expect(violet.locator('canvas')).toHaveCount(1);
  await violet
    .getByRole('button', { name: 'Cerrar apertura' })
    .click();
  await violet.getByRole('button', { name: 'Abrir mosaico' }).click();
  await expect(
    violet.getByRole('button', { name: 'Cerrar apertura' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({
    path: `artifacts/mosaic-${testInfo.project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test('animated instances clean up through React StrictMode mount cycles', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const pending = new Set<number>();
    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
      const id = request((time) => {
        pending.delete(id);
        callback(time);
      });
      pending.add(id);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      pending.delete(id);
      cancel(id);
    };
    Object.defineProperty(window, '__pendingMosaicFrames', {
      get: () => pending.size,
    });
  });
  await page.goto('/mosaic-demo');
  const violet = page.getByRole('region', {
    name: 'Violeta',
    exact: true,
  });
  const green = page.getByRole('region', {
    name: 'Verde',
    exact: true,
  });
  await expect(violet.locator('canvas')).toHaveCount(1);
  const before = await violet
    .locator('canvas')
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  await expect
    .poll(() =>
      violet
        .locator('canvas')
        .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL()),
    )
    .not.toBe(before);
  for (let index = 0; index < 3; index++) {
    await violet.getByRole('button', { name: 'Desmontar' }).click();
    await violet
      .getByRole('button', { name: 'Montar', exact: true })
      .click();
    await expect(
      violet.getByRole('button', { name: 'Cerrar apertura' }),
    ).toBeVisible();
  }
  await violet.getByRole('button', { name: 'Desmontar' }).click();
  await green.getByRole('button', { name: 'Desmontar' }).click();
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { __pendingMosaicFrames: number })
            .__pendingMosaicFrames,
      ),
    )
    .toBe(0);
  expect(errors).toEqual([]);
});

test('portfolio consumes the local package and renders its canvas', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://github.com/**', (route) => route.abort());
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Eyen Fernando Tuyon' }),
  ).toBeVisible();
  const canvas = page.locator('#home canvas');
  await expect(canvas).toHaveCount(1);
  await expect
    .poll(() =>
      canvas.evaluate((node: HTMLCanvasElement) => node.width),
    )
    .toBeGreaterThan(0);
  const before = await canvas.evaluate((node: HTMLCanvasElement) =>
    node.toDataURL(),
  );
  await page.locator('#home').getByAltText('profile picture').click();
  await expect
    .poll(() =>
      canvas.evaluate((node: HTMLCanvasElement) => node.toDataURL()),
    )
    .not.toBe(before);
  await page.screenshot({
    path: `artifacts/portfolio-${testInfo.project.name}.png`,
  });
  expect(errors).toEqual([]);
});
