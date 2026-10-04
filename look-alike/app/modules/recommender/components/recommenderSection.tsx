'use client';

import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { ApplicationError } from '@/app/error/error';
import { useGetRecommender } from '../hooks/use-get-recommender';
import { TRecommenderRequest } from '../data/request';
import { TRecommender } from '../data/response';
import { ResultsSection, type Product } from './resultsSection';
import { type RecommendationFilters, UploadImageSection } from './uploadImageSection';

const PRIORITY_MATERIALS = '1';
const PRIORITY_PRICE = '2';

const toRecommenderRequest = (image: File, filters: RecommendationFilters): TRecommenderRequest => ({
  image_file: image,
  min_price: filters.minPrice ?? undefined,
  max_price: filters.maxPrice ?? undefined,
  materials: filters.material ?? undefined,
  priority: filters.pricePriority
    ? PRIORITY_PRICE
    : filters.materialPriority
      ? PRIORITY_MATERIALS
      : undefined,
});

const toProduct = (item: TRecommender): Product => ({
  id: String(item.product_id),
  brand: item.brand_name ?? '-',
  name: item.name,
  category: item.category_name ?? '-',
  price: item.promo_price ?? item.base_price,
  similarity: Math.round(item.similarity_score),
  image: item.image_url ?? undefined,
  material: item.material ?? undefined,
});

export function RecommenderSection() {
  const [query, setQuery] = useState<TRecommenderRequest | null>(null);

  const { execute, data, isLoading, error } = useGetRecommender();

  useEffect(() => {
    if (!query) {
      return;
    }

    // Error is surfaced through `error` state below
    execute(query).catch(() => {});
  }, [query]);

  useEffect(() => {
    if (error instanceof ApplicationError) {
      notifications.show({
        title: error.name,
        message: error.message,
        color: 'red',
      });
    }
  }, [error]);

  const handleSubmit = (image: File | string | null, filters: RecommendationFilters) => {
    if (!(image instanceof File)) {
      return;
    }

    setQuery(toRecommenderRequest(image, filters));
  };

  return (
    <>
      <UploadImageSection onSubmit={handleSubmit} isLoading={isLoading} />
      {!isLoading && data?.data && <ResultsSection products={data.data.map(toProduct)} />}
    </>
  );
}
