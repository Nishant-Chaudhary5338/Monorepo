import React from "react";
import ShowAll from "../components/ShowAll";
import LogoSafex from "../components/LogoSafex";
import SootheSensesPara from "../components/SootheSensesPara";
import MonthTitle from "../components/MonthTitle";
import BirdCard from "../components/BirdCard";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { getMonthData } from "../data/months";
import ReactAudioPlayer from "react-audio-player";

const SinglePage = ({ title, Image }) => {
  const navigation = useNavigate();
  const { month } = useParams();
  const { current, next, previous } = getMonthData(month);
  return (
    <div className='h-screen px-2 bg-cyan-200'>
      <div className='flex flex-col items-center pt-20 space-y-5 text-center space-between'>
        <LogoSafex />
        <MonthTitle title={title} />
        <SootheSensesPara />
      </div>
      <div className='flex justify-end space-x-2 items-center sm:px-[50px] md:px-[100px]'>
        <button onClick={() => navigation(previous?.path)} className='flex-0'>
          LA
        </button>
        <div className='flex-1'>
          <BirdCard />
          <ReactAudioPlayer
            src='audio/audio.mp3'
            loop={true}
            autoPlay={true}
            controls={true}
          />
        </div>
        <button onClick={() => navigation(next?.path)} className='flex-0'>
          RA
        </button>
      </div>
    </div>
  );
};

export default SinglePage;
