"use client";

import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

const fall = keyframes`
  0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
`;

const Particle = styled.div<{
  $x: number;
  $color: string;
  $size: number;
  $duration: number;
  $delay: number;
  $shape: "circle" | "rect";
}>`
  position: fixed;
  top: 0;
  left: ${({ $x }) => $x}%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size, $shape }) => ($shape === "rect" ? $size * 0.5 : $size)}px;
  border-radius: ${({ $shape }) => ($shape === "circle" ? "50%" : "2px")};
  background: ${({ $color }) => $color};
  pointer-events: none;
  z-index: 200;
  animation: ${fall} ${({ $duration }) => $duration}s ${({ $delay }) => $delay}s ease-in forwards;
`;

const colors = [
  "var(--color-p1)",
  "var(--color-p2)",
  "var(--color-accent)",
  "#FF6BF5",
  "#6BFF8A",
  "#FFFFFF",
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const particles = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: rand(0, 100),
  color: colors[Math.floor(Math.random() * colors.length)],
  size: rand(6, 14),
  duration: rand(2.5, 4.5),
  delay: rand(0, 0.8),
  shape: Math.random() > 0.5 ? ("circle" as const) : ("rect" as const),
}));

interface Props {
  active: boolean;
}

export default function Confetti({ active }: Props) {
  if (!active) return null;

  return (
    <>
      {particles.map((p) => (
        <Particle
          key={p.id}
          $x={p.x}
          $color={p.color}
          $size={p.size}
          $duration={p.duration}
          $delay={p.delay}
          $shape={p.shape}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
