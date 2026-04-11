// QuizList.js
import React from "react";
import QuizCard from "./QuizCard";

const QuizList = ({ quizzes, onQuizCardClick }) => {
  return (
    <div className='flex flex-wrap'>
      {quizzes.map((quiz, index) => (
        <QuizCard
          key={quiz.id}
          onQuizCardClick={() => onQuizCardClick(quiz)}
          quizData={quiz}
        />
      ))}
    </div>
  );
};

export default QuizList;
