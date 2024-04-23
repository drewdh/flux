export enum Pathname {
  Home = '/',
  Fallback = '*',
  Signin = '/auth/signin',
  PasswordReset = '/auth/reset',
  Live = '/live/:user',
  Channel = '/channel/:login/:tabId?',
  Results = '/results',
  Settings = '/settings',
}
/** This does not handle for optional static segments (e.g., `/projects/project?/:id`) */
export function interpolatePathname(pathname: Pathname, values: Record<string, string>): string {
  return pathname
    .split('/')
    .filter((segment) => {
      // If a path segment is an optional param and doesn't have a corresponding value, exclude it
      const isParam = segment.startsWith(':');
      const isOptional = segment.endsWith('?');
      if (isParam && isOptional) {
        const variableName = segment.split(':')[1].split('?')[0];
        return variableName in values;
      } else {
        return true;
      }
    })
    .map((segment) => {
      if (!segment.startsWith(':')) {
        return segment;
      }
      const variableName = segment.split('?')[0].split(':')[1];
      if (!(variableName in values)) {
        throw new Error(`No value was provided for required route param: :${variableName}`);
      }
      return values[variableName];
    })
    .join('/');
}
