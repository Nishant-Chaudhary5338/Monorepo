import React from "react";
import ShowAll from "../components/ShowAll";
import MonthTitle from "../components/MonthTitle";
import BirdCard from "../components/BirdCard";
import { useNavigate } from "react-router";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import CalenderShot from "../components/CalenderShot";
import audio from "/audio/dec.mp3";
import LogoSafex from "../components/LogoSafex";
import SootheSensesPara from "../components/SootheSensesPara";

const Dec2024 = () => {
  const navigate = useNavigate();
  return (
    <div
      loading='lazy'
      className='pb-6 text-center bg-no-repeat bg-cover bg-responsive sm:px-20'
    >
      <div className='2xl:pt-[300px] xl:pt-[150px] pt-[48.88px] text-center'>
        <LogoSafex size='small' />

        <MonthTitle title='Decemeber 2024' />
        <SootheSensesPara use='month' />
      </div>
      <div className='flex justify-center py-6 space-x-2'>
        <button onClick={() => navigate("/nov")} className='flex-0'>
          <AiOutlineLeft color='#FDFDFD' size={30} className='font-bold' />
        </button>
        <BirdCard
          birdImage={"/mobile2/dec.png"}
          birdName='Himalayan Shrike-Babbler'
          artist='Recorded by Peter Boesman'
          song={audio}
        />
        <button onClick={() => navigate("/home")} className='flex-0'>
          <AiOutlineRight color='#FDFDFD' size={30} />
        </button>
      </div>

      <div className='flex justify-center pb-6 px-[30px] space-x-2'>
        <span></span>
        <CalenderShot dates='/dates/dec.png' xlDates='/desktop/dates/dec.png' />
        <span></span>
      </div>
      <ShowAll />
    </div>
  );
};

export default Dec2024;

/*
<div className='pb-20 text-center bg-no-repeat bg-cover bg-xxs-bg sm:px-20'>
      <div className='xl:pt-[300px] pt-[48.88px] text-center'>
        <img className='w-[96px] mx-auto' src='mobile/safex_white.png' alt='' />

        <MonthTitle title='December 2023' />
        <p className='text-[12px] uppercase tracking-[1.2px] text-white font-["Helvetica_Neue_Medium"]'>
          to soothe your senses
        </p>
      </div>
      <div className='flex justify-center py-6 space-x-2'>
        <button onClick={() => navigate("/nov2023")} className='flex-0'>
          <AiOutlineLeft color='#FDFDFD' size={30} className='font-bold' />
        </button>
        <BirdCard
          birdImage={"/mobile/mobile-birds/dec-2023.png"}
          birdName='Himalayan Monal'
          song={audio}
          artist='Recorded by Peter Boesman'
        />
        <button onClick={() => navigate("/jan")} className='flex-0'>
          <AiOutlineRight color='#FDFDFD' size={30} />
        </button>
      </div>

      <div className='flex justify-center pb-10 px-[30px] space-x-2'>
        <span></span>
        <CalenderShot dates='/dates/dec-2023.png' />
        <span></span>
      </div>
      <ShowAll />
    </div>
    */
