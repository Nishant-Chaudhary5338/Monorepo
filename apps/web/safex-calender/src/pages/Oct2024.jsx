import React from "react";
import ShowAll from "../components/ShowAll";
import MonthTitle from "../components/MonthTitle";
import BirdCard from "../components/BirdCard";
import { useNavigate } from "react-router";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import CalenderShot from "../components/CalenderShot";
import audio from "/audio/oct.mp3";
import LogoSafex from "../components/LogoSafex";
import SootheSensesPara from "../components/SootheSensesPara";

const Oct2024 = () => {
  const navigate = useNavigate();
  return (
    <div
      loading='lazy'
      className='pb-6 text-center bg-no-repeat bg-cover bg-responsive sm:px-20'
    >
      <div className='2xl:pt-[300px] xl:pt-[150px] pt-[48.88px] text-center'>
        <LogoSafex size='small' />

        <MonthTitle title='October 2024' />
        <SootheSensesPara use='month' />
      </div>
      <div className='flex justify-center py-6 space-x-2'>
        <button onClick={() => navigate("/sep")} className='flex-0'>
          <AiOutlineLeft color='#FDFDFD' size={30} className='font-bold' />
        </button>
        <BirdCard
          birdImage={"/mobile2/oct.png"}
          birdImageXL={"/desktop/birds/oct.png"}
          birdName='Indian Blue Robin'
          artist='Recorded by Jelle Seharring'
          song={audio}
        />
        <button onClick={() => navigate("/nov")} className='flex-0'>
          <AiOutlineRight color='#FDFDFD' size={30} />
        </button>
      </div>

      <div className='flex justify-center pb-6 px-[30px] space-x-2'>
        <span></span>
        <CalenderShot dates='dates/oct.png' xlDates='/desktop/dates/oct.png' />
        <span></span>
      </div>
      <ShowAll />
    </div>
  );
};

export default Oct2024;
