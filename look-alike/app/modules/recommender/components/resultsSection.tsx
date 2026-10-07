'use client';

import { useState } from 'react';
import {
  ActionIcon,
  AspectRatio,
  Badge,
  Box,
  Card,
  Container,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ProductDetailModal } from './productDetailModal';

export type Product = {
  product_id: number;
  brand: string;
  name: string;
  category: string;
  price: number;
  similarity: number;
  image?: string;
  material?: string;
  sizes?: string[];
  color?: string;
  rating?: number;
  reviewCount?: number;
  url?: string;
};

type ResultsSectionProps = {
  products?: Product[];
};


export const formatRupiah = (value: number) => `Rp. ${value.toLocaleString('id-ID')}`;

export function ResultsSection({ products }: ResultsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  return (
    <Box id="results" bg="brand.0" py="xl">
      <Container size="md" py="xl">
        <Group justify="space-between" align="flex-end" mb="lg" gap="sm">
          <Stack gap={0}>
            <Title order={2} fw={400} c="brand.8">
              Top 10 Recommendation Results
            </Title>
            <Text fz="xs" c="brand.7">
              Ranked by visual similarity score and selected filters
            </Text>
          </Stack>
          <Group gap="xs">
            <Text fz="xs" c="brand.3">
              Sorted by
            </Text>
            <Badge size="sm" radius="sm" variant="light" color="brand.8" bg="brand.2" tt="none">
              Highest Similarity %
            </Badge>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="sm" verticalSpacing="md">
          {products?.map((product) => (
            <ProductCard key={product.product_id} product={product} onClick={() => setSelectedProduct(product)} />
          ))}
        </SimpleGrid>
      </Container>

      <ProductDetailModal
        product={selectedProduct}
        opened={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </Box>
  );
}

type ProductCardProps = {
  product: Product;
  onClick: () => void;
};

function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card
      padding="xs"
      radius="md"
      bg="brand.1"
      bd="1px solid brand.4"
      shadow="sm"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Card.Section bg="brand.6">
        <Group justify="space-between" p="xs" wrap="nowrap">
          <Badge size="xs" radius="sm" color="brand.0" c="brand.8" tt="none">
            {product.similarity}% Match
          </Badge>
          <Text fz="xs" fw={600} tt="uppercase" c="brand.8" lineClamp={1}>
            {product.brand}
          </Text>
        </Group>
        <AspectRatio ratio={4 / 5}>
          {product.image ? (
            <Image src={product.image} alt={product.name} fit="cover" />
          ) : (
            <Box bg="brand.6" />
          )}
        </AspectRatio>
      </Card.Section>

      <Stack gap="xs" mt="sm" style={{ flex: 1 }}>
        <Box style={{ flex: 1 }}>
          <Text fz="xs" tt="uppercase" c="brand.3">
            {product.category}
          </Text>
          <Text fz="xs" fw={500} c="brand.8" lineClamp={2}>
            {product.name}
          </Text>
        </Box>
        <Group justify="space-between" wrap="nowrap">
          <Text fz="sm" fw={700} c="brand.8">
            {formatRupiah(product.price)}
          </Text>
          <ActionIcon size="sm" radius="xl" variant="light" color="brand.8" bg="brand.2" aria-label="View detail">
            →
          </ActionIcon>
        </Group>
      </Stack>
    </Card>
  );
}
