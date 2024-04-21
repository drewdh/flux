import { PropsWithChildren } from 'react';

import useElementHeight from 'utilities/use-element-height';
import { footerSelector } from '../footer/constants';
import { topNavSelector } from '../top-navigation/constants';

const contentPadding = '40px';
const breadcrumbsGap = '12px';

export default function FullHeightContent({ children }: PropsWithChildren) {
  const footerHeight = useElementHeight(footerSelector);
  const topNavHeight = useElementHeight(topNavSelector);

  return (
    <div
      style={{
        display: 'flex',
        height: `calc(100vh - ${footerHeight}px - ${topNavHeight}px - ${contentPadding} - ${breadcrumbsGap})`,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}
