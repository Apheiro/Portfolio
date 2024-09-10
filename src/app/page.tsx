'use client';
import MosaicBackground from '@/components/MosaicBackground';
import Project from '@/components/Project';
import SquareCore from '@/components/SquareCore';
import Tecnologies from '@/components/Tecnologies';
import Ycircuits from '@/components/Ycircuits';
import { ScrollArea } from '@/core/ScrollArea';
import useOpenBackground from '@/hooks/useOpenBackground';
import { useElementSize } from '@mantine/hooks';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from '@tabler/icons-react';
import anime from 'animejs';
import NextImage from 'next/image';
import { useEffect, useMemo } from 'react';

const projects = [
  {
    projectName: 'shoppinCart',
    link: 'https://github.com/Apheiro/Shopping_cart',
    disclaimer:
      "Currently, this project is not working due to problems with the API. Bestbuy has removed my account and I'm unable to create another one.",
    description:
      'A fully functional shopping cart app using the Best Buy API and Vite. Features include a shopping cart, product details, product images, and checkout for payment.',
    img: {
      url: 'https://github.com/Apheiro/Shopping_cart/raw/main/Previews/SmallPreview.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'restaurantPage',
    link: 'https://github.com/Apheiro/restaurant_page',
    description:
      'Simple restaurant presentation page, implementing for first time webpack.',
    img: {
      url: 'https://github.com/Apheiro/restaurant_page/raw/main/src/preview/Restaurant%20render%401-2560x1393.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'adminDashboard',
    link: 'https://github.com/Apheiro/admin_dashboard',
    description: 'Admin dashboard layout made with grid css property',
    img: {
      url: 'https://github.com/Apheiro/admin_dashboard/raw/main/Preview/thumbnail.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'calculator',
    link: 'https://github.com/Apheiro/calculator',
    description:
      'A functional calculator built with HTML, CSS, and JavaScript. It includes basic arithmetic operations, factorial calculations, and a history display. The interface features a clean design with a focus on usability.',
    img: {
      url: 'https://github.com/Apheiro/calculator/raw/main/Preview/thumbnail.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'etchAsketch',
    link: 'https://github.com/Apheiro/etch_a_sketch',
    description:
      'Customizable Etch and Sketch app built with HTML, CSS, and JavaScript. It features adjustable resolution, grid visibility, night mode, and background color. Tools include an eraser, pencil color selection, and a clear button for easy drawing and editing.',
    img: {
      url: 'https://github.com/Apheiro/etch_a_sketch/raw/main/Preview/thumbnail.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'bookLibrary',
    link: 'https://github.com/Apheiro/book_library',
    description:
      "A book library app where users can save books they've read and books they want to read in the future. Each book can be customized with a color. When saving a book, users can enter the title, author, number of pages, and select a color for it.",
    img: {
      url: 'https://github.com/Apheiro/book_library/raw/main/Preview/thumbnail.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'registerForm',
    link: 'https://github.com/Apheiro/register_form',
    description: 'Simple registration form using a parallax library.',
    img: {
      url: 'https://github.com/Apheiro/register_form/raw/main/Preview/thumbnail.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'ticTacToe',
    link: 'https://github.com/Apheiro/tic_tac_toe',
    description: 'Tic Tac Toe game with customizable settings.',
    img: {
      url: 'https://github.com/Apheiro/tic_tac_toe/raw/main/Preview/thumbnail.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'rockPaperScissors',
    link: 'https://github.com/Apheiro/rock_paper_scissors',
    description:
      'My first JS project: a very simple Rock Paper Scissors game with some animations.',
    img: {
      url: 'https://github.com/Apheiro/rock_paper_scissors/raw/main/Preview/thumbnail.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'todoList',
    link: 'https://github.com/Apheiro/todo_list',
    description:
      'A to-do list implementing local storage for the first time.',
    img: {
      url: 'https://github.com/Apheiro/todo_list/raw/main/src/Preview/Thumbnail3D.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'cvApplication',
    link: 'https://github.com/Apheiro/cv_application',
    description: 'CV creator using React.js with a static layout.',
    img: {
      url: 'https://github.com/Apheiro/cv_application/raw/main/src/Preview/thumbnail.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'weatherApp',
    link: 'https://github.com/Apheiro/weather-app',
    description: 'Weather app using an API for the first time.',
    img: {
      url: 'https://github.com/Apheiro/weather-app/raw/main/src/assets/Preview/thumbnail.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'memoryCard',
    link: 'https://github.com/Apheiro/memory_card',
    description:
      'Memory card game using React, an API, and TypeScript for the first time.',
    img: {
      url: 'https://github.com/Apheiro/memory_card/raw/main/Preview/thumbnail.png',
      width: 960,
      height: 580,
    },
  },
  {
    projectName: 'todoListReact',
    link: 'https://github.com/Apheiro/todo_list_react',
    description: 'To-do list in React.',
    img: {
      url: 'https://github.com/Apheiro/todo_list_react/raw/main/src/previewImages/Thumbnail3D.png',
      width: 960,
      height: 580,
    },
  },
];

export default function Home() {
  const { ref } = useOpenBackground<HTMLDivElement>(true, {
    range: 150,
  });
  const { ref: navbarBgRef } = useOpenBackground<HTMLDivElement>(
    true,
    {
      range: 100,
      maxScale: 0.9,
      minScale: 0.2,
    },
  );
  const projectsElements = useMemo(
    () =>
      projects.map(({ projectName, ...props }) => (
        <Project key={projectName} {...props} />
      )),
    [],
  );

  useEffect(() => {
    anime({
      targets: [
        '#yBottomBar1',
        '#yBottomBar2',
        '#yBottomBar3',
        '#yBottomBar4',
        '#yBottomBar5',
        '#yBottomBar6',
        '#yBottomBar7',
        '#yBottomBar8',
        '#yBottomBar9',
      ],
      y2: ['-30%', '100%'],
      y1: ['0%', '130%'],
      loop: true,
      easing: 'linear',
      duration: 2000,
      delay: (_, i) => i * 500,
    });
  }, []);

  return (
    <main className='min-h-dvh max-w-dvw relative  bg-black overflow-x-hidden'>
      <div
        style={{ backgroundImage: 'url("/noise-light.png")' }}
        className='z-[3] absolute top-0 left-0 right-0 bottom-0 pointer-events-none opacity-70'
      />
      <section
        className='min-h-[calc(100dvh+160px)] flex justify-center items-inherit md:items-center relative p-5 md:p-10'
        id='home'
      >
        <MosaicBackground sizeOfSquares={25} />
        <div
          ref={navbarBgRef}
          className='top-1 z-[1] absolute left-[50%] translate-x-[-50%] justify-center items-center flex w-full max-w-[510px] h-full max-h-[55px] '
        >
          <div className='w-full h-full rounded-md border-[1px] border-[#6700a7] relative z-[1] ' />
          <div
            style={{
              background: 'radial-gradient(#27004b,black)',
            }}
            className='w-[150%] h-[600%] absolute'
          />
          <Ycircuits
            id='BottomBar'
            className='rotate-180 max-w-[100px] absolute top-[100%]'
          />
        </div>
        <div className='flex flex-col md:grid md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] w-full max-w-1000px py-30 md:pt-0 md:pb-20 gap-5 h-fit'>
          <div className='flex flex-col w-fit h-fit bg-black text-white gap-2 p-10px rounded-lg border-[#111111] border-[2px] z-[2] place-self-center md:justify-self-start'>
            <div className='aspect-square w-full max-w-[300px] rounded-md z-[3] backdrop-blur-[1px] bg-white/5 border-[1px] border-white/10 p-2 '>
              <NextImage
                alt='profile picture'
                src='/profile-picture.jpg'
                className='object-cover w-full rounded-md h-full'
                width={1280}
                height={1280}
                quality={50}
              />
            </div>
            <div>
              <h1 className='text-3xl font-bold'>
                Eyen Fernando Tuyon
              </h1>
              <p>Front-end developer</p>
            </div>
          </div>
          <SquareCore className='place-self-center relative aspect-square flex justify-center items-center w-full min-w-[150px] max-w-[300px] ' />
          <div className='bg-black md:col-span-2  border-[#111111] border-[2px] rounded-lg p-[10px] z-[2] text-white place-self-center '>
            Self-taught front-end developer with a strong focus on
            continuous learning and skill development. I actively
            explore new technologies and apply them to practical
            projects, with a particular interest in hardware and video
            games. I enjoy problem-solving and strive to deliver
            efficient, well-structured code in every project I work
            on. My goal is to stay updated with industry trends and
            consistently enhance the quality of my work.
          </div>
        </div>
        <div
          ref={ref}
          className='w-full h-[25px] absolute bottom-0'
        />
      </section>
      <section
        id='projects'
        className='flex flex-col items-center relative  p-5 md:p-10 overflow-ellipsis'
      >
        <div className='flex flex-col gap-5 justify-between max-w-1000px w-full'>
          <Tecnologies />
          <ScrollArea classNameViewport='h-full max-h-650px w-full'>
            <div className='grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4'>
              {projectsElements}
            </div>
          </ScrollArea>
        </div>
      </section>
      <section
        className='flex flex-col gap-2 color-white justify-center items-center h-[500px] relative p-10'
        id='contact'
      >
        <p className='text-2xl text-center'>Contact me</p>
        <div className='bg-white/5 flex justify-between gap-5 flex-wrap rounded-lg border-white/20 border-1px max-w-1000px p-5'>
          <div className='flex gap-2 w-fit'>
            <IconMail />
            <p>eyentuyon@proton.me</p>
          </div>
          <div className='flex gap-2 w-fit'>
            <IconBrandLinkedin />
            <a
              href='https://www.linkedin.com/in/eyentuyon/'
              target='_blank'
              rel='noreferrer'
            >
              <p>Eyen Tuyon</p>
            </a>
          </div>
          <div className='flex gap-2 w-fit'>
            <IconBrandGithub />
            <a
              href='https://github.com/Apheiro'
              target='_blank'
              rel='noreferrer'
            >
              <p>Apheiros</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
