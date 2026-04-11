import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AudioPlayer from "./AudioPlayer";

const BirdCard = ({ birdImage, song, birdName, artist, birdImageXL }) => {
  return (
    <div className='w-full sm:w-fit sm:mx-auto bg-[#f7f7f7] bg-opacity-60 backdrop-filter'>
      <div>
        {/* Mobile */}
        <LazyLoadImage
          effect='blur'
          className='w-full sm:hidden'
          src={birdImage}
          alt=''
          loading='lazy'
        />
        <img
          src={birdImageXL}
          alt=''
          loading='lazy'
          className='hidden sm:block mx-auto lg:h-[45vh] xl:h-[50vh] 2xl:h-[55vh] w-auto'
        />
      </div>
      <div className='pt-0 -mt-4 space-y-1'>
        <h3 className="text-[20px] lg:text-[22px] xl:text-[28px] 2xl:text-[36px] font-['Times_New_Roman']">
          {birdName}
        </h3>
        <p className="text-[9px] lg:text-[12px] xl:text-[14px] 2xl:text-[16px] font-['Helvetica_Neue']">
          {artist}
        </p>
      </div>
      <div className='px-2 pb-4'>
        <AudioPlayer song={song} />
      </div>
    </div>
  );
};

export default BirdCard;
