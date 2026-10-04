import useSWRMutation from 'swr/mutation';
import { TRecommenderRequest } from '../data/request';
import { RecommenderService } from '../service';

export function useGetRecommender() {
  const fetchKey = ['get-recommender'];

  const { trigger, data, isMutating, error, reset } = useSWRMutation(
    fetchKey,
    async (_, { arg }: { arg: TRecommenderRequest }) => {
      return await RecommenderService.getRecommender(arg);
    },
    {
      throwOnError: true,
    }
  );

  const execute = async (body: TRecommenderRequest) => {
    const data = await trigger(body);
    return data;
  };

  return {
    execute,
    data,
    isLoading: isMutating,
    error,
    reset,
  };
}