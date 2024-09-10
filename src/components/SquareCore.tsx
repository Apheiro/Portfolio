import Xcircuits from '@/components/Xcircuits';
import Ycircuits from '@/components/Ycircuits';
import useOpenBackground from '@/hooks/useOpenBackground';
import { useDidUpdate, useElementSize } from '@mantine/hooks';
import anime from 'animejs';
import { memo, useEffect, useState } from 'react';

function defineAnimations2() {
  const rotationAnimation = anime({
    targets: ['#squareSmallCore'],
    loop: true,
    autoplay: false,
    rotateX: [
      { value: 160, duration: 0 },
      { value: 520, duration: 3000 },
    ],
    rotateY: [
      { value: 45, duration: 0 },
      { value: 765, duration: 3000 },
    ],
    rotateZ: [
      { value: 0, duration: 0 },
      { value: 360, duration: 3000 },
    ],
    easing: 'linear',
  });
  const glowAnimaiton = anime({
    targets: ['#squareSmallCoreContainer'],
    loop: true,
    autoplay: false,
    direction: 'alternate',
    filter: [
      {
        value: 'drop-shadow(0px 0px 5px #a948ff) brightness(1) ',
        duration: 0,
      },
      {
        value: 'drop-shadow(0px 0px 25px #a948ff) brightness(2) ',
        duration: 3000,
      },
      {
        value: 'drop-shadow(0px 0px 5px #a948ff) brightness(1) ',
        duration: 3000,
      },
    ],
    easing: 'linear',
  });
  const timeline4 = anime.timeline({
    autoplay: false,
    loop: true,
  });
  timeline4.add(
    {
      targets: [
        '#yTopCore1',
        '#yTopCore2',
        '#yTopCore3',
        '#yTopCore4',
        '#yTopCore5',
        '#yTopCore6',
        '#yTopCore7',
        '#yTopCore8',
        '#yTopCore9',
      ],
      y2: ['-30%', '100%'],
      y1: ['0%', '130%'],
      easing: 'linear',
      duration: 2000,
      delay: (_, i) => i * 500,
    },
    0,
  );
  timeline4.add(
    {
      targets: [
        '#yBottomCore1',
        '#yBottomCore2',
        '#yBottomCore3',
        '#yBottomCore4',
        '#yBottomCore5',
        '#yBottomCore6',
        '#yBottomCore7',
        '#yBottomCore8',
        '#yBottomCore9',
      ],
      y2: ['-30%', '100%'],
      y1: ['0%', '130%'],
      easing: 'linear',
      duration: 1500,
      delay: (_, i) => i * 1000,
    },
    0,
  );
  timeline4.add(
    {
      targets: [
        '#xRightCore1',
        '#xRightCore2',
        '#xRightCore3',
        '#xRightCore4',
        '#xRightCore5',
        '#xRightCore6',
        '#xRightCore7',
        '#xRightCore8',
        '#xRightCore9',
      ],
      x2: ['-30%', '100%'],
      x1: ['0%', '130%'],
      loop: true,
      easing: 'linear',
      duration: 2000,
      delay: (_, i) => i * 500,
    },
    0,
  );
  timeline4.add(
    {
      targets: [
        '#xLeftCore1',
        '#xLeftCore2',
        '#xLeftCore3',
        '#xLeftCore4',
        '#xLeftCore5',
        '#xLeftCore6',
        '#xLeftCore7',
        '#xLeftCore8',
        '#xLeftCore9',
      ],
      x2: ['-30%', '100%'],
      x1: ['0%', '130%'],
      loop: true,
      easing: 'linear',
      duration: 1500,
      delay: (_, i) => i * 1000,
    },
    0,
  );
  return { rotationAnimation, glowAnimaiton, timeline4 };
}

