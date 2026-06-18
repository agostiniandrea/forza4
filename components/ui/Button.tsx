"use client";

import styled, { css } from "styled-components";

type Variant = "primary" | "ghost" | "danger";

interface Props {
  $variant?: Variant;
  $small?: boolean;
}

const Button = styled.button<Props>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: ${({ $small }) => ($small ? "var(--space-2) var(--space-4)" : "var(--space-3) var(--space-6)")};
  border-radius: var(--radius-full);
  font-size: ${({ $small }) => ($small ? "var(--font-size-sm)" : "var(--font-size-md)")};
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--transition-normal);
  white-space: nowrap;

  ${({ $variant = "primary" }) =>
    $variant === "primary" &&
    css`
      background: linear-gradient(135deg, var(--color-accent), #0099CC);
      color: #000;
      border-color: transparent;
      box-shadow: 0 0 20px var(--color-accent-glow);
      @media (hover: hover) {
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 30px var(--color-accent-glow), 0 4px 16px rgba(0, 0, 0, 0.3);
        }
      }
      &:active { transform: translateY(0); }
    `}

  ${({ $variant }) =>
    $variant === "ghost" &&
    css`
      background: transparent;
      color: var(--color-text-muted);
      border-color: var(--color-border);
      @media (hover: hover) {
        &:hover {
          color: var(--color-text);
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.04);
        }
      }
    `}

  ${({ $variant }) =>
    $variant === "danger" &&
    css`
      background: transparent;
      color: var(--color-p1);
      border-color: var(--color-p1);
      @media (hover: hover) {
        &:hover {
          background: var(--color-p1-glow-soft);
        }
      }
    `}

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;

export default Button;
