import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "~/components/ui/toast";
import { useAuthContext } from "~/modules/auth/context";
import {
  useCreateContractRequestMutation,
  usePreviewContractRequestMutation,
} from "~/modules/contract-requests/queries";
import type {
  ContractRequestItem,
  ContractRequestPayload,
} from "~/modules/contract-requests/types";
import type { CreatorProfile } from "../types";
import {
  addMonths,
  buildHireTimeSlots,
  buildHireMonthDays,
  canNavigateToPreviousMonth,
  getCalendarWeekDayLabels,
  getFirstAvailableDateIso,
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

function buildStartsAt(isoDate: string, time: string) {
  const [year = "0", month = "1", day = "1"] = isoDate.split("-");
  const [hour = "0", minute = "0"] = time.split(":");
  const date = new Date(
    Number.parseInt(year, 10),
    Number.parseInt(month, 10) - 1,
    Number.parseInt(day, 10),
    Number.parseInt(hour, 10),
    Number.parseInt(minute, 10),
  );

  return date.toISOString();
}

type CreatorHireFormState = {
  selectedServiceId: string;
  selectedAvailableDate: string | null;
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
  const previewMutation = usePreviewContractRequestMutation();
  const previewRequestSeq = useRef(0);
  const [previewResult, setPreviewResult] = useState<ContractRequestItem | null>(
    null,
  );
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [displayedMonth, setDisplayedMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const companyAddress = useMemo(
    () => formatProfileAddress(user?.profile),
    [user?.profile],
  );
  const initialAvailableDate = useMemo(
    () => getFirstAvailableDateIso(profile, displayedMonth),
    [profile, displayedMonth],
  );
  const [formState, setFormState] = useState<CreatorHireFormState>({
    selectedServiceId: profile.services[0]?.jobTypeId ?? "",
    selectedAvailableDate: initialAvailableDate,
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

  const calendarDays = useMemo(
    () => buildHireMonthDays(profile, displayedMonth, formState.selectedAvailableDate),
    [displayedMonth, formState.selectedAvailableDate, profile],
  );
  const availabilityTimeSlots = useMemo(
    () => buildHireTimeSlots(profile, formState.selectedAvailableDate),
    [formState.selectedAvailableDate, profile],
  );
  const monthLabel = useMemo(() => getHireMonthLabel(displayedMonth), [displayedMonth]);
  const weekDayLabels = useMemo(() => getCalendarWeekDayLabels(), []);
  const canGoToPreviousMonth = useMemo(
    () => canNavigateToPreviousMonth(displayedMonth),
    [displayedMonth],
  );

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
      formState.selectedAvailableDate &&
      calendarDays.some(
        (day) =>
          day.isoDate === formState.selectedAvailableDate &&
          day.isCurrentMonth &&
          day.isAvailable,
      )
    ) {
      return;
    }

    setFormState((current) => ({
      ...current,
      selectedAvailableDate: getFirstAvailableDateIso(profile, displayedMonth),
    }));
  }, [calendarDays, displayedMonth, formState.selectedAvailableDate, profile]);

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
    Boolean(formState.selectedAvailableDate) &&
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
      !formState.selectedAvailableDate ||
      !formState.selectedTimeSlot
    ) {
      return null;
    }

    return {
      creatorId: profile.id,
      jobTypeId: selectedService.jobTypeId,
      description: formState.description.trim(),
      startsAt: buildStartsAt(
        formState.selectedAvailableDate,
        formState.selectedTimeSlot,
      ),
      durationMinutes: selectedService.durationMinutes,
      jobAddress: formState.locationAddress.trim(),
      termsAccepted: formState.termsAccepted,
    };
  };

  const buildPreviewPayload = (): ContractRequestPayload | null => {
    if (
      !selectedService ||
      !formState.selectedAvailableDate ||
      !formState.selectedTimeSlot ||
      !formState.locationAddress.trim()
    ) {
      return null;
    }

    return {
      creatorId: profile.id,
      jobTypeId: selectedService.jobTypeId,
      description: formState.description.trim() || "Solicitação presencial",
      startsAt: buildStartsAt(
        formState.selectedAvailableDate,
        formState.selectedTimeSlot,
      ),
      durationMinutes: selectedService.durationMinutes,
      jobAddress: formState.locationAddress.trim(),
      // Preview é apenas simulação de preço/distância.
      termsAccepted: true,
    };
  };

  useEffect(() => {
    const payload = buildPreviewPayload();
    if (!payload) {
      setPreviewResult(null);
      setPreviewError(null);
      setIsPreviewLoading(false);
      return;
    }

    const currentRequest = ++previewRequestSeq.current;
    setIsPreviewLoading(true);
    setPreviewError(null);

    const timer = setTimeout(async () => {
      try {
        const result = await previewMutation.mutateAsync(payload);
        if (previewRequestSeq.current === currentRequest) {
          setPreviewResult(result);
        }
      } catch (error) {
        if (previewRequestSeq.current !== currentRequest) {
          return;
        }
        const message =
          error instanceof Error ? error.message : "Não foi possível simular os valores.";
        setPreviewResult(null);
        setPreviewError(message);
      } finally {
        if (previewRequestSeq.current === currentRequest) {
          setIsPreviewLoading(false);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    formState.description,
    formState.locationAddress,
    formState.selectedAvailableDate,
    formState.selectedServiceId,
    formState.selectedTimeSlot,
    profile.id,
    selectedService,
  ]);

  const submit = async () => {
    const payload = buildPayload();
    if (!payload) {
      toast.error("Preencha os campos obrigatórios para continuar.");
      return;
    }

    try {
      await createMutation.mutateAsync(payload);
      toast.success("Solicitação enviada com sucesso.");
      void navigate("/ofertas");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar a solicitação.";
      toast.error(message);
    }
  };

  return {
    calendarDays,
    canGoToPreviousMonth,
    availabilityTimeSlots,
    canSubmit,
    companyAddress,
    displayedMonth,
    formState,
    hasServices: profile.services.length > 0,
    isSubmitting: createMutation.isPending,
    isPreviewLoading,
    monthLabel,
    previewError,
    previewResult,
    selectedService,
    weekDayLabels,
    goToNextMonth: () => setDisplayedMonth((current) => addMonths(current, 1)),
    goToPreviousMonth: () =>
      setDisplayedMonth((current) =>
        canNavigateToPreviousMonth(current) ? addMonths(current, -1) : current,
      ),
    setDescription: (value: string) => updateField("description", value),
    setIsEditingAddress: (value: boolean) => updateField("isEditingAddress", value),
    setLocationAddress: (value: string) => updateField("locationAddress", value),
    setSelectedAvailableDate: (value: string) =>
      updateField("selectedAvailableDate", value),
    setSelectedServiceId: (value: string) =>
      updateField("selectedServiceId", value),
    setSelectedTimeSlot: (value: string) => updateField("selectedTimeSlot", value),
    setTermsAccepted: (value: boolean) => updateField("termsAccepted", value),
    submit,
    useRegisteredAddress,
  };
}

export type CreatorHireFlowController = ReturnType<typeof useCreatorHireFlow>;
