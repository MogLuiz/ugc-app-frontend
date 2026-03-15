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
};
