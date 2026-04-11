import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home page/HomePage';
import Dashboard from './pages/dashboard/Dashboard';
import LoginPage from './pages/login page/LoginPage';
import UserPolicyPage from './pages/user policy/UserPolicyPage';
import QuizPage from './pages/quiz page/QuizPage';
import TrainingPage from './pages/training page/TrainingPage';
import MainLayout from './components/MainLayout';
import ProgressPage from './pages/progress page/ProgressPage';
import ProfilePage from './pages/profile page/ProfilePage';
import GenerateIDCardPage from './pages/generate ID Card/GenerateIDCardPage';
import FeedbackPage from './pages/feedback/FeedbackPage';
import EmployeesPage from './pages/employees/EmployeesPage';
import Dummypage from './pages/dummy page/Dummypage';
import NotFound from './pages/not found/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Redirect from the root path to the login page */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {/* Protected routes inside the main layout */}
      <Route path="/" element={<MainLayout />}>
        {/* Nested routes inside the main layout */}
        <Route path="home" element={<HomePage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="training" element={<TrainingPage />} />
        <Route path="policy" element={<UserPolicyPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="idCard" element={<GenerateIDCardPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="blank" element={<Dummypage />} />
      </Route>
      {/* Redirect any unmatched routes to the NotFound page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
