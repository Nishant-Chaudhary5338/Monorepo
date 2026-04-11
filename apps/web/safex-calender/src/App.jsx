import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MonthPage from "./pages/MonthPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/:monthId" element={<MonthPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
