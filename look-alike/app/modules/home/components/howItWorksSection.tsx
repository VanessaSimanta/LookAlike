'use client';

import { Box, Card, Container, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { LuListChecks, LuSparkles, LuUpload } from 'react-icons/lu';

const steps = [
  {
    step: 'Step 01',
    icon: LuUpload,
    title: 'Upload & Crop Photo',
    description:
      'Upload a clear photo of your clothing item, then crop it to focus on the clothing for more accurate results.',
  },
  {
    step: 'Step 02',
    icon: LuListChecks,
    title: 'Pick Your Preferences',
    description:
      'Set your preferred price range and clothing material. These filters are optional and can be prioritized based on your preferences.',
  },
  {
    step: 'Step 03',
    icon: LuSparkles,
    title: 'Top 10 Product Matches',
    description:
      'Discover the top 10 products from our brands that best match your clothing.',
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
                <ThemeIcon size="xl" radius="md" color="brand.8">
                  <item.icon size={22} />
                </ThemeIcon>
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
