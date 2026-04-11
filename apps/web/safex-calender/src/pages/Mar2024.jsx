import React from "react";
import ShowAll from "../components/ShowAll";
import MonthTitle from "../components/MonthTitle";
import BirdCard from "../components/BirdCard";
import { useNavigate } from "react-router";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import CalenderShot from "../components/CalenderShot";
import audio from "/audio/mar.mp3";
import LogoSafex from "../components/LogoSafex";
import SootheSensesPara from "../components/SootheSensesPara";

const Mar2024 = () => {
  const navigate = useNavigate();
  return (
    <div
      loading='lazy'
      className='pb-6 text-center bg-no-repeat bg-cover bg-responsive sm:px-20'
    >
      <div className='2xl:pt-[300px] xl:pt-[150px] pt-[48.88px] text-center'>
        <LogoSafex size='small' />

        <MonthTitle title='March 2024' />
        <SootheSensesPara use='month' />
      </div>
      <div className='flex justify-center py-6 space-x-2'>
        <button onClick={() => navigate("/feb")} className='flex-0'>
          <AiOutlineLeft color='#FDFDFD' size={30} className='font-bold' />
        </button>
        <BirdCard
          birdImage={"/mobile2/mar.png"}
          birdImageXL={"/desktop/birds/mar.png"}
          birdName='Indian Pitta'
          song={audio}
          artist='Recorded by Mandar Bhagat'
        />
        <button onClick={() => navigate("/apr")} className='flex-0'>
          <AiOutlineRight color='#FDFDFD' size={30} />
        </button>
      </div>

      <div className='flex justify-center pb-6 px-[30px] space-x-2'>
        <span></span>
        <CalenderShot dates='dates/mar.png' xlDates='/desktop/dates/mar.png' />
        <span></span>
      </div>
      <ShowAll />
    </div>
  );
};

export default Mar2024;
