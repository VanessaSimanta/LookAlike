'use client';

import { Box, Button, Container, Divider, Group, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core';

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

const brandLogos = [
  { label: 'Uniqlo', image: '/brand-logo/Uniqlo.png' },
  { label: 'H&M', image: '/brand-logo/H&M.png' },
  { label: 'Marks & Spencer', image: '/brand-logo/M&S.svg' },
  { label: 'Zara', image: '/brand-logo/Zara.svg' },
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
                Upload Any Outfit
              </Title>
              <Title order={2} fz={46} fw={400} fs="italic" c="brand.7">
                To Find the Best Match
              </Title>

              <Text mt="lg" maw={440} c="brand.7" fz="lg">
                A fashion recommendation system for Uniqlo, H&amp;M, Marks&amp;Spencer, and Zara in
                Indonesia.
              </Text>

              <Group gap={12} mt="xl">
                <Button size="md" radius="xl" color="brand.8">
                  Upload Image
                </Button>
                <Button
                  size="md"
                  radius="xl"
                  variant="outline"
                  color="brand.8"
                  styles={{ root: { borderColor: 'var(--mantine-color-brand-8)' } }}
                >
                  Learn How It Works
                </Button>
              </Group>

              <Divider my={28} maw={520} color="brand.4" />

              <Text fz="sm" tt="uppercase" c="brand.3" mb="sm" style={{ letterSpacing: '0.1em' }}>
                Supported Catalog
              </Text>
              <Group gap={32} wrap="wrap">
                {brandLogos.map((brand) => (
                  <Box
                    key={brand.label}
                    h={32}
                    w={96}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Image
                      src={brand.image}
                      alt={brand.label}
                      h="100%"
                      w="auto"
                      maw="100%"
                      fit="contain"
                    />
                  </Box>
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