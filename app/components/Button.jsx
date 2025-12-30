"use client";

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 select-none";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover active:scale-[0.97]",
    ghost:
      "bg-transparent border border-card-border text-text hover:bg-hover-light dark:hover:bg-hover-dark",
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
