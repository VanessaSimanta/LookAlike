'use client';

import { Box, Container, Stack, Text, Title } from '@mantine/core';

export function AboutUsSection() {
  return (
    <>
      <Box id="about-us" bg="brand.1" py="xl">
        <Container size="md" py="xl">
          <Stack gap="md">
            <Title order={2} fw={400} c="brand.8">
              About LookAlike
            </Title>
            <Text fz="sm" c="brand.7" maw="34rem">
              LookAlike is a clothing recommendation system built using deep learning to help users
              discover visually similar fashion items. By analyzing an uploaded clothing image, the
              system recommends products from multiple brands based on visual similarity, while also
              considering user preferences such as price and material for more relevant results.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Box component="footer" bg="brand.8" py="lg" px="md">
        <Text fz="xs" ta="center" c="brand.3">
          © 2026 LookAlike. Developed by Vanessa Simanta. All rights reserved.
        </Text>
      </Box>
    </>
  );
}
