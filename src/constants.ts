const connectSearchParams = new URLSearchParams({
  response_type: 'token',
  client_id: 'w9wdgvpv3h3m957julwgkn25hxsr38',
  redirect_uri: `${window.location.origin}/`,
});
// Manually add scope because URLSearchParams encodes characters that Twitch doesn't like
// https://discuss.dev.twitch.com/t/auth-api-doesnt-recognize-a-scope-string-with-replaced-with-3a/22969/2
// eslint-disable-next-line no-useless-concat
const scope = 'user%3Aread%3Afollows' + '+user%3Aread%3Achat' + '+user%3Awrite%3Achat';
export const connectHref = `https://id.twitch.tv/oauth2/authorize?${connectSearchParams.toString()}&scope=${scope}`;
