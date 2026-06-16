"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};

export default function ClientOnly({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  if (!mounted) return null;
  return <>{children}</>;
}
