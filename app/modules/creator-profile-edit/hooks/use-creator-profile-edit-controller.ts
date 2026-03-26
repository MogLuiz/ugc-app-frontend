import { useEffect, useCallback, useMemo, useState } from "react";
import {
  useUpdateProfileMutation,
  useUpdateCreatorProfileMutation,
  useUploadAvatarMutation,
  useUploadPortfolioMediaMutation,
  useDeletePortfolioMediaMutation,
} from "~/modules/auth/mutations";
import type { AuthUser } from "~/modules/auth/types";
import { toast } from "~/components/ui/toast";
import {
  getCreatorProfileErrorMessage,
  getCreatorProfileSuccessMessage,
  validatePortfolioFile,
} from "../lib/feedback";
import { useCreatorAvailabilityQuery, useReplaceCreatorAvailabilityMutation } from "~/modules/creator-calendar/queries";
import { mapAvailabilityDays } from "~/modules/creator-calendar/lib/calendar-mappers";
import { buildHalfHourOptions } from "~/modules/creator-calendar/lib/calendar-date";
import type { AvailabilityDay } from "~/modules/creator-calendar/types";
import {
  useCreatorJobTypesQuery,
  useReplaceCreatorJobTypesMutation,
} from "~/modules/creator-job-types/queries";
import type { CreatorJobTypeItem } from "~/modules/creator-job-types/types";

type CreatorProfileExt = {
  instagramUsername?: string;
  tiktokUsername?: string;
};

function getInitialState(user: AuthUser) {
  const creatorProfile = user.creatorProfile as CreatorProfileExt | undefined;
  return {
    displayName: user.profile?.name ?? user.name ?? "",
    birthDate: user.profile?.birthDate?.slice(0, 10) ?? "",
    bio: user.profile?.bio ?? "",
    phone: user.phone ?? "",
    instagramUsername: creatorProfile?.instagramUsername ?? "",
    tiktokUsername: creatorProfile?.tiktokUsername ?? "",
    addressStreet: user.profile?.addressStreet ?? "",
    addressNumber: user.profile?.addressNumber ?? "",
    addressCity: user.profile?.addressCity ?? "",
    addressState: user.profile?.addressState ?? "",
    addressZipCode: user.profile?.addressZipCode ?? "",
  };
}

