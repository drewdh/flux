import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import Button from '@cloudscape-design/components/button';

import {
  CreateEventSubSubscriptionRequest,
  CreateEventSubSubscriptionResponse,
  DeleteEventSubSubscriptionRequest,
  GetFollowedChannelsRequest,
  GetFollowedStreamsResponse,
  GetGamesRequest,
  GetGamesResponse,
  GetStreamsRequest,
  GetStreamsResponse,
  GetTopGamesRequest,
  GetTopGamesResponse,
  GetUsersRequest,
  GetUsersResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from './twitch-types';
import { TwitchApiClient, TwitchError } from './twitch-api-client';
import { Pathname } from 'utilities/routes';
import useAddNotification from 'common/use-add-notification';
import { connectHref } from '../pages/home/page';
import { awsRum } from 'utilities/rum-init';

export enum QueryKey {
  GetFollowedStreams = 'GetFollowedStreams',
  GetUser = 'GetUser',
  GetUserStream = 'GetUserStream',
  GetChatSettings = 'GetChatSettings',
  GetChannelFollowers = 'GetChannelFollowers',
  GetEmoteSets = 'GetEmoteSets',
  SearchChannels = 'SearchChannels',
  SearchChannelsWithStreamData = 'SearchChannelsWithStreamData',
  SearchCategories = 'SearchCategories',
  Validate = 'Validate',
  GetFollowedChannels = 'GetFollowedChannels',
  GetGames = 'GetGames',
  GetStreams = 'GetStreams',
}
export enum MutationKey {
  CreateEventSubSubscription = 'CreateEventSubSubscription',
  DeleteEventSubSubscription = 'DeleteEventSubSubscription',
  Revoke = 'Revoke',
  SendChatMessage = 'SendChatMessage',
}

const twitchClient = new TwitchApiClient({
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

type UseGetFollowedStreamsOptions = Omit<
  UseInfiniteQueryOptions<
    GetFollowedStreamsResponse,
    Error,
    InfiniteData<GetFollowedStreamsResponse>,
    GetFollowedStreamsResponse,
    [string],
    string | undefined
  >,
  'queryFn' | 'queryKey' | 'getNextPageParam' | 'initialPageParam'
>;
export function useGetFollowedStreams(options: UseGetFollowedStreamsOptions = {}) {
  const { data: users } = useGetUsers({});
  const user = users?.data[0];
  return useInfiniteQuery({
    ...options,
    queryFn: ({ pageParam }) =>
      twitchClient.getFollowedStreams({ userId: user!.id, nextToken: pageParam, pageSize: 20 }),
    queryKey: [QueryKey.GetFollowedStreams],
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
    initialPageParam: undefined,
    enabled: !!user && ('enabled' in options ? options.enabled : true),
  });
}

type SafeOptions = Omit<UseQueryOptions<GetStreamsResponse>, 'queryFn' | 'queryKey' | 'enabled'>;
/** @deprecated Prefer `useGetStreams` */
export function useGetStreamByUserLogin(userLogin?: string, options: SafeOptions = {}) {
  return useQuery({
    queryFn: () => twitchClient.getStreams({ userLogins: [userLogin!] }),
    queryKey: [QueryKey.GetUserStream, userLogin],
    enabled: !!userLogin,
    refetchInterval: 10 * 1000,
    ...options,
  });
}

export function useGetStreams(
  request: GetStreamsRequest,
  options: Partial<
    UseInfiniteQueryOptions<
      GetStreamsResponse,
      Error,
      InfiniteData<GetStreamsResponse>,
      GetStreamsResponse,
      [string, GetStreamsRequest],
      string | undefined
    >
  > = {}
) {
  return useInfiniteQuery({
    ...options,
    queryFn: ({ pageParam }) =>
      twitchClient.getStreams({
        ...request,
        nextToken: pageParam,
      }),
    queryKey: [QueryKey.GetStreams, request],
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
  });
}

interface UseGetChatSettingsOptions {
  enabled?: boolean;
}
export function useGetChatSettings(options: UseGetChatSettingsOptions = {}) {
  const enabled = options.enabled === undefined ? true : options.enabled;
  const { user } = useParams();
  const { data: usersData } = useGetUsers({ logins: [user!] }, { enabled: !!user });
  const broadcasterId = usersData?.data[0].id;
  return useQuery({
    queryFn: () => twitchClient.getChatSettings({ broadcasterId: broadcasterId! }),
    queryKey: [QueryKey.GetChatSettings, broadcasterId],
    enabled: !!broadcasterId && enabled,
  });
}

export function useGetChannelFollowers({
  broadcasterId,
  userId,
}: {
  broadcasterId?: string;
  userId?: string;
}) {
  return useQuery({
    queryFn: () =>
      twitchClient.getChannelFollowers({ broadcaster_id: broadcasterId!, user_id: userId }),
    queryKey: [QueryKey.GetChannelFollowers, broadcasterId, userId],
    enabled: Boolean(broadcasterId),
  });
}

export function useGetFollowedChannels(request: Partial<GetFollowedChannelsRequest>) {
  return useQuery({
    queryFn: () => twitchClient.getFollowedChannels(request as GetFollowedChannelsRequest),
    queryKey: [QueryKey.GetFollowedChannels, request],
    enabled:
      ('user_id' in request ? !!request.user_id?.length : true) &&
      ('broadcaster_id' in request ? !!request.broadcaster_id?.length : true),
  });
}

export function useGetEmoteSets(emoteSetIds: string[]) {
  return useQuery({
    queryFn: () => twitchClient.getEmoteSets({ emoteSetIds }),
    queryKey: [QueryKey.GetEmoteSets, ...emoteSetIds],
    staleTime: Number.MAX_VALUE,
  });
}

interface UseSearchOptions {
  query: string;
  pageSize?: number;
}
export function useSearchChannels({ query, pageSize = 10 }: UseSearchOptions) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      twitchClient.searchChannels({
        query,
        pageSize,
        live_only: true,
        nextToken: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
    queryKey: [QueryKey.SearchChannels, query],
    enabled: !!query,
    // Order of results can change, so don't refetch
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useSearchChannelsWithStreamData({ query, pageSize = 10 }: UseSearchOptions) {
  return useInfiniteQuery({
    queryFn: async ({ pageParam }) => {
      const { data, pagination } = await twitchClient.searchChannels({
        query,
        pageSize,
        live_only: true,
        nextToken: pageParam,
      });
      const { data: streamData } = await twitchClient.getStreams({
        userIds: data.map((result) => result.id),
      });
      return {
        data: streamData,
        pagination,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
    queryKey: [QueryKey.SearchChannelsWithStreamData, query],
    enabled: !!query,
    // Order of results can change, so don't refetch
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useSearchCategories({ query, pageSize = 10 }: UseSearchOptions) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      twitchClient.searchCategories({
        query,
        pageSize,
        nextToken: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
    queryKey: [QueryKey.SearchCategories, query],
    enabled: !!query,
    // Order of results can change, so don't refetch
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useValidate() {
  return useQuery({
    queryFn: async () => {
      const resp = await twitchClient.validate({});
      awsRum?.addSessionAttributes({
        userId: resp.user_id,
        login: resp.login,
      });
      return resp;
    },
    queryKey: [QueryKey.Validate],
    enabled: !!localStorage.getItem('access_token'),
    // Twitch recommends fetching every hour
    staleTime: 1000 * 60 * 60,
  });
}

export function useRevoke() {
  const navigate = useNavigate();
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => twitchClient.revoke({}),
    throwOnError: true,
    mutationKey: [MutationKey.Revoke],
    onSuccess: () => {
      localStorage.removeItem('access_token');
      client.removeQueries({ queryKey: [QueryKey.Validate] });
      client.removeQueries({ queryKey: [QueryKey.GetFollowedStreams] });
      navigate({ pathname: Pathname.Home, search: '?signOut=true' });
    },
  });
}

type UseCreateEventSubSubscriptionOptions = Omit<
  UseMutationOptions<CreateEventSubSubscriptionResponse, Error, CreateEventSubSubscriptionRequest>,
  'mutationFn' | 'mutationKey'
>;
export function useCreateEventSubSubscription(options: UseCreateEventSubSubscriptionOptions = {}) {
  return useMutation({
    mutationFn: (request: CreateEventSubSubscriptionRequest) =>
      twitchClient.createEventSubSubscription(request),
    mutationKey: [MutationKey.CreateEventSubSubscription],
    ...options,
  });
}

export function useDeleteEventSubSubscription() {
  return useMutation({
    mutationFn: (request: DeleteEventSubSubscriptionRequest) =>
      twitchClient.deleteEventSubSubscription(request),
    mutationKey: [MutationKey.DeleteEventSubSubscription],
  });
}

export function useSendChatMessage(
  options: UseMutationOptions<
    SendChatMessageResponse,
    TwitchError,
    SendChatMessageRequest,
    unknown
  > = {}
) {
  const addNotification = useAddNotification();
  return useMutation({
    ...options,
    mutationFn: (request: SendChatMessageRequest) => twitchClient.sendChatMessage(request),
    mutationKey: [MutationKey.SendChatMessage],
    onError: (error: TwitchError, variables, context) => {
      const isScopeOutdated = error.message.startsWith('User access token requires the');
      if (!isScopeOutdated) {
        return;
      }
      addNotification({
        action: (
          <Button href={connectHref} target="_blank" iconAlign="right" iconName="external">
            Sign in
          </Button>
        ),
        header: 'Access denied',
        content:
          "Flux's Twitch permissions have changed. Sign in again on Twitch to send chat messages.",
        dismissible: true,
        type: 'error',
      });
      options.onError?.(error, variables, context);
    },
  });
}

export function useGetGames(
  request: GetGamesRequest,
  options: Omit<UseQueryOptions<GetGamesResponse, TwitchError>, 'queryKey' | 'queryFn'> = {}
) {
  return useQuery({
    ...options,
    queryKey: [QueryKey.GetGames, request],
    queryFn: () => twitchClient.getGames(request),
    staleTime: Infinity,
  });
}

export function useGetTopGames(
  request: GetTopGamesRequest,
  options: Omit<UseQueryOptions<GetTopGamesResponse, TwitchError>, 'queryKey' | 'queryFn'> = {}
) {
  return useQuery({
    ...options,
    queryKey: [],
    queryFn: () => twitchClient.getTopGames(request),
    staleTime: Infinity,
  });
}
