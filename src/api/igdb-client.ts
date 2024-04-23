const baseUrl = 'https://0oampeorc9.execute-api.us-west-2.amazonaws.com/production/v4';

export class IgdbClient {
  async getGames(query: string): Promise<any> {
    const resp = await fetch(`${baseUrl}/games`, {
      method: 'POST',
      body: query,
    });
    const respBody = await resp.json();
    if (!resp.ok) {
      throw respBody;
    }
    return respBody;
  }
}
