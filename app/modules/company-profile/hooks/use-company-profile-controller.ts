import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useDeletePortfolioMediaMutation,
  useUpdateCompanyProfileMutation,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUploadPortfolioMediaMutation,
} from "~/modules/auth/mutations";
import type { AuthUser } from "~/modules/auth/types";
import { toast } from "~/components/ui/toast";
import {
  getCompanyProfileErrorMessage,
  getCompanyProfileSuccessMessage,
  validatePortfolioFile,
} from "../lib/feedback";
import {
  companyProfileSchema,
  type CompanyProfileForm,
} from "../schemas/company-profile";

function getDefaultValues(user: AuthUser): CompanyProfileForm {
  const profile = user.profile;
  const company = user.companyProfile;

  return {
    name: profile?.name ?? user.name ?? "",
    bio: profile?.bio ?? "",
    companyName: company?.companyName ?? "",
    jobTitle: company?.jobTitle ?? "",
    businessNiche: company?.businessNiche ?? "",
    phone: user.phone ?? "",
    documentType: (company?.documentType as "CPF" | "CNPJ") ?? "",
    documentNumber: company?.documentNumber ?? "",
    addressStreet: profile?.addressStreet ?? "",
    addressNumber: profile?.addressNumber ?? "",
    addressCity: profile?.addressCity ?? "",
    addressState: profile?.addressState ?? "",
    addressZipCode: profile?.addressZipCode ?? "",
  };
}

export function useCompanyProfileController(user: AuthUser) {
  const [isEditing, setIsEditing] = useState(false);
  const updateProfileMutation = useUpdateProfileMutation();
  const updateCompanyProfileMutation = useUpdateCompanyProfileMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const uploadPortfolioMediaMutation = useUploadPortfolioMediaMutation();
  const deletePortfolioMediaMutation = useDeletePortfolioMediaMutation();

  const form = useForm<CompanyProfileForm>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: getDefaultValues(user),
  });

  function handleEdit() {
    form.reset(getDefaultValues(user));
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  async function handleAvatarChange(file: File) {
    try {
      await uploadAvatarMutation.mutateAsync({ file });
      toast.success(getCompanyProfileSuccessMessage("avatar_upload"));
    } catch (error) {
      toast.error(getCompanyProfileErrorMessage(error, "avatar_upload"));
    }
  }

  async function handleSubmit(data: CompanyProfileForm) {
    try {
      const [profileResult] = await Promise.all([
        updateProfileMutation.mutateAsync({
          data: {
            name: data.name,
            bio: data.bio || undefined,
            phone: data.phone || undefined,
            addressStreet: data.addressStreet || undefined,
            addressNumber: data.addressNumber || undefined,
            addressCity: data.addressCity || undefined,
            addressState: data.addressState || undefined,
            addressZipCode: data.addressZipCode || undefined,
          },
        }),
        updateCompanyProfileMutation.mutateAsync({
          data: {
            companyName: data.companyName,
            ...(data.jobTitle && { jobTitle: data.jobTitle }),
            ...(data.businessNiche && { businessNiche: data.businessNiche }),
            ...(data.documentType && {
              documentType: data.documentType as "CPF" | "CNPJ",
            }),
            ...(data.documentNumber && {
              documentNumber: data.documentNumber,
            }),
          },
        }),
      ]);

      setIsEditing(false);
      toast.success(getCompanyProfileSuccessMessage("profile_update"));
      if (profileResult.warnings?.length) {
        toast.warning(profileResult.warnings[0]);
      }
    } catch (error) {
      toast.error(getCompanyProfileErrorMessage(error, "profile_update"));
    }
  }

  async function handlePortfolioUpload(file: File) {
    const validationError = validatePortfolioFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      await uploadPortfolioMediaMutation.mutateAsync({ file });
      toast.success(getCompanyProfileSuccessMessage("portfolio_upload"));
    } catch (error) {
      toast.error(getCompanyProfileErrorMessage(error, "portfolio_upload"));
    }
  }

  async function handlePortfolioRemove(mediaId: string) {
    try {
      await deletePortfolioMediaMutation.mutateAsync({ mediaId });
      toast.success(getCompanyProfileSuccessMessage("portfolio_remove"));
    } catch (error) {
      toast.error(getCompanyProfileErrorMessage(error, "portfolio_remove"));
    }
  }

  const profile = user.profile;
  const displayName = profile?.name ?? user.name ?? "Empresa";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    company: user.companyProfile,
    displayName,
    form,
    handleAvatarChange,
    handleCancelEdit,
    handleEdit,
    handlePortfolioRemove,
    handlePortfolioUpload,
    initials,
    isEditing,
    portfolioMedia: user.portfolio?.media ?? [],
    profile,
    submit: form.handleSubmit(handleSubmit),
    user,
    mutations: {
      deletePortfolioMedia: deletePortfolioMediaMutation,
      updateCompanyProfile: updateCompanyProfileMutation,
      updateProfile: updateProfileMutation,
      uploadAvatar: uploadAvatarMutation,
      uploadPortfolioMedia: uploadPortfolioMediaMutation,
    },
  };
}
