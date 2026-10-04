'use client';

import { type DragEvent, useEffect, useState } from 'react';
import {
  AspectRatio,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  FileButton,
  Grid,
  Group,
  Image,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';

export type RecommendationFilters = {
  minPrice: number | null;
  maxPrice: number | null;
  pricePriority: boolean;
  material: string | null;
  materialPriority: boolean;
};

type UploadImageSectionProps = {
  onSubmit?: (image: File | string | null, filters: RecommendationFilters) => void;
  isLoading?: boolean;
};

const sampleStyles = [
  { label: 'Sample 1', image: '' },
  { label: 'Sample 2', image: '' },
  { label: 'Sample 3', image: '' },
  { label: 'Sample 4', image: '' },
];

const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp'];

const materials = ['Cotton', 'Linen', 'Polyester', 'Denim', 'Wool', 'Rayon'];

const initialFilters: RecommendationFilters = {
  minPrice: null,
  maxPrice: null,
  pricePriority: false,
  material: null,
  materialPriority: false,
};

export function UploadImageSection({ onSubmit, isLoading = false }: UploadImageSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [filters, setFilters] = useState<RecommendationFilters>(initialFilters);
  const [isDragging, setIsDragging] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (selected: File | null) => {
    setDropError(null);
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    // Ignore leave events fired when moving between child elements
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const dropped = event.dataTransfer.files[0];
    if (!dropped) return;
    if (!acceptedImageTypes.includes(dropped.type)) {
      setDropError('Unsupported file type. Please use PNG, JPG or WEBP.');
      return;
    }
    handleFileChange(dropped);
  };

  const handleResetImage = () => {
    setDropError(null);
    setFile(null);
    setPreview(null);
  };

  const handleSelectSample = (image: string) => {
    setDropError(null);
    setFile(null);
    setPreview(image || null);
  };

  const updateFilter = <K extends keyof RecommendationFilters>(key: K, value: RecommendationFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box id="recommender" bg="brand.1" py="xl">
      <Container size="md" py="xl">
        <Stack gap="xs" align="center" mb="xl">
          <Title order={2} fw={400} c="brand.8" ta="center">
            Upload Your Outfits
          </Title>
          <Text fz="sm" c="brand.7" ta="center">
            Select or drop an outfit image and set your preferences to get the results.
          </Text>
        </Stack>

        <Grid gap="md" align="flex-start">
          {/* Outfit Image Input */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card padding="md" radius="md" bg="brand.0" bd="1px solid brand.4" shadow="sm">
              <Group justify="space-between" mb="sm">
                <Text fz="sm" fw={600} c="brand.8">
                  1. Outfit Image Input
                </Text>
                {preview && (
                  <UnstyledButton onClick={handleResetImage}>
                    <Text fz="xs" c="brand.5">
                      Reset Image
                    </Text>
                  </UnstyledButton>
                )}
              </Group>

              <FileButton onChange={handleFileChange} accept={acceptedImageTypes.join(',')}>
                {(props) => (
                  <UnstyledButton
                    {...props}
                    w="100%"
                    p="lg"
                    bg={isDragging ? 'brand.4' : 'brand.2'}
                    bd={isDragging ? '1px dashed brand.8' : '1px dashed brand.3'}
                    bdrs="md"
                    style={{ transition: 'background-color 150ms ease, border-color 150ms ease' }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Stack gap="sm" align="center">
                      <Box w={{ base: '60%', sm: '50%' }} maw={240}>
                        <AspectRatio ratio={3 / 4}>
                          {preview ? (
                            <Image src={preview} alt="Uploaded outfit" radius="md" fit="cover" />
                          ) : (
                            <Box bg="brand.6" bdrs="md" />
                          )}
                        </AspectRatio>
                      </Box>
                      <Text fz="xs" fw={500} c="brand.8" ta="center">
                        {isDragging
                          ? 'Drop your image here'
                          : preview
                            ? 'Image loaded successfully'
                            : 'Click or drag & drop an outfit image'}
                      </Text>
                      {!preview && (
                        <Text fz="xs" c="brand.3" ta="center">
                          PNG, JPG or WEBP
                        </Text>
                      )}
                    </Stack>
                  </UnstyledButton>
                )}
              </FileButton>
              {dropError && (
                <Text fz="xs" c="red.7" mt="xs" ta="center">
                  {dropError}
                </Text>
              )}

              <Text fz="xs" tt="uppercase" c="brand.3" mt="md" mb="xs" style={{ letterSpacing: '0.08em' }}>
                Or try instantly with sample styles
              </Text>
              <SimpleGrid cols={4} spacing="xs">
                {sampleStyles.map((sample) => (
                  <UnstyledButton
                    key={sample.label}
                    onClick={() => handleSelectSample(sample.image)}
                    aria-label={sample.label}
                  >
                    <AspectRatio ratio={1}>
                      {sample.image ? (
                        <Image src={sample.image} alt={sample.label} radius="sm" fit="cover" />
                      ) : (
                        <Box bg="brand.0" bd="1px solid brand.4" bdrs="sm" />
                      )}
                    </AspectRatio>
                  </UnstyledButton>
                ))}
              </SimpleGrid>
            </Card>
          </Grid.Col>

          {/* Recommendation Filters */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card padding="md" radius="md" bg="brand.0" bd="1px solid brand.4" shadow="sm">
              <Group justify="space-between" mb="md">
                <Text fz="sm" fw={600} c="brand.8">
                  2. Recommendation Filters
                </Text>
                <UnstyledButton onClick={() => setFilters(initialFilters)}>
                  <Text fz="xs" c="brand.7" td="underline">
                    Reset
                  </Text>
                </UnstyledButton>
              </Group>

              <Stack gap="lg">
                <Stack gap="xs">
                  <Box>
                    <Text fz="sm" fw={600} c="brand.8">
                      Price Range
                    </Text>
                    <Text fz="xs" c="brand.3">
                      Set your preferred price range
                    </Text>
                  </Box>
                  <Group gap="xs" wrap="nowrap">
                    <NumberInput
                      flex={1}
                      size="xs"
                      radius="xl"
                      placeholder="Rp. Lowest Price"
                      prefix="Rp. "
                      thousandSeparator="."
                      decimalSeparator=","
                      min={0}
                      hideControls
                      value={filters.minPrice ?? ''}
                      onChange={(value) => updateFilter('minPrice', typeof value === 'number' ? value : null)}
                    />
                    <Text fz="sm" c="brand.3">
                      –
                    </Text>
                    <NumberInput
                      flex={1}
                      size="xs"
                      radius="xl"
                      placeholder="Rp. Highest Price"
                      prefix="Rp. "
                      thousandSeparator="."
                      decimalSeparator=","
                      min={0}
                      hideControls
                      value={filters.maxPrice ?? ''}
                      onChange={(value) => updateFilter('maxPrice', typeof value === 'number' ? value : null)}
                    />
                  </Group>
                  <Checkbox
                    size="xs"
                    color="brand.8"
                    label="Make Priority"
                    checked={filters.pricePriority}
                    onChange={(event) => updateFilter('pricePriority', event.currentTarget.checked)}
                  />
                </Stack>

                <Stack gap="xs">
                  <Box>
                    <Text fz="sm" fw={600} c="brand.8">
                      Clothing Material
                    </Text>
                    <Text fz="xs" c="brand.3">
                      Specify the material you prefer
                    </Text>
                  </Box>
                  <Select
                    size="xs"
                    radius="xl"
                    placeholder="Choose Materials"
                    data={materials}
                    clearable
                    value={filters.material}
                    onChange={(value) => updateFilter('material', value)}
                  />
                  <Checkbox
                    size="xs"
                    color="brand.8"
                    label="Make Priority"
                    checked={filters.materialPriority}
                    onChange={(event) => updateFilter('materialPriority', event.currentTarget.checked)}
                  />
                </Stack>

                <Button
                  fullWidth
                  size="sm"
                  radius="md"
                  color="brand.8"
                  disabled={!preview}
                  loading={isLoading}
                  onClick={() => onSubmit?.(file ?? preview, filters)}
                >
                  Get Your Recommendation
                </Button>
                {!preview && (
                  <Center>
                    <Text fz="xs" c="brand.3">
                      Upload an image first to get recommendations
                    </Text>
                  </Center>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
