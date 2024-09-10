import { type LegacyRef, forwardRef, memo } from 'react';

const Xcircuits = forwardRef(
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
        className={className}
        ref={ref}
        id={id}
        viewBox='0 0 233 184'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M58 142L227 142C229.761 142 232 144.239 232 147L232 184'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M53 38L227 38C229.761 38 232 35.7614 232 33L232 3.68472e-05'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M232 90L30 90'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M232 77L0 77'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M232 64L39 64'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M232 129L47 129'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M232 116L61 116'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M232 103L23 103'
          className='stroke-[#3f0067] stroke-[3px]'
        />
        <path
          d='M232 51L23 51'
          className='stroke-[#3f0067] stroke-[3px]'
        />

        <path
          stroke={`url(#x${id}1)`}
          d='M58 142L227 142C229.761 142 232 144.239 232 147L232 184'
          className='stroke-[4px]'
        />
        <path
          stroke={`url(#x${id}2)`}
          d='M53 38L227 38C229.761 38 232 35.7614 232 33L232 3.68472e-05'
          className='stroke-[4px]'
        />
        <path
          stroke={`url(#x${id}3)`}
          d='M232 90L30 90'
          className='stroke-[4px]'
        />
        <path
          stroke={`url(#x${id}4)`}
          d='M232 77L0 77'
          className='stroke-[4px]'
        />
        <path
          stroke={`url(#x${id}5)`}
          d='M232 64L39 64'
          className='stroke-[4px]'
        />
        <path
          stroke={`url(#x${id}6)`}
          d='M232 129L47 129'
          className='stroke-[4px]'
        />
        <path
          stroke={`url(#x${id}7)`}
          d='M232 116L61 116'
          className='stroke-[4px]'
        />
        <path
          stroke={`url(#x${id}8)`}
          d='M232 103L23 103'
          className='stroke-[4px]'
        />
        <path
          stroke={`url(#x${id}9)`}
          d='M232 51L23 51'
          className='stroke-[4px]'
        />
        <defs>
          {Array.from({ length: 9 }, (_, idx) => (
            <linearGradient
              gradientUnits='userSpaceOnUse'
              key={`x${id}${idx + 1}`}
              id={`x${id}${idx + 1}`}
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

Xcircuits.displayName = 'Xcircuits';

const XcircuitsMemo = memo(Xcircuits);

export default XcircuitsMemo;
