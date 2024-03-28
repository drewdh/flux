import {
  CreateEventSubSubscriptionRequest,
  CreateEventSubSubscriptionResponse,
  DeleteEventSubSubscriptionRequest,
  DeleteEventSubSubscriptionResponse,
  GetChannelFollowersRequest,
  GetChannelFollowersResponse,
  GetChatSettingsRequest,
  GetChatSettingsResponse,
  GetEmoteSetsRequest,
  GetEmoteSetsResponse,
  GetFollowedStreamsRequest,
  GetFollowedStreamsResponse,
  GetStreamsRequest,
  GetStreamsResponse,
  GetUsersRequest,
  GetUsersResponse,
  SearchCategoriesRequest,
  SearchCategoriesResponse,
  SearchChannelsRequest,
  SearchChannelsResponse,
  TwitchApiClientOptions,
} from './twitch-types';

export class TwitchApiClient {
  private readonly accessToken: string;
  private readonly clientId: string;

  constructor(options: TwitchApiClientOptions) {
    this.accessToken = options.accessToken;
    this.clientId = options.clientId;
  }

  private getDefaultHeaders() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      'Client-Id': this.clientId,
    };
  }

  async createEventSubSubscription(
    request: CreateEventSubSubscriptionRequest
  ): Promise<CreateEventSubSubscriptionResponse> {
    const resp = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getDefaultHeaders(),
      },
      body: JSON.stringify(request),
    });
    const respBody = await resp.json();
    if (!resp.ok) {
      throw respBody;
    }
    return respBody;
  }

  async deleteEventSubSubscription(
    request: DeleteEventSubSubscriptionRequest
  ): Promise<DeleteEventSubSubscriptionResponse> {
    const resp = await fetch(
      `https://api.twitch.tv/helix/eventsub/subscriptions?id=${request.id}`,
      {
        method: 'DELETE',
        headers: this.getDefaultHeaders(),
      }
    );
    if (!resp.ok) {
      throw resp;
    }
    return {};
  }

  async getChannelFollowers(
    request: GetChannelFollowersRequest
  ): Promise<GetChannelFollowersResponse> {
    const resp = await fetch(
      `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${request.broadcaster_id}&id=${request.user_id}`,
      {
        method: 'GET',
        headers: this.getDefaultHeaders(),
      }
    );
    const respBody = await resp.json();
    if (!resp.ok) {
      throw respBody;
    }
    return respBody;
  }

  async getChatSettings(request: GetChatSettingsRequest): Promise<GetChatSettingsResponse> {
    const resp = await fetch(
      `https://api.twitch.tv/helix/chat/settings?broadcaster_id=${request.broadcasterId}`,
      {
        method: 'GET',
        headers: this.getDefaultHeaders(),
      }
    );
    const respBody = await resp.json();
    if (!resp.ok) {
      throw respBody;
    }
    return respBody;
  }

  async getEmoteSets(request: GetEmoteSetsRequest): Promise<GetEmoteSetsResponse> {
    const searchParams = new URLSearchParams();
    request.emoteSetIds.forEach((id) => searchParams.append('emote_set_id', id));
    const resp = await fetch(
      `https://api.twitch.tv/helix/chat/emotes/set?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: this.getDefaultHeaders(),
      }
    );
    const respBody = await resp.json();
    if (!resp.ok) {
      throw respBody;
    }
    return respBody;
  }

  async getFollowedStreams(
    request: GetFollowedStreamsRequest
  ): Promise<GetFollowedStreamsResponse> {
    const searchParams = new URLSearchParams({
      user_id: request.userId,
      first: String(request.pageSize) ?? '',
      after: request.nextToken ?? '',
    });
    const resp = await fetch(
      `https://api.twitch.tv/helix/streams/followed?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: this.getDefaultHeaders(),
      }
    );
    const respBody = await resp.json();
    if (!resp.ok) {
      throw respBody;
    }
    return respBody;
  }

  async getStreams(request: GetStreamsRequest): Promise<GetStreamsResponse> {
    const searchParams = new URLSearchParams();
    request.userIds?.forEach((userId) => searchParams.append('user_id', userId));
    request.userLogins?.forEach((userLogin) => searchParams.append('user_login', userLogin));
    request.gameIds?.forEach((gameId) => searchParams.append('game_id', gameId));
    request.languages?.forEach((language) => searchParams.append('language', language));
    request.type && searchParams.set('type', request.type);
    request.pageSize && searchParams.set('first', String(request.pageSize));
    request.nextToken && searchParams.set('after', request.nextToken);

    const resp = await fetch(`https://api.twitch.tv/helix/streams?${searchParams.toString()}`, {
      method: 'GET',
      headers: this.getDefaultHeaders(),
    });
    const respBody = await resp.json();
    if (!resp.ok) {
      throw respBody;
    }
    return respBody;
  }

  async getUsers(request: GetUsersRequest): Promise<GetUsersResponse> {
    let search: string = '';
    request.ids?.forEach((id) => (search += `id=${id}&`));
    request.logins?.forEach((login) => (search += `login=${login}&`));
    const resp = await fetch(`https://api.twitch.tv/helix/users?${search}`, {
      method: 'GET',
      headers: this.getDefaultHeaders(),
    });
    const respBody = await resp.json();
    if (!resp.ok) {
      throw respBody;
    }
    return respBody;
  }

  async searchChannels(request: SearchChannelsRequest): Promise<SearchChannelsResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set('query', request.query);
    request.live_only && searchParams.set('live_only', JSON.stringify(request.live_only));
    request.pageSize && searchParams.set('first', request.pageSize.toString());
    request.nextToken && searchParams.set('after', request.nextToken);
    const resp = await fetch(
      `https://api.twitch.tv/helix/search/channels?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: this.getDefaultHeaders(),
      }
    );
    const respBody = await resp.json();
    if (!resp.ok) {
      throw respBody;
    }
    return respBody;
  }

  async searchCategories(request: SearchCategoriesRequest): Promise<SearchCategoriesResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set('query', request.query);
    request.pageSize && searchParams.set('first', request.pageSize.toString());
    request.nextToken && searchParams.set('after', request.nextToken);
    const resp = await fetch(
      `https://api.twitch.tv/helix/search/categories?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: this.getDefaultHeaders(),
      }
    );
    const respBody = await resp.json();
    if (!resp.ok) {
      throw respBody;
    }
    return respBody;
  }
}
