'use client';

import { ActionIcon, Affix, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';

export function BackToTopButton() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: 24, right: 24 }}>
      <Transition transition="slide-up" mounted={scroll.y > 400}>
        {(transitionStyles) => (
          <ActionIcon
            style={transitionStyles}
            size={48}
            radius="xl"
            color="brand.8"
            variant="filled"
            aria-label="Back to top"
            onClick={() => scrollTo({ y: 0 })}
          >
            <svg
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
}
