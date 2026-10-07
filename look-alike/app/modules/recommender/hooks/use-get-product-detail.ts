import useSWR from 'swr';
import { TProductDetail } from '../data/response';
import { RecommenderService } from '../service';

export function useGetProductDetail(productId?: number | null) {
  const isValidId = Number.isInteger(productId) && (productId as number) > 0;

  const { data, error, isLoading } = useSWR<TProductDetail>(
    isValidId ? ['product-detail', productId] : null,
    
    async ([, id]: readonly [string, number]) => {
      const res = await RecommenderService.getProductDetail(id);
      return res.data; 
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  return { data, isLoading, error };
}