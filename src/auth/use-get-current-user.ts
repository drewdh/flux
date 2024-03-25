import { useQuery } from '@tanstack/react-query';

interface GetCurrentUserResponse {
  Username: string;
}

async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  const resp = await fetch('https://api.drewhanberry.com/auth/?action=GET_USER', {
    credentials: 'include',
  });
  const body = await resp.json();
  if (resp.ok) {
    return body;
  }
  return Promise.reject(resp);
}

export default function useGetCurrentUser() {
  return useQuery({
    queryKey: ['GetCurrentUser'],
    queryFn: getCurrentUser,
    // This may be used throughout the app, so keep it indefinitely (unless logged out, which will invalidate the query)
    staleTime: 60 * 60 * 24,
    retry: (failureCount, error) => {
      if ((error as unknown as Response).status === 401) {
        return false;
      }
      return failureCount <= 3;
    },
    refetchOnWindowFocus: false,
  });
}
