import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "~/lib/query/query-keys";
import {
  bootstrapUser,
  changePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
  updateCompanyProfile,
  updateCreatorProfile,
  uploadAvatar,
  uploadPortfolioMedia,
  deletePortfolioMedia,
} from "~/modules/auth/service";
import type {
  UpdateProfileData,
  UpdateCreatorProfileData,
} from "~/modules/auth/service";
import type { UserRole } from "~/modules/auth/types";

export function useBootstrapMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      role,
      token,
      referralCode,
    }: {
      role: UserRole;
      token?: string;
      referralCode?: string;
    }) => bootstrapUser(role, token, referralCode),
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
      data: UpdateProfileData;
      token?: string;
    }) => updateProfile(data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useUpdateCompanyProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      token,
    }: {
      data: {
        documentType?: "CPF" | "CNPJ";
        documentNumber?: string;
        companyName?: string;
        jobTitle?: string;
        businessNiche?: string;
      };
      token?: string;
    }) => updateCompanyProfile(data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useUpdateCreatorProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      token,
    }: {
      data: UpdateCreatorProfileData;
      token?: string;
    }) => updateCreatorProfile(data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, token }: { file: File; token?: string }) =>
      uploadAvatar(file, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useUploadPortfolioMediaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, token }: { file: File; token?: string }) =>
      uploadPortfolioMedia(file, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useDeletePortfolioMediaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mediaId, token }: { mediaId: string; token?: string }) =>
      deletePortfolioMedia(mediaId, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (newPassword: string) => resetPassword(newPassword),
  });
}

export function useChangePasswordMutation() {
  // Sem invalidateQueries: signInWithPassword já dispara onAuthStateChange no AuthProvider,
  // que invalida as queries via o listener global. Evitar dupla invalidação.
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => changePassword(currentPassword, newPassword),
  });
}
