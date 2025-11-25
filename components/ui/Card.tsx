import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? {
        whileHover: { y: -5, transition: { duration: 0.2 } },
      }
    : {};

  return (
    <Component
      className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
      {...hoverProps}
    >
      {children}
    </Component>
  );
}
