// QuizCard.js
import React from "react";
import { MdPlayCircleOutline } from "react-icons/md";

const QuizCard = ({ onQuizCardClick, quizData }) => {
  const handleCardClick = () => {
    onQuizCardClick(quizData);
  };

  return (
    <div>
      <div
        onClick={handleCardClick}
        className='w-72 h-60 rounded-md bg-teal-50 shadow-xl flex flex-col m-4 hover:scale-105'
      >
        <h3 className='text-xs px-2 rounded-md mt-2 text-white bg-green-500 self-end pr-2'>
          ONLINE
        </h3>
        <img className='mx-2 w-48' src='assets/quiz.jpg' alt='' />
        <div className='flex items-center justify-between mx-2'>
          <p className='text-sm text-green-500'>Training 1</p>
          <MdPlayCircleOutline color='green' size={30} />
        </div>
        <div className='text-xs text-left mx-2'>
          <p className='text-xl font-semibold'>{quizData.title}</p>
          <p>Due Date</p>
          <p>Some Extra Info</p>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
