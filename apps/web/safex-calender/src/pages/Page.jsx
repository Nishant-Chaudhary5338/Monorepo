import React from "react";
import SinglePage from "../components/SinglePage";
import nov2023 from "/audio/nov-2023.mp3";
import dec2023 from "/audio/dec-2023.mp3";
import jan from "/audio/jan.mp3";
import feb from "/audio/feb.mp3";
import mar from "/audio/mar.mp3";
import apr from "/audio/apr.mp3";
import may from "/audio/may.mp3";
import jun from "/audio/jun.mp3";
import jul from "/audio/jul.mp3";
import aug from "/audio/aug.mp3";
import sep from "/audio/sep.mp3";
import oct from "/audio/oct.mp3";
import nov from "/audio/nov.mp3";
import dec from "/audio/dec.mp3";
const Page = () => {
  return (
    <div>
      <SinglePage
        path='/nov2023'
        monthTitle='November 2023'
        birdImage='/mobile/mobile-birds/nov-2023.png'
        birdName='Indian Paradise Fly Catcher'
        artistName='Recorded by Conrad Pinto'
        song={nov2023}
        dates='/dates/nov-2023.png'
      />
      <SinglePage
        id='dec2023'
        path='/dec2023'
        monthTitle='December 2023'
        birdImage='/mobile/mobile-birds/dec-2023.png'
        birdName='Himalayan Monal'
        artistName='Recorded by Peter Boesman'
        song={dec2023}
        dates='/dates/dec-2023.png'
      />
      <SinglePage
        id='jan2024'
        monthTitle='January 2023'
        path='/jan'
        birdImage='/mobile/mobile-birds/jan.png'
        birdName='Red-Headed Trogon'
        artistName='Recorded by Jelle Seharring'
        song={jan}
        dates='/dates/jan.png'
      />
      <SinglePage
        id='feb2024'
        path='/feb'
        monthTitle='Febuary 2023'
        birdImage='/mobile/mobile-birds/feb.png'
        birdName='Indian Blackbird'
        artistName='Recorded by Brian Cox'
        song={feb}
        dates='/dates/feb.png'
      />
      <SinglePage
        id='mar2023'
        path='/mar'
        monthTitle='March 2024'
        birdImage='/mobile/mobile-birds/mar.png'
        birdName='Indian Pitta'
        artistName='Recorded by Mandar Bhagat'
        song={mar}
        dates='/dates/mar.png'
      />
      <SinglePage
        id='apr2023'
        path='/apr'
        monthTitle='April 2024'
        birdImage='/mobile/mobile-birds/apr.png'
        birdName='Fired Tailed Myzornis'
        artistName='Recorded by Jelle Scharringa'
        song={apr}
        dates='/dates/apr.png'
      />
      <SinglePage
        id='may2023'
        path='/may'
        monthTitle='May 2024'
        birdImage='/mobile/mobile-birds/may.png'
        birdName='Indian Cuckoo'
        artistName='Recorded by David Edwards'
        song={may}
        dates='/dates/may.png'
      />
      <SinglePage
        id='jun2024'
        path='/jun'
        monthTitle='June 2024'
        birdImage='/mobile/mobile-birds/jun.png'
        birdName='Flame Throated Bulbul'
        artistName='Recorded by Jishnu Kizhakkillam'
        song={jun}
        dates='/dates/jun.png'
      />
      <SinglePage
        id='jul2024'
        path='/jul'
        monthTitle='July 2024'
        birdImage='/mobile/mobile-birds/jul.png'
        birdName='Indian Silverbill'
        artistName='Recorded by Stanislas Wroza'
        song={jul}
        dates='/dates/jul.png'
      />
      <SinglePage
        id='aug2024'
        path='/aug'
        monthTitle='August 2024'
        birdImage='/mobile/mobile-birds/aug.png'
        birdName='Malabar Trogon'
        artistName='Recorded by Jishnu Kizhakkillam'
        song={aug}
        dates='/dates/aug.png'
      />
      <SinglePage
        id='sep2024'
        path='/sep'
        monthTitle='September 2024'
        birdImage='/mobile/mobile-birds/sep.png'
        birdName='Black Lord Tit'
        artistName='Recorded by Frank Lambert'
        song={sep}
        dates='/dates/sep.png'
      />
      <SinglePage
        id='oct2024'
        path='/oct'
        monthTitle='October 2024'
        birdImage='/mobile/mobile-birds/oct.png'
        birdName='Indian Blue Robin'
        artistName='Recorded by Jelle Seharring'
        song={oct}
        dates='/dates/oct.png'
      />
      <SinglePage
        id='nov2024'
        path='/nov'
        monthTitle='November 2024'
        birdImage='/mobile/mobile-birds/nov.png'
        birdName='Orange Minivet'
        artistName='Recorded by Vir Joshi'
        song={nov}
        dates='/dates/nov.png'
      />
      <SinglePage
        id='dec2024'
        path='/dec'
        monthTitle='December 2024'
        birdImage='/mobile/mobile-birds/dec.png'
        birdName='Himalayan Shrike-Babbler'
        artistName='Himalayan Shrike-Babbler'
        song={dec}
        dates='/dates/dec.png'
      />
    </div>
  );
};

export default Page;
