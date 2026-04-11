// Routes.js
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import Dashboard from './Dashboard';
import TrainingPage from './TrainingPage';
import UserPolicyPage from './UserPolicyPage';
import QuizPage from './QuizPage';
import ProfilePage from './ProfilePage';

function CustomRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/policy" element={<UserPolicyPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default CustomRoutes;
