'use client';
import useSignalGlobalScroll from '@/hooks/useSignalGlobalScroll';
import { useDisclosure } from '@mantine/hooks';
import { useSignalEffect } from '@preact/signals-react';
import {
  IconBrandGithub,
  IconCategory2,
  IconHome,
  IconMail,
} from '@tabler/icons-react';
import anime from 'animejs';
import { cva } from 'cva';
import { useEffect, useMemo, useRef } from 'react';

const navbarStyle = cva({
  base: [
    'flex',
    'rounded-md',
    'transition-colors',
    'duration-500',
    'border-[1px]',
    'p-1',
    'items-center',
    'w-full',
    'h-full',
    'justify-between',
    'text-white',
    'bg-white/5',
  ],
  variants: {
    isVisible: {
      true: ['border-white/10'],
      false: ['border-transparent'],
    },
  },
  defaultVariants: {
    isVisible: false,
  },
});
const navbarContainerStyle = cva({
  base: [
    'p-2',
    'rounded-md',
    'fixed',
    'left-[50%]',
    'z-[2]',
    'top-1',
    'w-full',
    'max-w-[510px]',
    'h-full',
    'max-h-[55px]',
  ],
});

function Navbar() {
  const { y: scrollY } = useSignalGlobalScroll();
  const [isMounted, setIsMounted] = useDisclosure(false);
  const [isVisible, setIsVisible] = useDisclosure(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const animation = useMemo(() => {
    if (typeof window !== 'undefined') {
      return anime({
        targets: navbarRef.current,
        zIndex: {
          value: 5,
          delay: 1000,
          round: true,
        },
        scale: [
          { value: 1, duration: 1000 },
          { value: 0.8, duration: 0 },
          { value: 1, duration: 1000 },
        ],
        opacity: [
          { value: 1, duration: 1000 },
          { value: 0, duration: 0 },
          { value: 1, duration: 1000 },
        ],
        backdropFilter: [
          { value: 'blur(0px)', duration: 0 },
          { value: 'blur(10px)', duration: 2000 },
        ],
        translateX: '-50%',
        easing: 'cubicBezier(0.25, 0.62, 0.17, 1)',
        autoplay: false,
      });
    }
    return null;
  }, [isMounted]);

  useEffect(() => {
    setIsMounted.open();
  }, []);

  useSignalEffect(() => {
    if (scrollY.value < 300) {
      animation?.seek((scrollY.value / 300) * animation?.duration);
    } else if (scrollY.value > 300) {
      animation?.seek(animation?.duration);
    }
    if (scrollY.value > 250) {
      setIsVisible.open();
    } else {
      setIsVisible.close();
    }
  });

  return (
    <section
      ref={navbarRef}
      style={{ transform: 'translateX(-50%)' }}
      className={navbarContainerStyle()}
    >
      <div
        className={navbarStyle({
          isVisible,
        })}
      >
        <a
          href='https://github.com/Apheiro/Portfolio'
          target='_blank'
          rel='noreferrer'
          className='hover:scale-105 transition-transform duration-500 border-1px bg-white/05 h-30px flex items-center justify-center aspect-square border-white/10 rounded-md'
        >
          <IconBrandGithub width={18} height={18} />
        </a>
        <div className='flex gap-3 '>
          <a
            href='#home'
            className='hover:scale-105 transition-transform duration-500 border-1px bg-white/05 h-30px flex items-center justify-center aspect-square border-white/10 rounded-md'
          >
            <IconHome width={18} height={18} />
          </a>
          <a
            href='#projects'
            className='hover:scale-105 transition-transform duration-500 border-1px bg-white/05 h-30px flex items-center justify-center aspect-square border-white/10 rounded-md'
          >
            <IconCategory2 width={18} height={18} />
          </a>
          <a
            href='#contact'
            className='hover:scale-105 transition-transform duration-500 border-1px bg-white/05 h-30px flex items-center justify-center aspect-square border-white/10 rounded-md'
          >
            <IconMail width={18} height={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
export default Navbar;
