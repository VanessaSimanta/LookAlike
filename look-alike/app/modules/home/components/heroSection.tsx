'use client';

import {
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { HeroCarousel } from './heroCarousel';
import classes from './heroSection.module.css';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Recommender', href: '#recommender' },
  { label: 'About Us', href: '#about-us' },
];

const brandLogos = [
  { label: 'Uniqlo', image: '/brand-logo/Uniqlo.png' },
  { label: 'H&M', image: '/brand-logo/H&M.png' },
  { label: 'Marks & Spencer', image: '/brand-logo/M&S.svg' },
  { label: 'Zara', image: '/brand-logo/Zara.svg' },
];

export function HeroSection() {
  const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure(false);

  return (
    <>
      <Box bg="brand.8" py={8} px="md">
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

      <Box
        component="header"
        bg="brand.1"
        pos="sticky"
        top={0}
        style={{ zIndex: 100, borderBottom: '1px solid var(--mantine-color-brand-4)' }}
      >
        <Container size="xl" py={{ base: 12, sm: 18 }}>
          <Group justify="space-between" wrap="nowrap">
            <Group gap={10} wrap="nowrap">
              <Box
                bg="brand.8"
                c="brand.0"
                w={38}
                h={38}
                fz="lg"
                fw={600}
                style={{ borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                LA
              </Box>
              <Stack gap={0}>
                <Text fz={19} fw={600} c="brand.8">
                  LookAlike
                </Text>
                <Text fz={10} tt="uppercase" c="brand.3" visibleFrom="xs" style={{ letterSpacing: '0.08em' }}>
                  Your Personal Fashion Assistant
                </Text>
              </Stack>
            </Group>

            <Group gap={36} visibleFrom="md">
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

            <Burger
              opened={menuOpened}
              onClick={toggleMenu}
              hiddenFrom="md"
              size="sm"
              color="var(--mantine-color-brand-8)"
              aria-label="Toggle navigation"
            />
          </Group>
        </Container>
      </Box>

      <Drawer
        opened={menuOpened}
        onClose={closeMenu}
        position="right"
        size="75%"
        hiddenFrom="md"
        title={
          <Text fz={19} fw={600} c="brand.8">
            LookAlike
          </Text>
        }
        styles={{
          content: { backgroundColor: 'var(--mantine-color-brand-1)' },
          header: { backgroundColor: 'var(--mantine-color-brand-1)' },
        }}
      >
        <Stack gap="lg" mt="md">
          {navLinks.map((link) => (
            <Text
              key={link.label}
              component="a"
              href={link.href}
              fz="lg"
              c="brand.8"
              onClick={closeMenu}
              style={{ textDecoration: 'none' }}
            >
              {link.label}
            </Text>
          ))}
        </Stack>
      </Drawer>

      {/* Hero */}
      <Box
        py={{ base: 48, sm: 64, md: 90 }}
        style={{
          backgroundColor: 'var(--mantine-color-brand-1)',
          backgroundImage: 'radial-gradient(var(--mantine-color-brand-4) 1.2px, transparent 1.2px)',
          backgroundSize: '22px 22px',
        }}
      >
        <Container size="xl">
          <Box className={classes.heroGrid}>
            <Stack gap={0} className={classes.intro}>
              <Title
                order={1}
                fz={{ base: 48, sm: 60, md: 75 }}
                fw={600}
                c="brand.8"
                lh={1}
                style={{ letterSpacing: '-0.02em' }}
              >
                LookAlike
              </Title>
              <Title order={2} mt="sm" fz={{ base: 22, sm: 26, md: 30 }} fw={400} fs="italic" c="brand.7">
                Upload any outfit to find the best match
              </Title>

              <Text mt="lg" maw={440} c="brand.7" fz={{ base: 'md', sm: 'lg' }}>
                A fashion recommendation system for Uniqlo, H&amp;M, Marks&amp;Spencer, and Zara in
                Indonesia.
              </Text>
            </Stack>

            <Box className={classes.carousel}>
              <HeroCarousel />
            </Box>

            <Stack gap={0} className={classes.actions}>
              <Group gap={12} mt={{ base: 0, md: 'xl' }}>
                <Button component="a" href="#recommender" size="md" radius="xl" color="brand.8">
                  Upload Image
                </Button>
                <Button
                  component="a"
                  href="#how-it-works"
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
              <SimpleGrid cols={4} spacing={{ base: 'md', sm: 32 }} maw={480}>
                {brandLogos.map((brand) => (
                  <Box
                    key={brand.label}
                    h={32}
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
              </SimpleGrid>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
