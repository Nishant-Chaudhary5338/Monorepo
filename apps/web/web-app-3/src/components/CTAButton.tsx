interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export function CTAButton({
  children,
  onClick,
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  const baseStyles =
    "inline-block rounded-full px-8 py-4 text-lg font-semibold transition-all duration-200";
  const variantStyles = {
    primary:
      "bg-linear-to-r from-purple-600 to-cyan-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50",
    secondary:
      "border border-white/20 text-slate-200 hover:bg-white/10",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}