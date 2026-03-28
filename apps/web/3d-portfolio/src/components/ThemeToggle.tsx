import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative size-10 rounded-full bg-black-200 dark:bg-black-200 bg-white-50 flex-center cursor-pointer transition-all duration-300 hover:scale-110 border border-black-50 dark:border-black-50 border-gray-300"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {/* Sun icon - visible in dark mode */}
      <svg
        className={`size-5 absolute transition-all duration-500 ${
          theme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-0"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="#fbbf24"
        strokeWidth={2}
      >
        <circle cx={12} cy={12} r={5} />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      {/* Moon icon - visible in light mode */}
      <svg
        className={`size-5 absolute transition-all duration-500 ${
          theme === "light"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-0"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="#6366f1"
        strokeWidth={2}
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </button>
  );
};

export default ThemeToggle;