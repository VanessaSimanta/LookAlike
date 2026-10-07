'use client';

import {
  AspectRatio,
  Badge,
  Box,
  Button,
  CloseButton,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  Modal,
  Rating,
  Stack,
  Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { formatRupiah, type Product } from './resultsSection';
import { useGetProductDetail } from '../hooks/use-get-product-detail';
import { getMaterialLabel } from '../../enums/materialEnum';

type ProductDetailModalProps = {
  product: Product | null;
  opened: boolean;
  onClose: () => void;
};

const joinList = (items?: string[] | null) =>
  items && items.length > 0 ? items.join(', ') : '-';

export function ProductDetailModal({ product, opened, onClose }: ProductDetailModalProps) {
  const productId = Number(product?.product_id);
  const { data, isLoading } = useGetProductDetail(opened ? productId : null);
  const isMobile = useMediaQuery('(max-width: 36em)');

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      radius={isMobile ? 0 : 'md'}
      padding={isMobile ? 'md' : 'lg'}
      fullScreen={isMobile}
      centered
      withCloseButton={false}
    >
      {product && (
        <Stack gap="md">
          <Group justify="space-between">
            <Badge size="sm" radius="sm" variant="light" color="brand.8" bg="brand.2" tt="none">
              {product.similarity}% Match
            </Badge>
            <CloseButton onClick={onClose} aria-label="Close" c="brand.8" />
          </Group>

          <Grid gap={{ base: 'md', sm: 'xl' }} align="center">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <AspectRatio ratio={1}>
                {product.image ? (
                  <Image src={product.image} alt={product.name} radius="md" fit="cover" />
                ) : (
                  <Box bg="brand.6" bdrs="md" />
                )}
              </AspectRatio>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Stack gap="xs">
                <Text fz="xs" fw={600} tt="uppercase" c="brand.8">
                  {product.brand}
                </Text>
                <Text fz="md" fw={500} c="brand.8">
                  {product.name}
                </Text>
                <Text fz="sm" fw={700} c="brand.8">
                  {formatRupiah(product.price)}
                </Text>
                {product.rating !== undefined && (
                  <Group gap="xs">
                    <Rating value={product.rating} size="xs" readOnly />
                    <Text fz="xs" c="brand.3">
                      {product.rating.toFixed(1)}
                      {product.reviewCount !== undefined && ` (${product.reviewCount})`}
                    </Text>
                  </Group>
                )}

                <Divider my="sm" color="brand.4" />

                {isLoading ? (
                  <Loader size="sm" color="brand.8" />
                ) : (
                  data && (
                    <Stack gap="xs">
                      {[
                        { label: 'Category', value: data.category_name || '-' },
                        { label: 'Material', value: getMaterialLabel(data.material) || data.material || '-' },
                        { label: 'Sizes', value: joinList(data.sizes) },
                        { label: 'Colors', value: joinList(data.colors) },
                      ].map((detail) => (
                        <Group key={detail.label} gap="md" wrap="nowrap">
                          <Text fz="xs" fw={600} c="brand.8" w="35%">
                            {detail.label}
                          </Text>
                          <Text fz="xs" c="brand.7">
                            {detail.value}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  )
                )}

                <Button
                  component="a"
                  href={product.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  size="sm"
                  radius="md"
                  color="brand.8"
                  mt="lg"
                >
                  Check Out the Product
                </Button>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      )}
    </Modal>
  );
}
