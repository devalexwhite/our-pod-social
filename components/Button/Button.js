import Link from "next/link";
import React from "react";
import styles from "./Button.module.css";

export const ButtonVariants = {
  Primary: "primary",
  Secondary: "secondary",
  Text: "text",
};

function RenderIcon(icon) {
  return React.createElement(icon, {
    className: "w-5 h-5 mr-3 -ml-1",
    ariaHidden: "true",
  });
}

function RenderLoadingSpinner() {
  return (
    <svg
      className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

export default function Button({
  isLink = false,
  href,
  onClick = () => {},
  label,
  icon,
  variant = ButtonVariants.Primary,
  loading = false,
}) {
  const classes = `${styles["button"]} ${styles[variant]} ${
    loading ? styles["loading"] : ""
  }`;

  return (
    <>
      {isLink ? (
        <Link href={href}>
          <a className={classes}>
            {icon && !loading && RenderIcon(icon)}
            {loading && RenderLoadingSpinner()}
            {label ? label : ""}
          </a>
        </Link>
      ) : (
        <button
          className={classes}
          onClick={onClick}
          disabled={loading ? true : null}
        >
          {icon && !loading && RenderIcon(icon)}
          {loading && RenderLoadingSpinner()}
          {label ? label : ""}
        </button>
      )}
    </>
  );
}
