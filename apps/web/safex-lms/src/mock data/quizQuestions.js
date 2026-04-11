export const quizzes = [
  {
    title: "Google Drive",
    id: 0,
    questions: [
      {
        id: 0,  
        text: "What is the capital of America?",
        options: [
          { id: 0, text: "New York City", isCorrect: false },
          { id: 1, text: "Boston", isCorrect: false },
          { id: 2, text: "Santa Fe", isCorrect: false },
          { id: 3, text: "Washington DC", isCorrect: true },
        ],
      },
      {
        id: 1,  
        text: "What year was the Constitution of America written?",
        options: [
          { id: 0, text: "1787", isCorrect: true },
          { id: 1, text: "1776", isCorrect: false },
          { id: 2, text: "1774", isCorrect: false },
          { id: 3, text: "1826", isCorrect: false },
        ],
      },
      // Add more questions for Quiz 1 as needed
    ],
  },
  {
    title: "Cyber Security",
    id: 1,
    questions: [
      {
        id: 0,  
        text: "Another quiz question?",
        options: [
          { id: 0, text: "Option 1", isCorrect: false },
          { id: 1, text: "Option 2", isCorrect: true },
          { id: 2, text: "Option 3", isCorrect: false },
          { id: 3, text: "Option 4", isCorrect: false },
        ],
      },
      {
        id: 1,  
        text: "Yet another quiz question?",
        options: [
          { id: 0, text: "Option A", isCorrect: true },
          { id: 1, text: "Option B", isCorrect: false },
          { id: 2, text: "Option C", isCorrect: false },
          { id: 3, text: "Option D", isCorrect: false },
        ],
      },
      // Add more questions for Quiz 2 as needed
    ],
  },
  {
    title: "IT Poilicy",
    id: 2,
    questions: [
      {
        id: 0,  
        text: "A question for Quiz 3?",
        options: [
          { id: 0, text: "Choice X", isCorrect: true },
          { id: 1, text: "Choice Y", isCorrect: false },
          { id: 2, text: "Choice Z", isCorrect: false },
        ],
      },
      {
        id: 1,  
        text: "Another question for Quiz 3?",
        options: [
          { id: 0, text: "Answer P", isCorrect: false },
          { id: 1, text: "Answer Q", isCorrect: false },
          { id: 2, text: "Answer R", isCorrect: true },
        ],
      },
      // Add more questions for Quiz 3 as needed
    ],
  },
  // You can add more quizzes in the same format
];
