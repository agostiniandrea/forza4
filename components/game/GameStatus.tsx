"use client";

import styled, { keyframes } from "styled-components";
import Button from "@/components/ui/Button";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  animation: ${fadeUp} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
`;

interface Props {
  onPlayAgain: () => void;
}

export default function GameStatus({ onPlayAgain }: Props) {
  return (
    <Wrapper>
      <Button $variant="primary" onClick={onPlayAgain}>Play again</Button>
    </Wrapper>
  );
}
