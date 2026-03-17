import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "~/lib/query/query-keys";
import {
  bootstrapUser,
  updateProfile,
} from "~/modules/auth/service";
import type { UserRole } from "~/modules/auth/types";

export function useBootstrapMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ role, token }: { role: UserRole; token?: string }) =>
      bootstrapUser(role, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      token,
    }: {
      data: { name?: string };
      token?: string;
    }) => updateProfile(data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}
