import React, { useState } from "react";

const QuizFormat = ({ quizData, onGoBack }) => {
  // Properties
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  // Helper Functions

  /* A possible answer was clicked */
  const optionClicked = (isCorrect) => {
    // Increment the score
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quizData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  /* Resets the game back to default */
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  return (
    <div className='bg-gray-200 shadow-2xl rounded-xl m-4 p-4 text-center'>
      {/* 1. Header */}
      <h1 className='text-xl font-bold'>{quizData.title}</h1>

      {/* 2. Current Score */}
      <h2>Score: {score}</h2>

      {/* 3. Show results or show the question game */}
      {showResults ? (
        /* 4. Final Results */
        <div className='final-results'>
          <h1>Final Results</h1>
          <h2>
            {score} out of {quizData.questions.length} correct - (
            {(score / quizData.questions.length) * 100}%)
          </h2>
          <button onClick={() => restartGame()}>Restart Quiz</button>
        </div>
      ) : (
        /* 5. Question Card */
        <div className=''>
          {/* Current Question */}
          <h2>
            Question: {currentQuestion + 1} out of {quizData.questions.length}
          </h2>
          <h3 className='text-md font-semibold'>
            {quizData.questions[currentQuestion].text}
          </h3>

          {/* List of possible answers */}
          <ul>
            {quizData.questions[currentQuestion].options.map((option) => {
              return (
                <li
                  className=' my-2 bg-white border rounded-md hover:bg-green-400 text-gray-800 text-sm font-semibold hover:scale-80 py-2 border-white space-y-2'
                  key={option.id}
                  onClick={() => optionClicked(option.isCorrect)}
                >
                  {option.text}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div>
        <button className='text-red-600' onClick={onGoBack}>
          GO BACK
        </button>
      </div>
    </div>
  );
};

export default QuizFormat;
