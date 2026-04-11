import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { getMonthData } from "../data/months";
import LogoSafex from "../components/LogoSafex";
import MonthTitle from "../components/MonthTitle";
import SootheSensesPara from "../components/SootheSensesPara";
import BirdCard from "../components/BirdCard";
import CalenderShot from "../components/CalenderShot";
import ShowAll from "../components/ShowAll";
import NotFoundPage from "./NotFoundPage";

const MonthPage = () => {
  const { monthId } = useParams();
  const navigate = useNavigate();
  const { current, previous, next } = getMonthData(monthId);

  if (!current) return <NotFoundPage />;

  const prevPath = previous ? previous.path : "/home";
  const nextPath = next ? next.path : "/home";

  return (
    <div className="pb-6 text-center bg-no-repeat bg-cover bg-responsive sm:px-20">

      <div className="pt-[48.88px] lg:pt-8 xl:pt-10 2xl:pt-14 text-center">
        <LogoSafex size="month" />
        <MonthTitle title={current.title} />
        <SootheSensesPara use="month" />
      </div>

      <div className="flex justify-center items-center py-6 space-x-2">
        <button onClick={() => navigate(prevPath)} className="flex-shrink-0" aria-label="Previous month">
          <AiOutlineLeft color="#FDFDFD" size={30} />
        </button>
        <BirdCard
          birdImage={current.bird_sm}
          birdImageXL={current.bird_xl}
          birdName={current.birdName}
          artist={current.artist}
          song={current.audio}
        />
        <button onClick={() => navigate(nextPath)} className="flex-shrink-0" aria-label="Next month">
          <AiOutlineRight color="#FDFDFD" size={30} />
        </button>
      </div>

      {/* Calendar: mobile only */}
      <div className="pb-6 sm:hidden">
        <CalenderShot
          dates={current.dates_sm}
          xlDates={current.dates_xl}
        />
      </div>

      <ShowAll />
    </div>
  );
};

export default MonthPage;