export function useCreatorProfileEditController(user: AuthUser) {
  const creatorProfile = user.creatorProfile as CreatorProfileExt | undefined;

  const updateProfileMutation = useUpdateProfileMutation();
  const updateCreatorProfileMutation = useUpdateCreatorProfileMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const uploadPortfolioMediaMutation = useUploadPortfolioMediaMutation();
  const deletePortfolioMediaMutation = useDeletePortfolioMediaMutation();

  const [displayName, setDisplayName] = useState(
    getInitialState(user).displayName
  );
  const [birthDate, setBirthDate] = useState(getInitialState(user).birthDate);
  const [bio, setBio] = useState(getInitialState(user).bio);
  const [phone, setPhone] = useState(getInitialState(user).phone);
  const [instagramUsername, setInstagramUsername] = useState(
    getInitialState(user).instagramUsername
  );
  const [tiktokUsername, setTiktokUsername] = useState(
    getInitialState(user).tiktokUsername
  );
  const [addressStreet, setAddressStreet] = useState(
    getInitialState(user).addressStreet
  );
  const [addressNumber, setAddressNumber] = useState(
    getInitialState(user).addressNumber
  );
  const [addressCity, setAddressCity] = useState(
    getInitialState(user).addressCity
  );
  const [addressState, setAddressState] = useState(
    getInitialState(user).addressState
  );
  const [addressZipCode, setAddressZipCode] = useState(
    getInitialState(user).addressZipCode
  );
  const [niches, setNiches] = useState<string[]>(["Beleza", "Food", "Lifestyle"]);

  const jobTypesQuery = useCreatorJobTypesQuery();
  const replaceJobTypesMutation = useReplaceCreatorJobTypesMutation();
  const [selectedJobTypeIds, setSelectedJobTypeIds] = useState<Set<string>>(new Set());
  const [isJobTypesDirty, setIsJobTypesDirty] = useState(false);

  useEffect(() => {
    if (!jobTypesQuery.data || isJobTypesDirty) return;
    setSelectedJobTypeIds(
      new Set(jobTypesQuery.data.filter((jt) => jt.selected).map((jt) => jt.id)),
    );
  }, [jobTypesQuery.data, isJobTypesDirty]);

  const jobTypes: CreatorJobTypeItem[] = useMemo(() => {
    if (!jobTypesQuery.data) return [];
    return jobTypesQuery.data.map((jt) => ({
      ...jt,
      selected: selectedJobTypeIds.has(jt.id),
    }));
  }, [jobTypesQuery.data, selectedJobTypeIds]);

  const availabilityQuery = useCreatorAvailabilityQuery();
  const replaceAvailabilityMutation = useReplaceCreatorAvailabilityMutation();
  const serverAvailabilityDays = useMemo(
    () => mapAvailabilityDays(availabilityQuery.data),
    [availabilityQuery.data]
  );
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityDay[]>(
    () => mapAvailabilityDays(undefined)
  );
  const [isAvailabilityDirty, setIsAvailabilityDirty] = useState(false);

  useEffect(() => {
    if (!availabilityQuery.data || isAvailabilityDirty) return;
    setAvailabilityDays(serverAvailabilityDays);
  }, [availabilityQuery.data, isAvailabilityDirty, serverAvailabilityDays]);

  useEffect(() => {
    const init = getInitialState(user);
    setDisplayName(init.displayName);
    setBirthDate(init.birthDate);
    setBio(init.bio);
    setPhone(init.phone);
    setInstagramUsername(init.instagramUsername);
    setTiktokUsername(init.tiktokUsername);
    setAddressStreet(init.addressStreet);
    setAddressNumber(init.addressNumber);
    setAddressCity(init.addressCity);
    setAddressState(init.addressState);
    setAddressZipCode(init.addressZipCode);
  }, [user]);

  const displayNameFromUser = user.profile?.name ?? user.name ?? "";
  const username =
    user.name ??
    user.email?.split("@")[0] ??
    "usuario";
  const location =
    user.profile?.addressCity && user.profile?.addressState
      ? `${user.profile.addressCity}, ${user.profile.addressState}`
      : ""
  const portfolioMedia = user.portfolio?.media ?? [];

  const updateAvailabilityDay = useCallback(
    (dayId: string, field: "enabled" | "start" | "end", value: boolean | string) => {
      setIsAvailabilityDirty(true);
      setAvailabilityDays((current) =>
        current.map((day) =>
          day.id === dayId ? { ...day, [field]: value } : day
        )
      );
    },
    []
  );

  const syncWeekdays = useCallback(() => {
    const sourceDay = availabilityDays.find((day) => day.enabled) ?? availabilityDays[0];
    if (!sourceDay) return;
    setIsAvailabilityDirty(true);
    setAvailabilityDays((current) =>
      current.map((day) =>
        day.enabled ? { ...day, start: sourceDay.start, end: sourceDay.end } : day
      )
    );
  }, [availabilityDays]);

  const addNiche = useCallback((niche: string) => {
    if (niche.trim()) {
      setNiches((prev) =>
        prev.includes(niche.trim()) ? prev : [...prev, niche.trim()]
      );
    }
  }, []);

  const removeNiche = useCallback((niche: string) => {
    setNiches((prev) => prev.filter((n) => n !== niche));
  }, []);

  const toggleJobType = useCallback((id: string) => {
    setIsJobTypesDirty(true);
    setSelectedJobTypeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const resetToUser = useCallback(() => {
    const init = getInitialState(user);
    setDisplayName(init.displayName);
    setBirthDate(init.birthDate);
    setBio(init.bio);
    setPhone(init.phone);
    setInstagramUsername(init.instagramUsername);
    setTiktokUsername(init.tiktokUsername);
    setAddressStreet(init.addressStreet);
    setAddressNumber(init.addressNumber);
    setAddressCity(init.addressCity);
    setAddressState(init.addressState);
    setAddressZipCode(init.addressZipCode);
    setAvailabilityDays(serverAvailabilityDays);
    setIsAvailabilityDirty(false);
    if (jobTypesQuery.data) {
      setSelectedJobTypeIds(
        new Set(jobTypesQuery.data.filter((jt) => jt.selected).map((jt) => jt.id)),
      );
    }
    setIsJobTypesDirty(false);
  }, [user, serverAvailabilityDays, jobTypesQuery.data]);

  async function handleAvatarChange(file: File) {
    try {
      await uploadAvatarMutation.mutateAsync({ file });
      toast.success(getCreatorProfileSuccessMessage("avatar_upload"));
    } catch (error) {
      toast.error(getCreatorProfileErrorMessage(error, "avatar_upload"));
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
      toast.success(getCreatorProfileSuccessMessage("portfolio_upload"));
    } catch (error) {
      toast.error(getCreatorProfileErrorMessage(error, "portfolio_upload"));
    }
  }

  async function handlePortfolioRemove(mediaId: string) {
    try {
      await deletePortfolioMediaMutation.mutateAsync({ mediaId });
      toast.success(getCreatorProfileSuccessMessage("portfolio_remove"));
    } catch (error) {
      toast.error(getCreatorProfileErrorMessage(error, "portfolio_remove"));
    }
  }

  async function handleSubmit() {
    try {
      const [profileResult] = await Promise.all([
        updateProfileMutation.mutateAsync({
          data: {
            name: displayName || undefined,
            birthDate: birthDate || undefined,
            bio: bio.trim(),
            phone: phone || undefined,
            addressStreet: addressStreet || undefined,
            addressNumber: addressNumber || undefined,
            addressCity: addressCity || undefined,
            addressState: addressState || undefined,
            addressZipCode: addressZipCode || undefined,
          },
        }),
        updateCreatorProfileMutation.mutateAsync({
          data: {
            instagramUsername: instagramUsername || undefined,
            tiktokUsername: tiktokUsername || undefined,
          },
        }),
      ]);
      if (isAvailabilityDirty) {
        const response = await replaceAvailabilityMutation.mutateAsync({
          days: availabilityDays.map((day) => ({
            dayOfWeek: day.dayOfWeek,
            isActive: day.enabled,
            startTime: day.enabled ? day.start : null,
            endTime: day.enabled ? day.end : null,
          })),
        });
        setAvailabilityDays(mapAvailabilityDays(response));
        setIsAvailabilityDirty(false);
      }
      if (isJobTypesDirty) {
        await replaceJobTypesMutation.mutateAsync(
          Array.from(selectedJobTypeIds),
        );
        setIsJobTypesDirty(false);
      }
      toast.success(getCreatorProfileSuccessMessage("profile_update"));
      if (profileResult.warnings?.length) {
        toast.warning(profileResult.warnings[0]);
      }
    } catch (error) {
      toast.error(getCreatorProfileErrorMessage(error, "profile_update"));
    }
  }

  return {
    displayName,
    setDisplayName,
    birthDate,
    setBirthDate,
    bio,
    setBio,
    phone,
    setPhone,
    instagramUsername,
    setInstagramUsername,
    tiktokUsername,
    setTiktokUsername,
    addressStreet,
    setAddressStreet,
    addressNumber,
    setAddressNumber,
    addressCity,
    setAddressCity,
    addressState,
    setAddressState,
    addressZipCode,
    setAddressZipCode,
    niches,
    addNiche,
    removeNiche,
    availabilityDays,
    timeOptions: buildHalfHourOptions(),
    updateAvailabilityDay,
    syncWeekdays,
    jobTypes,
    toggleJobType,
    isLoadingJobTypes: jobTypesQuery.isLoading,
    displayNameFromUser,
    username,
    location,
    portfolioMedia,
    handleAvatarChange,
    handlePortfolioUpload,
    handlePortfolioRemove,
    handleSubmit,
    resetToUser,
    isSaving:
      updateProfileMutation.isPending ||
      updateCreatorProfileMutation.isPending ||
      replaceAvailabilityMutation.isPending ||
      replaceJobTypesMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    isUploadingPortfolio: uploadPortfolioMediaMutation.isPending,
    isRemovingPortfolio: deletePortfolioMediaMutation.isPending,
  };
}
