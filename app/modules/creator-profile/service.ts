import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type {
  AvailabilityDayOfWeek,
  CreatorProfile,
  CreatorProfileDetailsResponse,
  CreatorProfilePortfolioItem,
} from "./types";

const DAY_OF_WEEK_TO_JS: Record<AvailabilityDayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export async function getCreatorProfileDetail(
  creatorId: string,
  token?: string
): Promise<CreatorProfile> {
  const accessToken = await getAccessToken(token);
  const response = await httpClient<CreatorProfileDetailsResponse>(
    `/profiles/creators/${creatorId}`,
    { token: accessToken }
  );

  return mapCreatorDetailToProfile(response);
}

function mapCreatorDetailToProfile(data: CreatorProfileDetailsResponse): CreatorProfile {
  const [city = "Nao informado", state = "BR"] = data.location.includes("/")
    ? data.location.split("/")
    : [data.location || "Nao informado", "BR"];
  const portfolio = mapPortfolio(data.portfolio?.media ?? []);
  const { availabilityDays, availabilitySlotsByDay } = mapAvailability(
    data.availability.days
  );
  const services = (data.tags.length > 0 ? data.tags : [data.niche]).map(
    (serviceName, index) => ({
      id: `${data.id}-${index}`,
      name: serviceName,
      price: data.minPrice != null ? Math.round(data.minPrice) : 0,
    })
  );

  return {
    id: data.id,
    name: data.name,
    specialty: data.niche,
    avatarUrl: data.avatarUrl ?? data.coverImageUrl ?? "",
    isVerified: true,
    isOnline: false,
    rating: data.rating,
    jobsCount: 0,
    responseTime: "Resposta em breve",
    location: {
      city,
      state,
      description: data.bio ?? "",
      distanceKm: 0,
    },
    portfolio,
    testimonials: [],
    services,
    availability: availabilityDays,
    availabilitySlotsByDay,
    workingHours: {
      start: data.availability.workingHours.start,
      end: data.availability.workingHours.end,
      slotDurationMinutes: 60,
    },
  };
}

function mapPortfolio(
  media: CreatorProfileDetailsResponse["portfolio"] extends { media: infer T }
    ? T
    : never
): CreatorProfilePortfolioItem[] {
  return media
    .filter((item) => item.status === "READY")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => {
      const isVideo = item.type === "VIDEO";
      return {
        id: item.id,
        imageUrl: isVideo ? item.thumbnailUrl ?? "" : item.url,
        mediaType: isVideo ? "video" : "image",
        videoUrl: isVideo ? item.url : undefined,
        thumbnailUrl: item.thumbnailUrl ?? undefined,
      };
    })
    .filter((item) => (item.mediaType === "video" ? Boolean(item.videoUrl) : Boolean(item.imageUrl)));
}

function mapAvailability(days: CreatorProfileDetailsResponse["availability"]["days"]) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const activeDays = days.filter(
    (day) => day.isActive && day.startTime != null && day.endTime != null
  );
  const activeWeekDays = new Map(
    activeDays.map((day) => [DAY_OF_WEEK_TO_JS[day.dayOfWeek], day])
  );

  const availabilityDays: string[] = [];
  const availabilitySlotsByDay: Record<string, string[]> = {};

  for (let dayNumber = 1; dayNumber <= totalDays; dayNumber += 1) {
    const date = new Date(year, month, dayNumber);
    const dayRule = activeWeekDays.get(date.getDay());
    if (!dayRule || !dayRule.startTime || !dayRule.endTime) {
      continue;
    }

    availabilityDays.push(String(dayNumber));
    availabilitySlotsByDay[String(dayNumber)] = buildSlotsForRange(
      dayRule.startTime,
      dayRule.endTime
    );
  }

  return { availabilityDays, availabilitySlotsByDay };
}

function buildSlotsForRange(startTime: string, endTime: string) {
  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);
  const slots: string[] = [];

  for (let current = startMinutes; current < endMinutes; current += 60) {
    const hour = String(Math.floor(current / 60)).padStart(2, "0");
    const minute = String(current % 60).padStart(2, "0");
    slots.push(`${hour}:${minute}`);
  }

  return slots;
}

function toMinutes(timeText: string) {
  const [hour = "0", minute = "0"] = timeText.split(":");
  return Number.parseInt(hour, 10) * 60 + Number.parseInt(minute, 10);
}
