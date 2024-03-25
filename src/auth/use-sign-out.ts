import { useMutation, useQueryClient } from '@tanstack/react-query';

async function signOut() {
  const resp = await fetch('https://api.drewhanberry.com/auth/?action=SIGN_OUT', {
    credentials: 'include',
  });
  if (resp.ok) {
    return resp.json();
  }
  return Promise.reject(resp);
}

export default function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['GetCurrentUser'] });
    },
  });
}
