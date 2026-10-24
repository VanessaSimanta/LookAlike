'use client';

import { useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { ApplicationError } from '@/app/error/error';
import { useGetRecommender } from '../hooks/use-get-recommender';
import { toProduct, toRecommenderRequest } from '../data/mapper';
import { ResultsSection } from './resultsSection';
import { type RecommendationFilters, UploadImageSection } from './uploadImageSection';

export function RecommenderSection() {
  const { execute, data, isLoading, reset } = useGetRecommender();

  const handleSubmit = useCallback(
    async (image: File | string | null, filters: RecommendationFilters) => {
      if (!(image instanceof File)) {
        return;
      }

      try {
        await execute(toRecommenderRequest(image, filters));
      } catch (error) {
        if (error instanceof ApplicationError) {
          notifications.show({
            title: error.name,
            message: error.message,
            color: 'red',
          });
        }
      }
    },
    [execute]
  );

  return (
    <>
      <UploadImageSection onSubmit={handleSubmit} onResetImage={reset} isLoading={isLoading} />
      {!isLoading && data?.data && <ResultsSection products={data.data.map(toProduct)} />}
    </>
  );
}