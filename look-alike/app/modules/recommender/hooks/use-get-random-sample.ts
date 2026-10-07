import useSWR from 'swr';
import { TRandomSample } from '../data/response';
import { RecommenderService } from '../service';

export function useGetRandomSample(limit: number) {
  const { data, error, isLoading } = useSWR<TRandomSample[]>(
    ['random-sample', limit],

    async ([, n]: readonly [string, number]) => {
      const res = await RecommenderService.getRandomSample(n);
      return res.data ?? [];
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  return { data, isLoading, error };
}
