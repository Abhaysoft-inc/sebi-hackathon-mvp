"use client";

import { useEffect, useState, CSSProperties } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      // If window scrolled down more than 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add the event listener
    window.addEventListener("scroll", toggleVisibility);

    // Initial check on mount
    toggleVisibility();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const buttonStyle: CSSProperties = {
    backgroundColor: "#2563eb", // blue-600
    color: "white",
    padding: "0.75rem",
    borderRadius: "9999px", // rounded-full
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)", // shadow-lg
    transition: "all 300ms",
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "scale(1)" : "scale(0.9)",
    pointerEvents: isVisible ? "auto" : "none",
    cursor: "pointer",
    border: "none",
    outline: "none",
  };

  const svgStyle: CSSProperties = {
    width: "1.5rem",
    height: "1.5rem",
  };

  return (
    <button
      onClick={scrollToTop}
      style={buttonStyle}
      aria-label="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={svgStyle}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
}
