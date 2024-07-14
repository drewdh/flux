import React, { PropsWithChildren } from 'react';
import Alert from '@cloudscape-design/components/alert';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import { ExpandableSection } from '@cloudscape-design/components';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

import DhAppLayout from 'common/flux-app-layout';
import { FeedbackContext } from '../feedback/feedback-context';
import { awsRum } from 'utilities/rum-init';

export default class ErrorBoundary extends React.Component<PropsWithChildren, State> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    awsRum?.recordError(error);
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  handleClick() {
    this.setState({ error: undefined });
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }
    return (
      <FeedbackContext.Consumer>
        {({ setIsFeedbackVisible }) => (
          <DhAppLayout
            navigationHide
            toolsHide
            content={
              <>
                <Alert
                  type="error"
                  header="There was an error"
                  action={<Button onClick={this.handleClick.bind(this)}>Reload</Button>}
                >
                  <SpaceBetween size="m">
                    <div>
                      Reload the page or try again later.{' '}
                      <Link
                        href="#"
                        onFollow={(e) => {
                          e.preventDefault();
                          setIsFeedbackVisible(true);
                        }}
                        variant="primary"
                      >
                        Send feedback
                      </Link>{' '}
                      and share more details.
                    </div>
                    <ExpandableSection headerText="Error details">
                      <Box variant="pre">{this.state.error?.stack}</Box>
                    </ExpandableSection>
                  </SpaceBetween>
                </Alert>
              </>
            }
          />
        )}
      </FeedbackContext.Consumer>
    );
  }
}

interface State {
  error?: Error;
}
