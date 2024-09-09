import { type LegacyRef, forwardRef } from 'react';

const Ycircuits = forwardRef(
  (
    {
      className,
      id,
    }: {
      className?: string;
      id?: string;
    },
    ref: LegacyRef<SVGSVGElement>,
  ) => {
    return (
      <svg
        viewBox='0 0 188 274'
        ref={ref}
        id={id}
        fill='none'
        className={className}
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M44 114L44 267C44 269.761 41.7614 272 39 272L1.99997 272'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M148 114L148 267C148 269.761 150.239 272 153 272L186 272'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M135 272L135 79'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M96 272L96 55'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M109 272L109 11'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M122 272L122 29'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M57 272L57 55'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M70 272L70 2'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M83 272L83 40'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          stroke={`url(#y${id}1)`}
          d='M44 114L44 267C44 269.761 41.7614 272 39 272L1.99997 272'
          className='stroke-[5px]'
        />
        <path
          stroke={`url(#y${id}2)`}
          d='M148 114L148 267C148 269.761 150.239 272 153 272L186 272'
          className='stroke-[5px]'
        />
        <path
          stroke={`url(#y${id}3)`}
          d='M96 272L96 55'
          className='stroke-[5px]'
        />
        <path
          stroke={`url(#y${id}4)`}
          d='M109 272L109 11'
          className='stroke-[5px]'
        />
        <path
          stroke={`url(#y${id}5)`}
          d='M122 272L122 29'
          className='stroke-[5px]'
        />
        <path
          stroke={`url(#y${id}6)`}
          d='M57 272L57 55'
          className='stroke-[5px]'
        />
        <path
          stroke={`url(#y${id}7)`}
          d='M70 272L70 2'
          className='stroke-[5px]'
        />
        <path
          stroke={`url(#y${id}8)`}
          d='M83 272L83 40'
          className='stroke-[5px]'
        />
        <path
          stroke={`url(#y${id}9)`}
          d='M135 272L135 79'
          className=' stroke-[5px]'
        />

        <defs>
          {Array.from({ length: 9 }, (_, idx) => (
            <linearGradient
              gradientUnits='userSpaceOnUse'
              key={`y${id}${idx + 1}`}
              id={`y${id}${idx + 1}`}
              x1={0}
              x2={0}
            >
              <stop stopColor='#c532ff' stopOpacity='0' />
              <stop stopColor='#e732ff' />
              <stop offset='1' stopColor='#fc9cff' stopOpacity='0' />
            </linearGradient>
          ))}
        </defs>
      </svg>
    );
  },
);

export default Ycircuits;
