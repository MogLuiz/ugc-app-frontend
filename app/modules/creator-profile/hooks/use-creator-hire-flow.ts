import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "~/components/ui/toast";
import { useAuthContext } from "~/modules/auth/context";
import { useCreateContractRequestMutation } from "~/modules/contract-requests/queries";
import type { ContractRequestPayload } from "~/modules/contract-requests/types";
import type { CreatorProfile } from "../types";
import {
  buildHireDayOptions,
  buildHireTimeSlots,
  getHireMonthLabel,
} from "../utils/hire-availability";

function formatProfileAddress(
  profile:
    | {
        addressStreet?: string;
        addressNumber?: string;
        addressCity?: string;
        addressState?: string;
        addressZipCode?: string;
      }
    | null
    | undefined,
) {
  return (
    [
      [profile?.addressStreet, profile?.addressNumber].filter(Boolean).join(", "),
      profile?.addressCity
        ? profile?.addressState
          ? `${profile.addressCity}/${profile.addressState}`
          : profile.addressCity
        : null,
      profile?.addressZipCode ? `CEP ${profile.addressZipCode}` : null,
    ]
      .filter(Boolean)
      .join(" - ") || ""
  );
}

function buildStartsAt(dayNumber: string, time: string) {
  const today = new Date();
  const [hour = "0", minute = "0"] = time.split(":");
  const date = new Date(
    today.getFullYear(),
    today.getMonth(),
    Number.parseInt(dayNumber, 10),
    Number.parseInt(hour, 10),
    Number.parseInt(minute, 10),
  );

  return date.toISOString();
}

type CreatorHireFormState = {
  selectedServiceId: string;
  selectedAvailableDay: string | null;
  selectedTimeSlot: string | null;
  locationAddress: string;
  description: string;
  termsAccepted: boolean;
  isEditingAddress: boolean;
};

export function useCreatorHireFlow(profile: CreatorProfile) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const createMutation = useCreateContractRequestMutation();
  const companyAddress = useMemo(
    () => formatProfileAddress(user?.profile),
    [user?.profile],
  );
  const [formState, setFormState] = useState<CreatorHireFormState>({
    selectedServiceId: profile.services[0]?.jobTypeId ?? "",
    selectedAvailableDay: profile.availability[0] ?? null,
    selectedTimeSlot: null,
    locationAddress: companyAddress,
    description: "",
    termsAccepted: false,
    isEditingAddress: !companyAddress,
  });

  const selectedService =
    profile.services.find(
      (service) => service.jobTypeId === formState.selectedServiceId,
    ) ??
    profile.services[0] ??
    null;

  const availabilityDayOptions = useMemo(
    () => buildHireDayOptions(profile.availability),
    [profile.availability],
  );
  const availabilityTimeSlots = useMemo(
    () => buildHireTimeSlots(profile, formState.selectedAvailableDay),
    [formState.selectedAvailableDay, profile],
  );
  const monthLabel = useMemo(() => getHireMonthLabel(), []);

  useEffect(() => {
    if (!profile.services.some((service) => service.jobTypeId === formState.selectedServiceId)) {
      setFormState((current) => ({
        ...current,
        selectedServiceId: profile.services[0]?.jobTypeId ?? "",
      }));
    }
  }, [formState.selectedServiceId, profile.services]);

  useEffect(() => {
    if (
      formState.selectedAvailableDay &&
      profile.availability.includes(formState.selectedAvailableDay)
    ) {
      return;
    }

    setFormState((current) => ({
      ...current,
      selectedAvailableDay: profile.availability[0] ?? null,
    }));
  }, [formState.selectedAvailableDay, profile.availability]);

  useEffect(() => {
    if (
      formState.selectedTimeSlot &&
      availabilityTimeSlots.includes(formState.selectedTimeSlot)
    ) {
      return;
    }

    setFormState((current) => ({
      ...current,
      selectedTimeSlot: availabilityTimeSlots[0] ?? null,
    }));
  }, [availabilityTimeSlots, formState.selectedTimeSlot]);

  useEffect(() => {
    if (!companyAddress || formState.locationAddress.trim()) {
      return;
    }

    setFormState((current) => ({
      ...current,
      locationAddress: companyAddress,
      isEditingAddress: false,
    }));
  }, [companyAddress, formState.locationAddress]);

  const canSubmit =
    Boolean(selectedService) &&
    Boolean(formState.selectedAvailableDay) &&
    Boolean(formState.selectedTimeSlot) &&
    Boolean(formState.locationAddress.trim()) &&
    Boolean(formState.description.trim()) &&
    formState.termsAccepted;

  const updateField = <K extends keyof CreatorHireFormState>(
    field: K,
    value: CreatorHireFormState[K],
  ) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const useRegisteredAddress = () => {
    updateField("locationAddress", companyAddress);
    updateField("isEditingAddress", false);
  };

  const buildPayload = (): ContractRequestPayload | null => {
    if (
      !selectedService ||
      !formState.selectedAvailableDay ||
      !formState.selectedTimeSlot
    ) {
      return null;
    }

    return {
      creatorId: profile.id,
      jobTypeId: selectedService.jobTypeId,
      description: formState.description.trim(),
      startsAt: buildStartsAt(
        formState.selectedAvailableDay,
        formState.selectedTimeSlot,
      ),
      durationMinutes: selectedService.durationMinutes,
      locationAddress: formState.locationAddress.trim(),
      termsAccepted: formState.termsAccepted,
    };
  };

  const submit = async () => {
    const payload = buildPayload();
    if (!payload) {
      toast.error("Preencha os campos obrigatórios para continuar.");
      return;
    }

    try {
      await createMutation.mutateAsync(payload);
      toast.success("Solicitação enviada com sucesso.");
      void navigate("/campanhas");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar a solicitação.";
      toast.error(message);
    }
  };

  return {
    availabilityDayOptions,
    availabilityTimeSlots,
    canSubmit,
    companyAddress,
    formState,
    hasServices: profile.services.length > 0,
    isSubmitting: createMutation.isPending,
    monthLabel,
    selectedService,
    setDescription: (value: string) => updateField("description", value),
    setIsEditingAddress: (value: boolean) => updateField("isEditingAddress", value),
    setLocationAddress: (value: string) => updateField("locationAddress", value),
    setSelectedAvailableDay: (value: string) =>
      updateField("selectedAvailableDay", value),
    setSelectedServiceId: (value: string) =>
      updateField("selectedServiceId", value),
    setSelectedTimeSlot: (value: string) => updateField("selectedTimeSlot", value),
    setTermsAccepted: (value: boolean) => updateField("termsAccepted", value),
    submit,
    useRegisteredAddress,
  };
}

export type CreatorHireFlowController = ReturnType<typeof useCreatorHireFlow>;
