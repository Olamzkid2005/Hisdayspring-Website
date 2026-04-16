"use client";

import { type ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md
        ${hover
          ? "transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          : ""
        }
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}
