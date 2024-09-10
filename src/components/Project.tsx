import { TooltipWrapper } from '@/core/Tooltip';
import { IconAlertTriangle } from '@tabler/icons-react';
import NextImage from 'next/image';

function Project({
  img,
  link,
  description,
  disclaimer,
}: {
  img: { url: string; width: number; height: number };
  description: string;
  link?: string;
  disclaimer?: string;
}) {
  return (
    <div className='hoverItem  z-2 cursor-pointer'>
      <a
        href={link}
        className='flex flex-col gap-2'
        target='_blank'
        rel='noreferrer'
      >
        <div className=' w-full h-full max-h-150px rounded-md z-3 border-1px border-white/10 overflow-hidden relative'>
          {disclaimer && (
            <TooltipWrapper
              content={disclaimer}
              className='text-red-3 max-w-200px z-3'
            >
              <div className='absolute z-2 bottom-2 left-2'>
                <IconAlertTriangle
                  height={20}
                  width={20}
                  color='#ff9696'
                />
              </div>
            </TooltipWrapper>
          )}
          <NextImage
            alt='profile picture'
            src={img.url}
            className='changeItem grayscale-100 duration-1000 object-cover w-full rounded-md h-full transition-[transform,_filter]'
            width={img.width}
            height={img.height}
            quality={30}
          />
        </div>
        <div className='bg-black border-[#111111] border-[2px] text-white rounded-lg z-[1] p-2 w-full'>
          <p className='line-clamp-3'>{description}</p>
        </div>
      </a>
    </div>
  );
}

export default Project;
