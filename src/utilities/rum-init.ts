import { AwsRum, AwsRumConfig } from 'aws-rum-web';

declare global {
  function cwr(operation: string, payload: any): void;
}

export let awsRum: AwsRum;

try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    identityPoolId: 'us-west-2:cc021186-161f-4930-9310-75e9a5380fd0',
    endpoint: 'https://dataplane.rum.us-west-2.amazonaws.com',
    telemetries: ['performance', 'errors', 'http'],
    allowCookies: false,
    enableXRay: true,
  };

  const APPLICATION_ID: string = 'fb690ecf-79e8-4f5c-a8d0-710052dc2a04';
  const APPLICATION_VERSION: string = '1.0.0';
  const APPLICATION_REGION: string = 'us-west-2';

  awsRum = new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}
