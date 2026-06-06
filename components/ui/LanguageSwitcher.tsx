"use client";

import styled from "styled-components";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

const Container = styled.div`
  display: flex;
  gap: var(--space-1);
  align-items: center;
`;

const LangButton = styled.button<{ $active: boolean }>`
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid ${({ $active }) => ($active ? "var(--color-accent)" : "var(--color-border)")};
  background: ${({ $active }) => ($active ? "rgba(0, 212, 255, 0.12)" : "transparent")};
  color: ${({ $active }) => ($active ? "var(--color-accent)" : "var(--color-text-muted)")};
  font-size: var(--font-size-xs);
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: rgba(0, 212, 255, 0.08);
  }
`;

const labels: Record<string, string> = { en: "EN", it: "IT", th: "TH" };

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: string) {
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/") || "/");
  }

  return (
    <Container>
      {routing.locales.map((loc) => (
        <LangButton
          key={loc}
          $active={loc === locale}
          onClick={() => switchLocale(loc)}
          aria-label={`Switch to ${loc.toUpperCase()}`}
          aria-current={loc === locale ? "true" : undefined}
        >
          {labels[loc]}
        </LangButton>
      ))}
    </Container>
  );
}
