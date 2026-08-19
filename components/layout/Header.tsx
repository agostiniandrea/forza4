"use client";

import styled from "styled-components";
import { mq } from "@/lib/breakpoints";

const Nav = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(7, 8, 15, 0.85);

  ${mq.md} {
    padding: var(--space-4) var(--space-10);
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const LogoText = styled.span`
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-p1) 0%, var(--color-p2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LogoIcon = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
`;

const Dot = styled.span<{ $p: 1 | 2 }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $p }) => ($p === 1 ? "var(--color-p1)" : "var(--color-p2)")};
  display: block;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
`;

const IconBtn = styled.button<{ $on?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: transparent;
  color: ${({ $on }) => ($on ? "var(--color-accent)" : "var(--color-text-muted)")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all var(--transition-fast);

  @media (hover: hover) {
    &:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
      background: rgba(0, 212, 255, 0.08);
    }
  }
`;

interface Props {
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  /* Present only mid-game: the settings bar is hidden then, so this is the
     way back out to setup. */
  onNewGame?: () => void;
}

export default function Header({ soundEnabled, onToggleSound, isFullscreen, onToggleFullscreen, onNewGame }: Props) {
  return (
    <Nav>
      <Logo aria-label="Forza 4">
        <LogoIcon aria-hidden="true">
          <Dot $p={1} />
          <Dot $p={2} />
          <Dot $p={1} />
          <Dot $p={2} />
        </LogoIcon>
        <LogoText>FORZA 4</LogoText>
      </Logo>
      <Controls>
        {onNewGame && (
          <IconBtn onClick={onNewGame} aria-label="New game" title="New game">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 8a6 6 0 1 1-1.76-4.24M14 2v4h-4" />
            </svg>
          </IconBtn>
        )}
        <IconBtn
          $on={soundEnabled}
          onClick={onToggleSound}
          aria-label={soundEnabled ? "Sound on" : "Sound off"}
          title="Toggle sound"
        >
          {soundEnabled ? "🔊" : "🔇"}
        </IconBtn>
        {onToggleFullscreen && (
          <IconBtn
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 6h4V2M15 6h-4V2M1 10h4v4M15 10h-4v4" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 1H1v4M11 1h4v4M11 15h4v-4M5 15H1v-4" />
              </svg>
            )}
          </IconBtn>
        )}
      </Controls>
    </Nav>
  );
}
