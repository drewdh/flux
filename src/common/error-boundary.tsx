import React, { PropsWithChildren } from 'react';
import Alert from '@cloudscape-design/components/alert';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import { ExpandableSection } from '@cloudscape-design/components';
import Box from '@cloudscape-design/components/box';

import DhAppLayout from 'common/flux-app-layout';
import { openFeedback } from '../feedback/use-feedback';

export default class ErrorBoundary extends React.Component<PropsWithChildren, State> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }
    return (
      <DhAppLayout
        navigationHide
        toolsHide
        content={
          <>
            <Alert type="error" header="There was an error">
              <SpaceBetween size="m">
                <div>
                  Reload the page or try again later.{' '}
                  <Link
                    href="#"
                    onFollow={(e) => {
                      e.preventDefault();
                      openFeedback();
                    }}
                    variant="primary"
                    color="inverted"
                  >
                    Send feedback
                  </Link>{' '}
                  and share more details.
                </div>
                <ExpandableSection headerText="Error details">
                  <Box variant="pre">{this.state.error.stack}</Box>
                </ExpandableSection>
              </SpaceBetween>
            </Alert>
          </>
        }
      />
    );
  }
}

interface State {
  error?: Error;
}
