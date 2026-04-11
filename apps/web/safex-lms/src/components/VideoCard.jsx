import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { MdPlayCircleOutline } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { videoInteraction } from '../api/videoInteraction';
import { FaWindowClose } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";

const VideoCard = ({ src, videoId }) => {
	const [showVideo, setShowVideo] = useState(false);
	const [startTime, setStartTime] = useState(null);
	const [totalPlayedTime, setTotalPlayedTime] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		let interval;
		if (showVideo) {
			if (isPlaying) {
				interval = setInterval(() => {
					const elapsedTime = Date.now() - startTime;
					setTotalPlayedTime(elapsedTime);
					console.log('Total Played Time:', elapsedTime);
				}, 1000);
			}
		} else {
			clearInterval(interval);
			setTotalPlayedTime(0);
			setStartTime(null);
		}
		return () => clearInterval(interval);
	}, [showVideo, isPlaying, startTime]);

	const toggleVideo = async () => {
		setShowVideo(!showVideo);
		if (!showVideo) {
			setStartTime(Date.now());
			setIsPlaying(true);
		} else {
			setIsPlaying(false);
			
			handleVideoClose();
		}
	};

	

	const onPlayerStateChange = (event) => {
		if (event.data === YouTube.PlayerState.PLAYING) {
			setIsPlaying(true);
		} else {
			setIsPlaying(false);
		}
	};

	const handleVideoClose = async () => {
		await videoInteraction("nishant.chaudhary@agcaretech.com", "training 1", 28, 5)
        setShowVideo(false);
		setIsPlaying(false);
	};

	const videoModal = (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'>
			<div className='relative w-11/12 bg-white rounded-lg shadow-lg md:w-2/3 lg:w-1/2'>
				<div className='relative flex flex-row pb-9/16'>
					<YouTube
						videoId={videoId}
						onStateChange={onPlayerStateChange}
						opts={{ playerVars: { autoplay: 1 } }}
						className="absolute top-0 left-0 w-full h-full"
					/>
					<IoIosCloseCircleOutline
						size={40} 
						onClick={handleVideoClose} 
						className='absolute text-red-500 cursor-pointer top-2 right-2' 
					/>
				</div>
				<p className='p-4 text-center'>Total Played Time: {Math.floor(totalPlayedTime / 1000)} seconds</p>
			</div>
		</div>
	);
	

	return (
		<div className='flex flex-col m-4 rounded-md shadow-xl w-72 h-60 bg-teal-50 hover:scale-105'>
			<h3 className='self-end px-2 pr-2 mt-2 text-xs text-white bg-green-500 rounded-md'>
				ONLINE
			</h3>
			<img className='w-48 mx-2' src={src} alt='' />
			<div className='flex items-center justify-between mx-2'>
				<p className='text-sm text-green-500'>Training 1</p>
				<MdPlayCircleOutline color='green' onClick={toggleVideo} />
			</div>
			<div className='mx-2 text-xs text-left'>
				<p>Heading</p>
				<p>Due Date</p>
				<p>Some Extra Info</p>
			</div>
			{showVideo && videoModal}
		</div>
	);
};

export default VideoCard;
