export type CreatorProfileService = {
  id: string;
  jobTypeId: string;
  name: string;
  description?: string | null;
  price: number;
  durationMinutes: number;
  mode: "PRESENTIAL" | "REMOTE" | "HYBRID";
  currency: string;
};

export type CreatorProfileTestimonial = {
  id: string;
  authorName: string;
  authorRole: "COMPANY" | "CREATOR";
  authorInitials: string;
  rating: number;
  text: string;
};

export type CreatorProfilePortfolioItem = {
  id: string;
  imageUrl: string;
  mediaType?: "image" | "video";
  videoUrl?: string;
  videoMimeType?: string;
  thumbnailUrl?: string;
  views?: string;
};

export type CreatorProfile = {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  isVerified: boolean;
  isOnline: boolean;
  rating: number;
  jobsCount: number;
  ageYears: number | null;
  location: {
    city: string;
    state: string;
    description: string;
    formattedAddress?: string | null;
  };
  distance: {
    km: number | null;
    formatted: string | null;
    isWithinServiceRadius: boolean | null;
    effectiveServiceRadiusKm: number | null;
  };
  portfolio: CreatorProfilePortfolioItem[];
  testimonials: CreatorProfileTestimonial[];
  services: CreatorProfileService[];
  availability: string[];
  availabilitySlotsByDay?: Record<string, string[]>;
  availabilityRules: Array<{
    dayOfWeek: AvailabilityDayOfWeek;
    startTime: string;
    endTime: string;
  }>;
  workingHours: {
    start: string;
    end: string;
    slotDurationMinutes: number;
  };
};

export type AvailabilityDayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export type CreatorProfileDetailsResponse = {
  id: string;
  name: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  rating: number;
  location: string;
  distance: {
    km: number | null;
    formatted: string | null;
    isWithinServiceRadius: boolean | null;
    effectiveServiceRadiusKm: number | null;
  };
  bio: string | null;
  tags: string[];
  niche: string;
  minPrice: number | null;
  ageYears: number | null;
  services: Array<{
    jobTypeId: string;
    name: string;
    description?: string | null;
    mode: "PRESENTIAL" | "REMOTE" | "HYBRID";
    durationMinutes: number;
    basePrice: number;
    currency: string;
  }>;
  portfolio: {
    id: string;
    userId: string;
    media: Array<{
      id: string;
      type: "IMAGE" | "VIDEO";
      url: string;
      thumbnailUrl: string | null;
      mimeType?: string | null;
      sortOrder: number;
      status: "PROCESSING" | "READY" | "FAILED";
      createdAt: string;
      updatedAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  } | null;
  testimonials: CreatorProfileTestimonial[];
  availability: {
    timezone: string;
    workingHours: {
      start: string;
      end: string;
    };
    days: Array<{
      dayOfWeek: AvailabilityDayOfWeek;
      isActive: boolean;
      startTime: string | null;
      endTime: string | null;
    }>;
  };
};
