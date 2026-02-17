'use client';

import { Toaster } from 'sileo';
import 'sileo/styles.css';

export function SileoProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" />
    </>
  );
}
