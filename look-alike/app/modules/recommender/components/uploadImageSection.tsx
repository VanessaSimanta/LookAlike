'use client';

import { type DragEvent, useEffect, useRef, useState } from 'react';
import {
  AspectRatio,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  FileButton,
  Flex,
  Grid,
  Group,
  Image,
  Loader,
  MultiSelect,
  NumberInput,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconPhoto, IconUpload } from '@tabler/icons-react';
import { useGetRandomSample } from '../hooks/use-get-random-sample';
import { materialOptions } from '../../enums/materialEnum';
import { SImageFile, SPriceRange } from '../data/request';
import { ImageCropModal } from './imageCropModal';

export type RecommendationFilters = {
  minPrice: number | null;
  maxPrice: number | null;
  pricePriority: boolean;
  materials: string[];
  materialPriority: boolean;
};

type UploadImageSectionProps = {
  onSubmit?: (image: File | string | null, filters: RecommendationFilters) => void;
  onResetImage?: () => void;
  isLoading?: boolean;
};

const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp'];

const SAMPLE_LIMIT = 4;
const DROPZONE_HEIGHT = { base: 200, sm: 260 };

const initialFilters: RecommendationFilters = {
  minPrice: null,
  maxPrice: null,
  pricePriority: false,
  materials: [],
  materialPriority: false,
};