function defineAnimations1({ cubeWidth }: { cubeWidth: number }) {
  const timeline1 = anime.timeline({
    autoplay: false,
  });
  timeline1.add(
    {
      targets: ['#boxLeft'],
      translateX: [{ value: '-=10', duration: 2000 }],
      rotateY: [{ value: 90, duration: 0 }],
    },
    0,
  );
  timeline1.add(
    {
      targets: ['#boxFront'],
      translateZ: [
        {
          value: cubeWidth * 0.5 + cubeWidth * 0.1,
          duration: 2000,
        },
      ],
    },
    0,
  );
  timeline1.add(
    {
      targets: ['#boxTop'],
      translateY: [{ value: '-=10', duration: 2000 }],
      rotateX: [{ value: 90, duration: 0 }],
    },
    0,
  );
  timeline1.add(
    {
      targets: ['#boxTop', '#boxFront', '#boxLeft'],
      boxShadow: [
        { value: '0px 0px 0px 0px #a948ffb3', duration: 0 },
        { value: '0px 0px 60px -10px #a948ffb3', duration: 3000 },
      ],
    },
    0,
  );

  const timeline3 = anime.timeline({
    autoplay: false,
  });
  timeline3.add(
    {
      targets: ['#boxLeft'],
      translateX: [{ value: '-=20', duration: 2000 }],
      opacity: [{ value: 0, duration: 2000 }],
      rotateY: [{ value: 90, duration: 0 }],
    },
    0,
  );
  timeline3.add(
    {
      targets: ['#boxRight'],
      translateX: [{ value: '+=20', duration: 2000 }],
      opacity: [{ value: 0, duration: 2000 }],
      rotateY: [{ value: 90, duration: 0 }],
    },
    0,
  );
  timeline3.add(
    {
      targets: ['#boxBack'],
      translateZ: [
        {
          value: -(cubeWidth * 0.5 + cubeWidth * 0.2),
          duration: 2000,
        },
      ],
      opacity: [{ value: 0, duration: 2000 }],
    },
    0,
  );
  timeline3.add(
    {
      targets: ['#boxFront'],
      translateZ: [
        {
          value: cubeWidth * 0.5 + cubeWidth * 0.2,
          duration: 2000,
        },
      ],
      opacity: [{ value: 0, duration: 2000 }],
    },
    0,
  );
  timeline3.add(
    {
      targets: ['#boxTop'],
      translateY: [{ value: '-=20', duration: 2000 }],
      opacity: [{ value: 0, duration: 2000 }],
      rotateX: [{ value: 90, duration: 0 }],
    },
    0,
  );
  timeline3.add(
    {
      targets: ['#boxBottom'],
      translateY: [{ value: '+=20', duration: 2000 }],
      opacity: [{ value: 0, duration: 2000 }],
      rotateX: [{ value: 90, duration: 0 }],
    },
    0,
  );

  return { timeline1, timeline3 };
}

