import { useEffect, useCallback, useState } from "react";
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
import type { CreatorService, DayOfWeek } from "../types";

const DEFAULT_SERVICES: CreatorService[] = [
  {
    id: "1",
    title: "Vídeo 30s",
    description: "Edição inclusa, formato Reels/TikTok",
    price: 150,
  },
  {
    id: "2",
    title: "Vídeo 60s",
    description: "Ideal para review completo de produto",
    price: 250,
  },
  {
    id: "3",
    title: "Unboxing & Estético",
    description: "Clipe cinematográfico sem fala",
    price: 180,
  },
  {
    id: "4",
    title: "Diária Presencial",
    description: "Evento ou gravação em loja física",
    price: 600,
  },
];

const DEFAULT_DAYS: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri"];

type CreatorProfileExt = {
  instagramUsername?: string;
  tiktokUsername?: string;
};

function getInitialState(user: AuthUser) {
  const creatorProfile = user.creatorProfile as CreatorProfileExt | undefined;
  return {
    displayName: user.profile?.name ?? user.name ?? "",
    birthDate: user.profile?.birthDate?.slice(0, 10) ?? "",
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
  const [availableDays, setAvailableDays] =
    useState<Set<DayOfWeek>>(new Set(DEFAULT_DAYS));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [services, setServices] = useState<CreatorService[]>(DEFAULT_SERVICES);

  useEffect(() => {
    const init = getInitialState(user);
    setDisplayName(init.displayName);
    setBirthDate(init.birthDate);
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

  const toggleDay = useCallback((day: DayOfWeek) => {
    setAvailableDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }, []);

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

  const removeService = useCallback((id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const resetToUser = useCallback(() => {
    const init = getInitialState(user);
    setDisplayName(init.displayName);
    setBirthDate(init.birthDate);
    setPhone(init.phone);
    setInstagramUsername(init.instagramUsername);
    setTiktokUsername(init.tiktokUsername);
    setAddressStreet(init.addressStreet);
    setAddressNumber(init.addressNumber);
    setAddressCity(init.addressCity);
    setAddressState(init.addressState);
    setAddressZipCode(init.addressZipCode);
  }, [user]);

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
      await Promise.all([
        updateProfileMutation.mutateAsync({
          data: {
            name: displayName || undefined,
            birthDate: birthDate || undefined,
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
      toast.success(getCreatorProfileSuccessMessage("profile_update"));
    } catch (error) {
      toast.error(getCreatorProfileErrorMessage(error, "profile_update"));
    }
  }

  return {
    displayName,
    setDisplayName,
    birthDate,
    setBirthDate,
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
    availableDays,
    toggleDay,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    services,
    removeService,
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
      updateProfileMutation.isPending || updateCreatorProfileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    isUploadingPortfolio: uploadPortfolioMediaMutation.isPending,
    isRemovingPortfolio: deletePortfolioMediaMutation.isPending,
  };
}
