import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      role="switch"
      aria-checked={isDark ? "true" : "false"}
      aria-label="Toggle color theme"
      onClick={toggleTheme}
    >
      <span className="toggle-knob" />
    </button>
  );
};

export default ThemeToggle;
