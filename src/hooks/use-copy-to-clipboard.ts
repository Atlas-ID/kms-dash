'use client';

import { useState } from 'react';

export const useCopyToClipboard = (timeout = 2000) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      console.warn('Clipboard API not available');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { isCopied, copyToClipboard };
};
