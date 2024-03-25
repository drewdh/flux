import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useParams } from 'react-router';

import {
  GetFollowedStreamsResponse,
  GetStreamsResponse,
  GetUsersRequest,
  GetUsersResponse,
} from './twitch-types';
import { TwitchApiClient } from './twitch-api-client';

export enum QueryKey {
  GetFollowedStreams = 'GetFollowedStreams',
  GetUser = 'GetUser',
  GetUserStream = 'GetUserStream',
  GetChatSettings = 'GetChatSettings',
  GetChannelFollowers = 'GetChannelFollowers',
  GetEmoteSets = 'GetEmoteSets',
}

export const twitchClient = new TwitchApiClient({
  accessToken: localStorage.getItem('access_token') ?? '',
  clientId: 'w9wdgvpv3h3m957julwgkn25hxsr38',
});

export function useGetUsers(
  request: GetUsersRequest,
  options: Partial<UseQueryOptions<GetUsersResponse>> = {}
): UseQueryResult<GetUsersResponse, Error> {
  return useQuery({
    ...options,
    queryFn: () => twitchClient.getUsers(request),
    queryKey: [QueryKey.GetUser, request],
    staleTime: Infinity,
  });
}

export function useGetFollowedStreams() {
  const { data: users } = useGetUsers({});
  const user = users?.data[0];
  return useInfiniteQuery<
    GetFollowedStreamsResponse,
    Error,
    InfiniteData<GetFollowedStreamsResponse>,
    [string],
    string | undefined
  >({
    queryFn: ({ pageParam }) =>
      twitchClient.getFollowedStreams({ userId: user!.id, nextToken: pageParam, pageSize: 20 }),
    queryKey: [QueryKey.GetFollowedStreams],
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
    initialPageParam: undefined,
    enabled: !!user,
  });
}

type SafeOptions = Omit<UseQueryOptions<GetStreamsResponse>, 'queryFn' | 'queryKey' | 'enabled'>;
export function useGetStreamByUserLogin(userLogin?: string, options: SafeOptions = {}) {
  return useQuery({
    queryFn: () => twitchClient.getStreams({ userLogins: [userLogin!] }),
    queryKey: [QueryKey.GetUserStream, userLogin],
    enabled: !!userLogin,
    refetchInterval: 10 * 1000,
    ...options,
  });
}

export function useGetChatSettings() {
  const { user } = useParams();
  const { data: usersData } = useGetUsers({ logins: [user!] }, { enabled: !!user });
  const broadcasterId = usersData?.data[0].id;
  return useQuery({
    queryFn: () => twitchClient.getChatSettings({ broadcasterId: broadcasterId! }),
    queryKey: [QueryKey.GetChatSettings, broadcasterId],
    enabled: !!broadcasterId,
  });
}

export function useGetChannelFollowers(broadcasterId?: string) {
  return useQuery({
    queryFn: () => twitchClient.getChannelFollowers({ broadcaster_id: broadcasterId! }),
    queryKey: [QueryKey.GetChannelFollowers, broadcasterId],
    enabled: Boolean(broadcasterId),
  });
}

export function useGetEmoteSets(emoteSetIds: string[]) {
  return useQuery({
    queryFn: () => twitchClient.getEmoteSets({ emoteSetIds }),
    queryKey: [QueryKey.GetEmoteSets, ...emoteSetIds],
    staleTime: Number.MAX_VALUE,
  });
}
