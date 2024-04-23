import { IgdbClient } from './igdb-client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

const igdbClient = new IgdbClient();

enum QueryKey {
  GetGames = 'GetGames',
}

export function useGetGames(query: string, options: Partial<UseQueryOptions<any>>) {
  return useQuery({
    ...options,
    queryFn: () => igdbClient.getGames(query),
    queryKey: [QueryKey.GetGames, query],
    staleTime: Infinity,
  });
}
