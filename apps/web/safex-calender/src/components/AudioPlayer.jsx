import { useEffect, useState, useRef } from "react";
import useSound from "use-sound"; // for handling the sound
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { IconContext } from "react-icons";
import { useLocation, useNavigate } from "react-router-dom";

const AudioPlayer = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, duration, sound, stop }] = useSound(song, {
    volume: 1,
    loop: true,
    autoplay: false,
  });
  const [seconds, setSeconds] = useState();
  const location = useLocation();
  useEffect(() => {
    const handleRouteChange = () => {
      stop();
    };

    // Listen for the route change event
    window.addEventListener("beforeunload", handleRouteChange);

    return () => {
      stop();
      window.removeEventListener("beforeunload", handleRouteChange);
    };
  }, [location.pathname, play, stop]);

  const playingButton = () => {
    if (isPlaying) {
      pause(); // this will pause the audio
      setIsPlaying(false);
    } else {
      play(); // this will play the audio
      setIsPlaying(true);
    }
  };
  const [currTime, setCurrTime] = useState({
    min: "",
    sec: "",
  }); // current position of the audio in minutes and seconds

  const sec = duration / 1000;
  const min = Math.floor(sec / 60);
  const secRemain = Math.floor(sec % 60);
  const time = {
    min: min,
    sec: secRemain,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([])); // setting the seconds state with the current state
        const min = Math.floor(sound.seek([]) / 60);
        const sec = Math.floor(sound.seek([]) % 60);
        setCurrTime({
          min,
          sec,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  const audioRef = useRef(null);

  /* useEffect(() => {
    const handleUnload = () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      stop();
      // audioRef.current.pause();
      // audioRef.current.currentTime = 0;
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);*/

  return (
    <div ref={audioRef} className='items-center mx-auto text-center'>
      <div>
        {!isPlaying ? (
          <button className='playButton' onClick={playingButton}>
            <IconContext.Provider value={{ size: "40px", color: "#28332B" }}>
              <AiFillPlayCircle />
            </IconContext.Provider>
          </button>
        ) : (
          <button className='playButton' onClick={playingButton}>
            <IconContext.Provider value={{ size: "40px", color: "#28332B" }}>
              <AiFillPauseCircle />
            </IconContext.Provider>
          </button>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        <span className='text-[6px] font-["Helvetica_Neue"]'>
          {currTime.min}:{currTime.sec}
        </span>

        <input
          type='range'
          min='0'
          max={duration / 1000}
          default='0'
          value={seconds}
          className='accent-[#28332B] flex-1 font-[3px] h-1'
          onChange={(e) => {
            sound.seek([e.target.value]);
          }}
        />
        <span className='text-[6px] font-["Helvetica_Neue"]'>
          {time.min}:{time.sec}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
