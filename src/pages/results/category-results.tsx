import { useSearchCategories } from '../../api/api';
import { CategoryResult } from '../../api/twitch-types';
import { interpolatePathname, Pathname } from 'utilities/routes';
import Empty from 'common/empty/empty';
import FluxCards from 'common/cards';
import CategoryThumbnail from 'common/category-thumbnail';

export default function CategoryResults({ query }: Props) {
  const { data, isFetchingNextPage, isLoading, fetchNextPage, error } = useSearchCategories({
    query,
    pageSize: 12,
  });

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <FluxCards<CategoryResult>
      columns={5}
      empty={<Empty header="No matches" />}
      fetchingNextPage={isFetchingNextPage}
      itemMapper={(item) => {
        const href = interpolatePathname(Pathname.Game, { gameId: item.id });
        const imgSrc = item?.box_art_url.replace(/-\d+x\d+/g, `-${400}x${534}`);
        return <CategoryThumbnail imgSrc={imgSrc} href={href} title={item.name} />;
      }}
      items={items}
      loading={isLoading}
      onLastItemVisible={() => fetchNextPage()}
    />
  );
}

interface Props {
  query: string;
}
