export type CreatorProfileService = {
  id: string;
  name: string;
  price: number;
};

export type CreatorProfileTestimonial = {
  id: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  rating: number;
  text: string;
};

export type CreatorProfilePortfolioItem = {
  id: string;
  imageUrl: string;
  mediaType?: "image" | "video";
  videoUrl?: string;
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
  responseTime: string;
  location: {
    city: string;
    state: string;
    description: string;
    distanceKm: number;
  };
  portfolio: CreatorProfilePortfolioItem[];
  testimonials: CreatorProfileTestimonial[];
  services: CreatorProfileService[];
  availability: string[];
  availabilitySlotsByDay?: Record<string, string[]>;
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
  bio: string | null;
  tags: string[];
  niche: string;
  minPrice: number | null;
  portfolio: {
    id: string;
    userId: string;
    media: Array<{
      id: string;
      type: "IMAGE" | "VIDEO";
      url: string;
      thumbnailUrl: string | null;
      sortOrder: number;
      status: "PROCESSING" | "READY" | "FAILED";
      createdAt: string;
      updatedAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  } | null;
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
