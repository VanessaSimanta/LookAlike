'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Center, Group, Modal, Text } from '@mantine/core';
import ReactCrop, { type PercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type ImageCropModalProps = {
  file: File | null;
  onCancel: () => void;
  onConfirm: (cropped: File) => void;
};

const MIN_CROP_SIZE = 32;

const fullCrop: PercentCrop = { unit: '%', x: 0, y: 0, width: 100, height: 100 };

const cropImage = (image: HTMLImageElement, crop: PercentCrop, source: File): Promise<File> => {
  const sx = (crop.x / 100) * image.naturalWidth;
  const sy = (crop.y / 100) * image.naturalHeight;
  const width = Math.max(1, Math.round((crop.width / 100) * image.naturalWidth));
  const height = Math.max(1, Math.round((crop.height / 100) * image.naturalHeight));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return Promise.reject(new Error('Canvas is not supported'))
  };

  ctx.drawImage(image, sx, sy, width, height, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Failed to crop image'));
        resolve(new File([blob], source.name, { type: blob.type }));
      },
      source.type,
      0.95,
    );
  });
};

export function ImageCropModal({ file, onCancel, onConfirm }: ImageCropModalProps) {
  const [crop, setCrop] = useState<PercentCrop>(fullCrop);
  const [isCropping, setIsCropping] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const src = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  const handleImageLoad = () => setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 });

  const handleConfirm = async () => {
    if (!file || !imageRef.current) return;
    setIsCropping(true);
    try {
      onConfirm(await cropImage(imageRef.current, crop, file));
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <Modal
      opened={file !== null}
      onClose={onCancel}
      title={
        <Text fz="sm" fw={600} c="brand.8">
          Crop Outfit Image
        </Text>
      }
      size="lg"
      centered
      radius="md"
    >
      <Text fz="xs" c="brand.3" mb="sm">
        Drag the corners to focus on the outfit you want to match.
      </Text>

      <Center bg="brand.1" bdrs="md" p="xs">
        {src && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            minWidth={MIN_CROP_SIZE}
            minHeight={MIN_CROP_SIZE}
            keepSelection
            ruleOfThirds
          >
            <Box
              component="img"
              ref={imageRef}
              src={src}
              alt="Image to crop"
              onLoad={handleImageLoad}
              style={{ display: 'block', maxWidth: '100%', maxHeight: '60vh' }}
            />
          </ReactCrop>
        )}
      </Center>

      <Group justify="space-between" mt="md">
        <Button variant="subtle" color="brand.7" size="xs" onClick={onCancel}>
          Cancel
        </Button>
        <Group gap="xs">
          <Button variant="outline" color="brand.8" size="xs" onClick={() => file && onConfirm(file)}>
            Use Original
          </Button>
          <Button color="brand.8" size="xs" loading={isCropping} onClick={handleConfirm}>
            Crop &amp; Use
          </Button>
        </Group>
      </Group>
    </Modal>
  );
}