export function UploadImageSection({ onSubmit, onResetImage, isLoading = false }: UploadImageSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [cropSource, setCropSource] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileResetRef = useRef<() => void>(null);
  const [filters, setFilters] = useState<RecommendationFilters>(initialFilters);
  const [isDragging, setIsDragging] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);
  const [priceErrors, setPriceErrors] = useState<{ minPrice?: string; maxPrice?: string }>({});
  const { data: samples, isLoading: isSampleLoading } = useGetRandomSample(SAMPLE_LIMIT);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const startedAt = performance.now();
    const interval = setInterval(() => setElapsed((performance.now() - startedAt) / 1000), 100);
    return () => {
      clearInterval(interval);
      setElapsed(0);
    };
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (selected: File | null) => {
    fileResetRef.current?.();
    if (!selected) return;

    const result = SImageFile.safeParse(selected);
    if (!result.success) {
      setDropError(result.error.issues[0].message);
      return;
    }

    setDropError(null);
    setCropSource(selected);
  };

  const handleCropConfirm = (cropped: File) => {
    setOriginalFile(cropSource);
    setFile(cropped);
    setPreview(URL.createObjectURL(cropped));
    setCropSource(null);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
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
    setOriginalFile(null);
    setPreview(null);
    onResetImage?.();
  };

  const handleSelectSample = async (imageUrl: string) => {
    setDropError(null);
    setFile(null);
    setOriginalFile(null);
    setPreview(imageUrl);

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const fileName = imageUrl.split('/').pop()?.split('?')[0] || 'sample.jpg';
      const sampleFile = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
      setFile(sampleFile);
      setOriginalFile(sampleFile);
    } catch {
      setDropError('Failed to load sample image. Please try another one.');
    }
  };

  const updateFilter = <K extends keyof RecommendationFilters>(key: K, value: RecommendationFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'minPrice' || key === 'maxPrice') setPriceErrors({});
  };

  const handleSubmit = () => {
    if (isLoading) return;

    const result = SPriceRange.safeParse({ minPrice: filters.minPrice, maxPrice: filters.maxPrice });
    if (!result.success) {
      const errors: { minPrice?: string; maxPrice?: string } = {};
      for (const issue of result.error.issues) {
        errors[issue.path[0] as 'minPrice' | 'maxPrice'] = issue.message;
      }
      setPriceErrors(errors);
      return;
    }

    const validFilters = { ...filters, ...result.data };
    setFilters(validFilters);
    onSubmit?.(file ?? preview, validFilters);
  };

  return (
    <Box id="recommender" bg="brand.1" py={{ base: 'md', sm: 'xl' }}>
      <Container size="md" py={{ base: 'md', sm: 'xl' }}>
        <Stack gap="xs" align="center" mb={{ base: 'lg', sm: 'xl' }}>
          <Title order={2} fw={400} c="brand.8" ta="center" fz={{ base: 24, sm: 34 }}>
            Upload Your Outfits
          </Title>
          <Text fz="sm" c="brand.7" ta="center">
            Select or drop an outfit image and set your preferences to get the results.
          </Text>
        </Stack>

        <Grid gap="md" align="stretch">
          {/* Outfit Image Input */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card h="100%" padding="md" radius="md" bg="brand.0" bd="1px solid brand.4" shadow="sm">
              <Group justify="space-between" gap="xs" mb="md">
                <Text fz="sm" fw={600} c="brand.8">
                  1. Outfit Image Input
                </Text>
                {preview && (
                  <Group gap="sm">
                    {originalFile && (
                      <UnstyledButton onClick={() => setCropSource(originalFile)}>
                        <Text fz="xs" c="brand.5" td="underline">
                          Crop Image
                        </Text>
                      </UnstyledButton>
                    )}
                    <UnstyledButton onClick={handleResetImage}>
                      <Text fz="xs" c="brand.5" td="underline">
                        Reset Image
                      </Text>
                    </UnstyledButton>
                  </Group>
                )}
              </Group>

              <ImageCropModal file={cropSource} onCancel={() => setCropSource(null)} onConfirm={handleCropConfirm} />

              <FileButton
                onChange={handleFileChange}
                accept={acceptedImageTypes.join(',')}
                resetRef={fileResetRef}
              >
                {(props) => (
                  <UnstyledButton
                    {...props}
                    w="100%"
                    h={DROPZONE_HEIGHT}
                    p="md"
                    bg={isDragging ? 'brand.4' : 'brand.2'}
                    bd={isDragging ? '1px dashed brand.8' : '1px dashed brand.3'}
                    bdrs="md"
                    pos="relative"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      transition: 'background-color 150ms ease, border-color 150ms ease',
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {preview ? (
                      <Stack gap="xs" align="center" w="100%" h="100%">
                        <Box flex={1} mih={0} w="100%" pos="relative">
                          <Image
                            src={preview}
                            alt="Uploaded outfit"
                            radius="md"
                            fit="contain"
                            w="100%"
                            h="100%"
                            style={{ opacity: isDragging ? 0.4 : 1, transition: 'opacity 150ms ease' }}
                          />
                        </Box>
                        <Group gap={6} justify="center" wrap="nowrap">
                          <Text fz="xs" fw={500} c="brand.8" ta="center">
                            {isDragging ? 'Drop to replace image' : 'Click or drop another image to replace'}
                          </Text>
                        </Group>
                      </Stack>
                    ) : (
                      <Stack gap="xs" align="center">
                        <ThemeIcon size={48} radius="xl" variant="light" color="brand">
                          {isDragging ? <IconPhoto size={24} stroke={1.5} /> : <IconUpload size={24} stroke={1.5} />}
                        </ThemeIcon>
                        <Text fz="sm" fw={500} c="brand.8" ta="center">
                          {isDragging ? 'Drop your image here' : 'Click or drag & drop an outfit image'}
                        </Text>
                        <Text fz="xs" c="brand.3" ta="center">
                          PNG, JPG or WEBP
                        </Text>
                      </Stack>
                    )}
                  </UnstyledButton>
                )}
              </FileButton>

              {dropError && (
                <Text fz="xs" c="red.7" mt="xs" ta="center">
                  {dropError}
                </Text>
              )}

              <Text fz="xs" c="brand.3" mt="md" mb="xs">
                Or try instantly with sample styles
              </Text>
              <SimpleGrid cols={4} spacing="xs">
                {isSampleLoading
                  ? Array.from({ length: SAMPLE_LIMIT }).map((_, index) => (
                    <AspectRatio key={index} ratio={1}>
                      <Skeleton radius="sm" />
                    </AspectRatio>
                  ))
                  : samples?.map((sample, index) => {
                    const isActive = preview === sample.image_url;
                    return (
                      <UnstyledButton
                        key={sample.image_url}
                        onClick={() => handleSelectSample(sample.image_url)}
                        aria-label={`Sample style ${index + 1}`}
                        aria-pressed={isActive}
                        bdrs="sm"
                        style={{
                          outline: isActive ? '1px solid var(--mantine-color-brand-8)' : 'none',
                          outlineOffset: 2,
                        }}
                      >
                        <AspectRatio ratio={1}>
                          <Image src={sample.image_url} alt={`Sample style ${index + 1}`} radius="sm" fit="cover" />
                        </AspectRatio>
                      </UnstyledButton>
                    );
                  })}
              </SimpleGrid>
            </Card>
          </Grid.Col>

          {/* Preference */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card h="100%" padding="md" radius="md" bg="brand.0" bd="1px solid brand.4" shadow="sm">
              <Group justify="space-between" mb="md">
                <Text fz="sm" fw={600} c="brand.8">
                  2. Preference
                </Text>
                <UnstyledButton
                  onClick={() => {
                    setFilters(initialFilters);
                    setPriceErrors({});
                  }}
                >
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
                  <Flex gap="xs" direction={{ base: 'column', xs: 'row' }} align={{ base: 'stretch', xs: 'center' }}>
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
                      error={!!priceErrors.minPrice}
                      onChange={(value) => updateFilter('minPrice', typeof value === 'number' ? value : null)}
                    />
                    <Text fz="sm" c="brand.3" visibleFrom="xs">
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
                      error={!!priceErrors.maxPrice}
                      onChange={(value) => updateFilter('maxPrice', typeof value === 'number' ? value : null)}
                    />
                  </Flex>
                  {(priceErrors.minPrice || priceErrors.maxPrice) && (
                    <Text fz="xs" c="red.7">
                      {priceErrors.minPrice ?? priceErrors.maxPrice}
                    </Text>
                  )}
                  <Checkbox
                    size="xs"
                    color="brand.8"
                    label="Make Priority"
                    checked={filters.pricePriority}
                    onChange={(event) => {
                      const checked = event.currentTarget.checked;
                      setFilters((prev) => ({
                        ...prev,
                        pricePriority: checked,
                        materialPriority: checked ? false : prev.materialPriority,
                      }));
                    }}
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
                  <MultiSelect
                    size="xs"
                    radius="xl"
                    placeholder={filters.materials.length ? undefined : 'Choose Materials'}
                    data={materialOptions}
                    color="brand.8"
                    clearable
                    value={filters.materials}
                    styles={{
                      dropdown: { color: 'var(--mantine-color-text)' },
                    }}
                    onChange={(value) => updateFilter('materials', value)}
                  />
                  <Checkbox
                    size="xs"
                    color="brand.8"
                    label="Make Priority"
                    checked={filters.materialPriority}
                    onChange={(event) => {
                      const checked = event.currentTarget.checked;
                      setFilters((prev) => ({
                        ...prev,
                        materialPriority: checked,
                        pricePriority: checked ? false : prev.pricePriority,
                      }));
                    }}
                  />
                </Stack>

                <Button
                  fullWidth
                  size="sm"
                  radius="md"
                  color="brand.8"
                  disabled={!preview}
                  aria-busy={isLoading}
                  leftSection={isLoading ? <Loader size={14} color="brand.0" /> : undefined}
                  onClick={handleSubmit}
                >
                  {isLoading ? `Finding your matches... ${elapsed.toFixed(1)}s` : 'Get Your Recommendation'}
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