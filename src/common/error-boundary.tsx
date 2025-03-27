import React, { PropsWithChildren } from 'react';
import Alert from '@cloudscape-design/components/alert';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { Location } from 'react-router';

import DhAppLayout from 'common/flux-app-layout';
import { useFeedback } from '../feedback/feedback-store';
import { awsRum } from 'utilities/rum-init';

export default class ErrorBoundary extends React.Component<PropsWithChildren<Props>, State> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    awsRum?.recordError(error);
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  dismissError() {
    this.setState({ error: undefined });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location !== this.props.location) {
      this.dismissError();
    }
  }

  handleClick() {
    this.dismissError();
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
            <Alert
              type="error"
              header="There was an error"
              action={
                <Button iconName="refresh" onClick={this.handleClick.bind(this)}>
                  Reload
                </Button>
              }
            >
              <SpaceBetween size="m">
                <div>
                  Reload the page or try again later.{' '}
                  <Link
                    href="#"
                    onFollow={(e) => {
                      e.preventDefault();
                      useFeedback.getState().openFeedback();
                    }}
                    variant="primary"
                  >
                    Send feedback
                  </Link>{' '}
                  and share more details.
                </div>
                <ExpandableSection headerText="Error details">
                  <Box variant="pre">{this.state.error?.message}</Box>
                </ExpandableSection>
              </SpaceBetween>
            </Alert>
          </>
        }
      />
    );
  }
}

interface Props {
  location?: Location;
}
interface State {
  error?: Error;
}
