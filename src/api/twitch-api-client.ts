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
  GetFollowedChannelsRequest,
  GetFollowedChannelsResponse,
  GetFollowedStreamsRequest,
  GetFollowedStreamsResponse,
  GetGamesRequest,
  GetGamesResponse,
  GetStreamsRequest,
  GetStreamsResponse,
  GetUsersRequest,
  GetUsersResponse,
  RevokeRequest,
  RevokeResponse,
  SearchCategoriesRequest,
  SearchCategoriesResponse,
  SearchChannelsRequest,
  SearchChannelsResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
  TwitchApiClientOptions,
  ValidateRequest,
  ValidateResponse,
} from './twitch-types';

export class TwitchApiClient {
  private readonly clientId: string;

  constructor(options: TwitchApiClientOptions) {
    this.clientId = options.clientId;
  }

  private getAccessToken() {
    return localStorage.getItem('access_token');
  }

  private getDefaultHeaders(): { Authorization: string; 'Client-Id'?: string } {
    return {
      Authorization: `Bearer ${this.getAccessToken()}`,
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
      throw new TwitchError(respBody);
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
      const respBody = await resp.json();
      throw new TwitchError(respBody);
    }
    return {};
  }

  async getChannelFollowers(
    request: GetChannelFollowersRequest
  ): Promise<GetChannelFollowersResponse> {
    const searchParams = new URLSearchParams({ broadcaster_id: request.broadcaster_id });
    request.user_id && searchParams.set('user_id', request.user_id);
    const resp = await fetch(
      `https://api.twitch.tv/helix/channels/followers?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: this.getDefaultHeaders(),
      }
    );
    const respBody = await resp.json();
    if (!resp.ok) {
      throw new TwitchError(respBody);
    }
    return respBody;
  }

  async getFollowedChannels(
    request: GetFollowedChannelsRequest
  ): Promise<GetFollowedChannelsResponse> {
    const searchParams = new URLSearchParams({ user_id: request.user_id });
    request.broadcaster_id && searchParams.set('broadcaster_id', request.broadcaster_id);
    const resp = await fetch(
      `https://api.twitch.tv/helix/channels/followed?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: this.getDefaultHeaders(),
      }
    );
    const respBody = await resp.json();
    if (!resp.ok) {
      throw new TwitchError(respBody);
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
      throw new TwitchError(respBody);
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
      throw new TwitchError(respBody);
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
      throw new TwitchError(respBody);
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
      throw new TwitchError(respBody);
    }
    return respBody;
  }

  async getUsers(request: GetUsersRequest): Promise<GetUsersResponse> {
    const searchParams = new URLSearchParams();
    request.ids?.forEach((id) => searchParams.append('id', id));
    request.logins?.forEach((login) => searchParams.append('login', login));
    const resp = await fetch(`https://api.twitch.tv/helix/users?${searchParams.toString()}`, {
      method: 'GET',
      headers: this.getDefaultHeaders(),
    });
    const respBody = await resp.json();
    if (!resp.ok) {
      throw new TwitchError(respBody);
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
      throw new TwitchError(respBody);
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
      throw new TwitchError(respBody);
    }
    return respBody;
  }

  async validate(request: ValidateRequest): Promise<ValidateResponse> {
    const headers = this.getDefaultHeaders();
    delete headers['Client-Id'];
    const resp = await fetch('https://id.twitch.tv/oauth2/validate', {
      method: 'GET',
      headers: headers,
    });
    const respBody = await resp.json();
    if (!resp.ok) {
      throw new TwitchError(respBody);
    }
    return respBody;
  }

  async revoke(request: RevokeRequest): Promise<RevokeResponse> {
    const resp = await fetch('https://id.twitch.tv/oauth2/revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=${this.clientId}&token=${this.getAccessToken()}`,
    });
    if (!resp.ok) {
      const respBody = await resp.json();
      throw new TwitchError(respBody);
    }
    return {};
  }

  async sendChatMessage(request: SendChatMessageRequest): Promise<SendChatMessageResponse> {
    const params = new URLSearchParams();
    params.set('message', request.message);
    params.set('sender_id', request.sender_id);
    params.set('broadcaster_id', request.broadcaster_id);
    request.reply_parent_message_id &&
      params.set('reply_parent_message_id', request.reply_parent_message_id);
    const resp = await fetch(`https://api.twitch.tv/helix/chat/messages?${params.toString()}`, {
      method: 'POST',
      headers: this.getDefaultHeaders(),
    });
    const respBody = await resp.json();
    if (!resp.ok) {
      throw new TwitchError(respBody);
    }
    return respBody;
  }

  async getGames(request: GetGamesRequest): Promise<GetGamesResponse> {
    const params = new URLSearchParams();
    request.names?.forEach((name) => params.append('name', name));
    request.ids?.forEach((id) => params.append('id', id));
    request.igdbIds?.forEach((igdb_id) => params.append('igdb_id', igdb_id));
    const resp = await fetch(`https://api.twitch.tv/helix/games?${params.toString()}`, {
      method: 'GET',
      headers: this.getDefaultHeaders(),
    });
    const respBody = await resp.json();
    if (!resp.ok) {
      throw new TwitchError(respBody);
    }
    return respBody;
  }
}

export class TwitchError extends Error {
  readonly name: string = 'TwitchError';
  readonly code: string;
  readonly message: string;
  readonly status: number;

  constructor(error: TwitchResponseError) {
    super();
    this.code = error.error;
    this.message = error.message;
    this.status = error.status;
  }
}

interface TwitchResponseError {
  error: string;
  message: string;
  status: number;
}
