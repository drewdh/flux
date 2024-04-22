export enum Pathname {
  Home = '/',
  Fallback = '*',
  Signin = '/auth/signin',
  PasswordReset = '/auth/reset',
  Live = '/live/:user',
  Results = '/results',
  Settings = '/settings',
}
export function interpolatePathname(pathname: Pathname, values: Record<string, string>): string {
  let interpolatedPathname: string = pathname;
  Object.keys(values).forEach((variable) => {
    interpolatedPathname = interpolatedPathname.replace(`:${variable}`, values[variable]);
  });
  return interpolatedPathname;
}
