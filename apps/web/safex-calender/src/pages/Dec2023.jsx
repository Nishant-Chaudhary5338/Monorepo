import React from "react";
import ShowAll from "../components/ShowAll";
import MonthTitle from "../components/MonthTitle";
import BirdCard from "../components/BirdCard";
import { useNavigate } from "react-router";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import CalenderShot from "../components/CalenderShot";
import audio from "/audio/dec-2023.mp3";
import LogoSafex from "../components/LogoSafex";
import SootheSensesPara from "../components/SootheSensesPara";

const Dec2023 = () => {
  const navigate = useNavigate();
  return (
    <div
      className='pb-6 text-center bg-no-repeat bg-cover bg-responsive sm:px-20'
      loading='lazy'
    >
      <div className='2xl:pt-[300px] xl:pt-[150px] pt-[48.88px] text-center'>
        <LogoSafex size='small' />

        <MonthTitle title='December 2023' />
        <SootheSensesPara use='month' />
      </div>
      <div className='flex justify-center py-6 space-x-2'>
        <button onClick={() => navigate("/nov2023")} className='flex-0'>
          <AiOutlineLeft color='#FDFDFD' size={30} className='font-bold' />
        </button>
        <BirdCard
          birdImage={"/mobile2/dec23.png"}
          birdImageXL={"/desktop/birds/dec.png"}
          birdName='Himalayan Monal'
          song={audio}
          artist='Recorded by Peter Boesman'
        />
        <button onClick={() => navigate("/jan")} className='flex-0'>
          <AiOutlineRight color='#FDFDFD' size={30} />
        </button>
      </div>

      <div className='flex justify-center pb-6 px-[30px] space-x-2'>
        <span></span>
        <CalenderShot
          dates='/dates/dec2023.png'
          xlDates='/desktop/dates/dec23.png'
        />
        <span></span>
      </div>
      <ShowAll />
    </div>
  );
};

export default Dec2023;
