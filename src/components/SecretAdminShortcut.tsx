'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SecretAdminShortcut() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      const isKeyA = e.key === 'A' || e.key === 'a';

      // If user is focused inside an input field or search bar:
      // Only trigger if Ctrl+Shift+A or Alt+A is pressed (so normal typing of 'A' or Ctrl+A select-all is preserved)
      if (isInput) {
        if (
          (e.ctrlKey && e.shiftKey && isKeyA) ||
          (e.altKey && isKeyA)
        ) {
          e.preventDefault();
          router.push('/admin');
        }
        return;
      }

      // Outside of input fields (anywhere on the page):
      // Pressing Shift + A, Ctrl + A, or Alt + A immediately opens the admin portal
      if (isKeyA && (e.shiftKey || e.ctrlKey || e.altKey)) {
        e.preventDefault();
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null;
}
