import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from 'unocss';
export default defineConfig({
  presets: [
    presetUno({
      dark: 'media',
    }),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  theme: {
    animation: {
      keyframes: {
        in: `{
                    0% {
                        transform: translate3d(var(--enter-translate-x,0), var(--enter-translate-y,0), 0) scale3d(var(--enter-scale,1),var(--enter-scale,1),var(--enter-scale,1)) rotate(var(--enter-rotate,0));
                        opacity: 0;
                    }
                    100% {
                        transform: unset;
                        opacity: 1;
                    }
                }`,
        out: `{
                    0% {
                        transform: unset;
                        opacity: 1;
                    }
                    100% {
                        transform: translate3d(var(--enter-translate-x,0), var(--enter-translate-y,0), 0) scale3d(var(--enter-scale,1),var(--enter-scale,1),var(--enter-scale,1)) rotate(var(--enter-rotate,0));
                        opacity: 0;
                    }
                }`,
      },
      durations: {
        in: '0.5s',
        out: '0.5s',
      },
      timingFns: {
        in: 'cubic-bezier(0.23, 0.94, 0.28, 1.02)',
        out: 'cubic-bezier(0.23, 0.94, 0.28, 1.02)',
      },
      counts: {
        in: 1,
        out: 1,
      },
    },
  },
  rules: [
    [
      /^slide-(from|to)-(bottom|top|left|right)-(\d+)(?:px)?$/,
      (match) => {
        const [completeValue, direction, orientation, value] = match;
        const isPx = completeValue.includes('px');
        const finalValue = isPx
          ? `${Number.parseInt(value) / 16}rem`
          : `${Number.parseInt(value)}rem`;
        const directionAnimation = direction === 'to';

        switch (orientation) {
          case 'bottom':
            return {
              '--enter-translate-y': `${directionAnimation ? '-' : ''}${finalValue}`,
            };
          case 'top':
            return {
              '--enter-translate-y': `${directionAnimation ? '' : '-'}${finalValue}`,
            };
          case 'left':
            return {
              '--enter-translate-x': `${directionAnimation ? '' : '-'}${finalValue}`,
            };
          case 'right':
            return {
              '--enter-translate-x': `${directionAnimation ? '-' : ''}${finalValue}`,
            };
        }
      },
    ],
    [
      /^scale-(from|to)-(\d+)$/,
      (match) => {
        const [_, __, value] = match;
        const valueNum = Number.parseInt(value) / 100;
        return { '--enter-scale': `${valueNum}` };
      },
    ],
  ],
});
