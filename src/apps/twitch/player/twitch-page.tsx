import DhAppLayout from 'common/flux-app-layout';
import TwitchComponent from './twitch';
import FluxBreadcrumbs from 'common/flux-breadcrumbs';
import widgetDetails from 'common/widget-details';
import { Pathname } from 'utilities/routes';
import useTitle from 'utilities/use-title';
import { useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';

export default function TwitchPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useParams();
  const [disableContentPaddings, setDisableContentPaddings] = useState<boolean>(false);

  useEffect(() => {
    const refCurrent = ref.current;
    if (!refCurrent) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDisableContentPaddings(width < 688);
    });
    resizeObserver.observe(refCurrent);
    return () => resizeObserver.unobserve(refCurrent);
  }, []);

  return (
    <div ref={ref}>
      <DhAppLayout
        toolsHide
        disableContentPaddings={disableContentPaddings}
        maxContentWidth={1700}
        contentType="wizard"
        content={<TwitchComponent />}
      />
    </div>
  );
}
