import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  useDeletePortfolioMediaMutation,
  useUpdateCompanyProfileMutation,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUploadPortfolioMediaMutation,
} from "~/modules/auth/mutations";
import type { AuthUser } from "~/modules/auth/types";
import { toast } from "~/components/ui/toast";
import type {
  ProfileProgress,
  ProfileProgressItem,
} from "~/components/ui/profile-progress-block";
import {
  getCompanyProfileErrorMessage,
  getCompanyProfileSuccessMessage,
  validatePortfolioFile,
} from "../lib/feedback";
import {
  companyProfileSchema,
  type CompanyProfileForm,
} from "../schemas/company-profile";

export type { ProfileProgress, ProfileProgressItem };

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
  const updateProfileMutation = useUpdateProfileMutation();
  const updateCompanyProfileMutation = useUpdateCompanyProfileMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const uploadPortfolioMediaMutation = useUploadPortfolioMediaMutation();
  const deletePortfolioMediaMutation = useDeletePortfolioMediaMutation();

  const form = useForm<CompanyProfileForm>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: getDefaultValues(user),
  });

  // Subscribe to all fields needed for progress calculation
  const watchedFields = useWatch({
    control: form.control,
    name: [
      "companyName",
      "bio",
      "businessNiche",
      "name",
      "phone",
      "documentNumber",
      "addressCity",
      "addressState",
      "addressZipCode",
      "addressStreet",
    ],
  });

  const portfolioMedia = user.portfolio?.media ?? [];

  const profileProgress = useMemo((): ProfileProgress => {
    const [
      companyName,
      bio,
      businessNiche,
      name,
      phone,
      documentNumber,
      addressCity,
      addressState,
      addressZipCode,
      addressStreet,
    ] = watchedFields;

    // Address is complete only when all 4 key fields are present (sufficient for geocoding)
    const addressComplete =
      !!addressCity?.trim() &&
      !!addressState?.trim() &&
      !!addressZipCode?.trim() &&
      !!addressStreet?.trim();

    const items: ProfileProgressItem[] = [
      { label: "Logo da empresa", done: !!user.profile?.photoUrl },
      { label: "Nome da empresa", done: !!companyName?.trim() },
      { label: "Bio / sobre a empresa", done: !!bio?.trim() },
      { label: "Nicho preenchido", done: !!businessNiche?.trim() },
      { label: "Nome do responsável", done: !!name?.trim() },
      { label: "Telefone", done: !!phone?.trim() },
      { label: "Documento preenchido", done: !!documentNumber?.trim() },
      { label: "Endereço cadastrado", done: addressComplete },
      { label: "Portfólio adicionado", done: portfolioMedia.length > 0 },
    ];

    const completedCount = items.filter((i) => i.done).length;
    return {
      percent: Math.round((completedCount / items.length) * 100),
      completedCount,
      items,
    };
  }, [watchedFields, user, portfolioMedia]);

  async function handleAvatarChange(file: File) {
    try {
      await uploadAvatarMutation.mutateAsync({ file });
      toast.success(getCompanyProfileSuccessMessage("avatar_upload"));
    } catch (error) {
      toast.error(getCompanyProfileErrorMessage(error, "avatar_upload"));
    }
  }

  async function internalHandleSubmit(data: CompanyProfileForm) {
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

  function resetToUser() {
    form.reset(getDefaultValues(user));
  }

  const profile = user.profile;
  const displayName = profile?.name ?? user.name ?? "Empresa";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    displayName,
    form,
    handleAvatarChange,
    handlePortfolioRemove,
    handlePortfolioUpload,
    handleSubmit: form.handleSubmit(internalHandleSubmit),
    initials,
    isDirty: form.formState.isDirty,
    isSaving:
      updateProfileMutation.isPending ||
      updateCompanyProfileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    isUploadingPortfolio: uploadPortfolioMediaMutation.isPending,
    isRemovingPortfolio: deletePortfolioMediaMutation.isPending,
    portfolioMedia,
    profile,
    profileProgress,
    resetToUser,
    user,
  };
}
