'use client';

import { Box, Card, Container, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';

const steps = [
  {
    step: 'Step 01',
    title: 'Upload Clothing Photo',
    description:
      'Upload a clear photo of your clothing item. For better accuracy, make sure the background is clean and the clothing is clearly visible.',
  },
  {
    step: 'Step 02',
    title: 'Pick Your Recommendation Filters',
    description:
      'Set your preferred price range and clothing material. These filters are optional and can be prioritized based on your preferences.',
  },
  {
    step: 'Step 03',
    title: 'Top 10 Brand Matches',
    description:
      'Discover the top 10 brands that best match your clothing, ranked by similarity score.',
  },
];

export function HowItWorksSection() {
  return (
    <Box id="how-it-works" bg="brand.0" py="xl">
      <Container size="md" py="xl">
        <Stack gap="xs" align="center" mb="xl">
          <Title order={2} fw={400} c="brand.8" ta="center">
            How To Use LookAlike
          </Title>
          <Text fz="sm" c="brand.7" ta="center" maw="28rem">
            Three effortless steps to transform outfit inspiration into exact fashion items available in
            stores.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          {steps.map((item) => (
            <Card
              key={item.step}
              padding="lg"
              radius="md"
              bg="brand.0"
              bd="1px solid brand.4"
              shadow="sm"
            >
              <Stack gap="xs" align="center">
                <ThemeIcon size="xl" radius="md" color="brand.8" />
                <Text fz="xs" tt="uppercase" c="brand.3" mt="sm" style={{ letterSpacing: '0.1em' }}>
                  {item.step}
                </Text>
                <Text fz="md" fw={600} c="brand.8" ta="center">
                  {item.title}
                </Text>
                <Text fz="sm" c="brand.7" ta="center">
                  {item.description}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
