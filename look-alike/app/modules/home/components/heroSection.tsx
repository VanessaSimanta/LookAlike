'use client';

import { Box, Button, Container, Divider, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';

const catalog = [
  { label: 'Uniqlo' },
  { label: 'Zara' },
  { label: 'H&M' },
  { label: 'Marks&Spencer' },
];

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'How It Works', href: '#' },
  { label: 'Recommender', href: '#' },
  { label: 'About Us', href: '#' },
];

export function HeroSection() {
  return (
    <Box bg="brand.1" mih="100vh">
      <Box bg="brand.8" py={8}>
        <Text fz="xs" ta="center" c="brand.4">
          Multi-Brand Fashion Recommendation System:{' '}
          <Text component="span" fz="xs" fw={600} c="brand.0">
            Uniqlo, Zara
          </Text>
          ,{' '}
          <Text component="span" fz="xs" fw={600} c="brand.0">
            H&amp;M
          </Text>,{' '}
          <Text component="span" fz="xs" fw={600} c="brand.0">
            Marks &amp; Spencer
          </Text>
        </Text>
      </Box>

      <Box component="header" bg="brand.1" style={{ borderBottom: '1px solid var(--mantine-color-brand-4)' }}>
        <Container size="xl" py={18}>
          <Group justify="space-between">
            <Group gap={10}>
              <Box
                bg="brand.8"
                c="brand.0"
                w={38}
                h={38}
                fz="lg"
                fw={600}
                style={{ borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                LA
              </Box>
              <Stack gap={0}>
                <Text fz={19} fw={600} c="brand.8">
                  LookAlike
                </Text>
                <Text fz={10} tt="uppercase" c="brand.3" style={{ letterSpacing: '0.08em' }}>
                  Your Personal Fashion Assistant
                </Text>
              </Stack>
            </Group>

            <Group gap={36} visibleFrom="sm">
              {navLinks.map((link) => (
                <Text
                  key={link.label}
                  component="a"
                  href={link.href}
                  fz="md"
                  c="brand.8"
                  style={{ textDecoration: 'none' }}
                >
                  {link.label}
                </Text>
              ))}

              <Group gap={4} style={{ cursor: 'pointer' }}>
                <Text component="span" fz="sm" c="brand.8">
                  Recommender
                </Text>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Group>

              <Text component="a" href="#" fz="sm" c="brand.8" style={{ textDecoration: 'none' }}>
                About Us
              </Text>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Hero */}
      <Box
        py={90}
        style={{
          backgroundImage: 'radial-gradient(var(--mantine-color-brand-4) 1.2px, transparent 1.2px)',
          backgroundSize: '22px 22px',
        }}
      >
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60} verticalSpacing={60}>
            <Stack gap={0}>
              <Title order={1} fz={46} fw={500} c="brand.8">
                Upload Any Outfit.
              </Title>
              <Title order={2} fz={46} fw={400} fs="italic" c="brand.3">
                To Find the Best Match
              </Title>

              <Text mt={22} maw={440} c="brand.7" fz="sm" lh={1.65}>
                A fashion recommendation system for Uniqlo, H&amp;M, Marks&amp;Spencer, and Zara in
                Indonesia.
              </Text>

              <Group gap={12} mt={32}>
                <Button size="md" radius="xl" color="brand.8">
                  Upload Image
                </Button>
                <Button
                  size="md"
                  radius="xl"
                  variant="outline"
                  color="brand.8"
                  styles={{ root: { borderColor: 'var(--mantine-color-brand-4)' } }}
                >
                  Learn How It Works
                </Button>
              </Group>

              <Divider my={28} maw={520} color="brand.4" />

              <Text fz={11} tt="uppercase" c="brand.3" mb={14} style={{ letterSpacing: '0.1em' }}>
                Supported Catalog
              </Text>
              <Group gap={40}>
                {catalog.map((item) => (
                  <Stack key={item.label} gap={2}>
                    <Text fz="xs" c="brand.3">
                      Logo
                    </Text>
                    <Text fz="sm" fw={600} c="brand.8">
                      {item.label}
                    </Text>
                  </Stack>
                ))}
              </Group>
            </Stack>

            <Box bg="brand.6" style={{ aspectRatio: '1 / 1', borderRadius: 28 }} />
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}