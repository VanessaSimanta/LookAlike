'use client';

import { useState } from 'react';
import { Carousel } from '@mantine/carousel';
import { Box, Image, Stack, Text } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';

const slides = [
  { src: '/carousel-images/slide-2.png', caption: 'Upload your outfit & set preferences' },
  { src: '/carousel-images/slide1.png', caption: 'Get your top 10 brand matches' },
];

const AUTOPLAY_INTERVAL = 4000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [plugins] = useState(() => [
    Autoplay({ delay: AUTOPLAY_INTERVAL, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  return (
    <Box
      w="100%"
      bg="white"
      p={{ base: 'sm', sm: 'md' }}
      bd="1px solid brand.4"
      style={{ borderRadius: 28, boxShadow: '0 20px 50px -20px rgba(0, 0, 0, 0.25)' }}
    >
      <Carousel
        withIndicators
        withControls={false}
        emblaOptions={{ loop: true }}
        plugins={plugins}
        onSlideChange={setActive}
        pb="lg"
        styles={{
          indicators: { bottom: 0 },
          indicator: {
            width: 8,
            height: 8,
            borderRadius: 999,
            backgroundColor: 'var(--mantine-color-brand-4)',
            transition: 'width 300ms ease, background-color 300ms ease',
          },
        }}
        getIndicatorProps={(index) => ({
          'aria-label': `Go to slide ${index + 1}`,
          style:
            index === active
              ? { width: 22, backgroundColor: 'var(--mantine-color-brand-8)' }
              : undefined,
        })}
      >
        {slides.map((slide) => (
          <Carousel.Slide key={slide.src}>
            <Stack gap="xs" h={{ base: 260, sm: 380, md: 440 }}>
              <Text fz={{ base: 'md', sm: 'lg' }} c="brand.7" fw={700} ta="center">
                {slide.caption}
              </Text>
              <Box flex={1} mih={0}>
                <Image src={slide.src} alt={slide.caption} w="100%" h="100%" fit="contain" />
              </Box>
            </Stack>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}