function SquareCore({ className }: { className?: string }) {
  const { ref: squareBoxRef, width: cubeWidth } = useElementSize();
  const [squareBoxAnimation, setSquareBoxAnimation] =
    useState<anime.AnimeTimelineInstance | null>(null);
  const [squareBoxExitAnimation, setSquareBoxExitAnimation] =
    useState<anime.AnimeTimelineInstance | null>(null);
  const [squareBoxCoreAnimation, setSquareBoxCoreAnimation] =
    useState<{
      glow: anime.AnimeInstance;
      rotate: anime.AnimeInstance;
    } | null>(null);
  const [coreCircuitAnimation, setCoreCircuitAnimation] =
    useState<anime.AnimeTimelineInstance | null>(null);

  const {
    ref,
    showFns: { toggle },
    isVisible,
    show,
  } = useOpenBackground<HTMLDivElement>(false, {
    range: 100,
    maxScale: 0.9,
    minScale: 0.3,
    glow: true,
  });

  useEffect(() => {
    const { rotationAnimation, glowAnimaiton, timeline4 } =
      defineAnimations2();
    setSquareBoxCoreAnimation({
      glow: glowAnimaiton,
      rotate: rotationAnimation,
    });
    setCoreCircuitAnimation(timeline4);
  }, []);

  useEffect(() => {
    const { timeline1, timeline3 } = defineAnimations1({ cubeWidth });
    setSquareBoxAnimation(timeline1);
    setSquareBoxExitAnimation(timeline3);
  }, [cubeWidth]);

  useDidUpdate(() => {
    if (isVisible) {
      coreCircuitAnimation?.play();
    } else {
      coreCircuitAnimation?.pause();
    }
  }, [isVisible]);

  return (
    <div className={className}>
      <div
        className='z-[2] flex items-center justify-center  absolute top-0 left-0 right-0 bottom-0 cursor-pointer camera'
        onMouseEnter={() => {
          if (squareBoxAnimation?.direction === 'reverse') {
            squareBoxAnimation?.reverse();
          }
          if (squareBoxAnimation?.progress === 0) {
            squareBoxAnimation?.play();
          }
          squareBoxCoreAnimation?.glow?.play();
          squareBoxCoreAnimation?.rotate?.play();
        }}
        onMouseLeave={() => {
          if (squareBoxAnimation?.direction === 'normal') {
            squareBoxAnimation?.reverse();
          }
          if (squareBoxAnimation?.progress === 100) {
            squareBoxAnimation?.play();
          }
          squareBoxAnimation?.finished.then(() => {
            if (!show) {
              squareBoxCoreAnimation?.glow?.pause();
              squareBoxCoreAnimation?.rotate?.pause();
            }
          });
        }}
        onClick={() => {
          if (show) {
            squareBoxExitAnimation?.direction !== 'reverse' &&
              squareBoxExitAnimation?.reverse();
            squareBoxExitAnimation?.play();
          } else {
            squareBoxExitAnimation?.direction !== 'normal' &&
              squareBoxExitAnimation?.reverse();
            squareBoxExitAnimation?.play();
          }
          toggle();
        }}
      >
        <div
          ref={squareBoxRef}
          className='w-[60%] h-[60%] preserve-3d rotate-x-345 rotate-y-45 flex justify-center items-center'
        >
          <div
            id='boxTop'
            style={{
              transform: 'translateY(-50%) rotateX(90deg)',
            }}
            className='bg-black border-[2px] border-white/20 absolute w-full h-full'
          />
          <div
            id='boxBack'
            style={{
              transform: `translateZ(-${cubeWidth / 2}px) `,
            }}
            className='bg-black border-[2px] border-white/20 absolute w-full h-full'
          />
          <div
            id='boxFront'
            style={{
              transform: `translateZ(${cubeWidth / 2}px)`,
            }}
            className='bg-black border-[2px] border-white/20 absolute w-full h-full'
          />
          <div
            id='boxRight'
            style={{
              transform: 'translateX(50%) rotateY(90deg)',
            }}
            className='bg-black border-[2px] border-white/20 absolute w-full h-full'
          />
          <div
            id='boxLeft'
            style={{
              transform: 'translateX(-50%) rotateY(90deg)',
            }}
            className='bg-black border-[2px] border-white/20 absolute w-full h-full'
          />
          <div
            id='boxBottom'
            style={{
              transform: 'translateY(50%) rotateX(90deg)',
            }}
            className='bg-black border-[2px] border-white/20 absolute w-full h-full'
          />
          <div
            id='squareSmallCoreContainer'
            style={{
              transform: 'rotateY(135deg) rotateX(0deg)',
            }}
            className='w-[100px] aspect-square flex items-center justify-center'
          >
            <div
              id='squareSmallCore'
              className=' w-[50px] h-[50px] preserve-3d'
            >
              <div className='bg-purple-600 absolute w-full h-full translate-y--50% rotate-x-90' />
              <div className='bg-purple-500 absolute w-full h-full translate-z--25px' />
              <div className='bg-purple-500 absolute w-full h-full translate-z-25px' />
              <div className='bg-purple-400 absolute w-full h-full translate-x-50% rotate-y-90' />
              <div className='bg-purple-400 absolute w-full h-full translate-x--50% rotate-y-90' />
              <div className='bg-purple-600 absolute w-full h-full translate-y-50% rotate-x-90' />
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          background:
            'radial-gradient(rgb(79, 0, 155), black, black)',
        }}
        className='w-[125%] h-[125%] absolute'
      />
      <div
        ref={ref}
        className='w-[50%] h-[50%] flex justify-center items-center rounded-md relative border-[2px] border-[#6700a7]'
      >
        <Ycircuits
          id='TopCore'
          className='absolute bottom-[-100%] w-full h-full rotate-180'
        />
        <Ycircuits
          id='BottomCore'
          className='absolute top-[-100%] w-full h-full'
        />
        <Xcircuits
          id='LeftCore'
          className='absolute left-[-100%] w-full h-full'
        />
        <Xcircuits
          id='RightCore'
          className='absolute right-[-100%] w-full h-full rotate-180'
        />
      </div>
    </div>
  );
}

const SquareCoreMemo = memo(SquareCore);

export default SquareCoreMemo;
