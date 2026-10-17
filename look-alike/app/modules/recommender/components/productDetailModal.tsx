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

const BRAND_STORE_URLS: Record<string, string> = {
  uniqlo: 'https://www.uniqlo.com/id/en/',
  'h&m': 'https://www.zalora.co.id/store/h-m-official-id',
  zara: 'https://www.zara.com/id/',
  'marks & spencer': 'https://www.marksandspencer.com/id/',
  'm&s': 'https://www.marksandspencer.com/id/',
};

const getBrandStoreUrl = (brand?: string | null) =>
  brand ? BRAND_STORE_URLS[brand.trim().toLowerCase()] : undefined;

export function ProductDetailModal({ product, opened, onClose }: ProductDetailModalProps) {
  const productId = Number(product?.product_id);
  const { data, isLoading } = useGetProductDetail(opened ? productId : null);
  const isMobile = useMediaQuery('(max-width: 36em)');

  const brandName = data?.brand_name ?? product?.brand;
  const basePrice = data?.base_price ?? product?.price ?? 0;
  const promoPrice = data?.promo_price;
  const isZara = brandName?.trim().toLowerCase() === 'zara';
  const hasPromo = !isZara && promoPrice != null && promoPrice < basePrice;
  const rating = data?.rating ?? product?.rating;
  const storeUrl = getBrandStoreUrl(brandName) ?? product?.url ?? '#';

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
                {hasPromo ? (
                  <Group gap="xs" align="baseline">
                    <Text fz="sm" fw={700} c="red.7">
                      {formatRupiah(promoPrice)}
                    </Text>
                    <Text fz="xs" c="brand.3" td="line-through">
                      {formatRupiah(basePrice)}
                    </Text>
                  </Group>
                ) : (
                  <Text fz="sm" fw={700} c="brand.8">
                    {formatRupiah(basePrice)}
                  </Text>
                )}
                {rating != null && (
                  <Group gap="xs">
                    <Rating value={rating} fractions={10} size="xs" readOnly />
                    <Text fz="xs" c="brand.3">
                      {rating.toFixed(1)}
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
                        <Group key={detail.label} gap="md" wrap="nowrap" align="flex-start">
                          <Text fz="xs" fw={600} c="brand.8" w="35%" style={{ flexShrink: 0 }}>
                            {detail.label}
                          </Text>
                          <Text fz="xs" c="brand.7" style={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>
                            {detail.value}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  )
                )}

                <Button
                  component="a"
                  href={storeUrl}
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
