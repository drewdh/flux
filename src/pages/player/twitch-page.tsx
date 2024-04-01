import DhAppLayout from 'common/flux-app-layout';
import TwitchComponent from './twitch';
import { useEffect, useRef, useState } from 'react';

const viewportBreakpointXs = 688;

export default function TwitchPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [disableContentPaddings, setDisableContentPaddings] = useState<boolean>(false);

  useEffect(() => {
    const refCurrent = ref.current;
    if (!refCurrent) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDisableContentPaddings(width < viewportBreakpointXs);
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
