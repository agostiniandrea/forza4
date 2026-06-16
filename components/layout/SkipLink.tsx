"use client";

import styled from "styled-components";

const Link = styled.a`
  position: absolute;
  top: -100%;
  left: var(--space-4);
  z-index: 9999;
  padding: var(--space-3) var(--space-6);
  background: var(--color-accent);
  color: #000;
  font-weight: 600;
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: top var(--transition-fast);

  &:focus {
    top: var(--space-4);
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

export default function SkipLink() {
  return <Link href="#main-content">Skip to main content</Link>;
}
