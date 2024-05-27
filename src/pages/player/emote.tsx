import { useMemo } from 'react';

import { EmoteFragment } from '../../api/twitch-types';
import { useGetEmoteSets } from '../../api/api';
import interpolate from 'utilities/interpolate';
import FluxImage from 'common/flux-image';

export default function Emote({ emote }: Props) {
  const { data } = useGetEmoteSets([emote?.emote_set_id ?? '']);
  const emoteData = data?.data.find((_emote) => _emote.id === emote?.id);

  const src = useMemo((): string => {
    return interpolate(data?.template ?? '', {
      id: emote?.id ?? '',
      format: emoteData?.format.some((format) => format === 'animated') ? 'animated' : 'static',
      scale: emoteData?.scale.some((scale) => scale === '2.0') ? '2.0' : '1.0',
      theme_mode: emoteData?.theme_mode.some((theme) => theme === 'dark') ? 'dark' : 'light',
    });
  }, [data, emote, emoteData]);

  return (
    <FluxImage
      width="24"
      title={emoteData?.name}
      style={{ verticalAlign: 'middle', display: 'inline-block' }}
      alt={emoteData?.name}
      src={src}
    />
  );
}

interface Props {
  emote: EmoteFragment | undefined;
}
