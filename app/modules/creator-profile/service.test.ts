import { describe, expect, it } from "vitest";
import { getCreatorProfileDetail } from "./service";
import * as authService from "~/modules/auth/service";
import * as httpClientModule from "~/lib/http/client";

describe("getCreatorProfileDetail", () => {
  it("preserves quicktime mime type for mov portfolio videos", async () => {
    const getAccessTokenMock = vi
      .spyOn(authService, "getAccessToken")
      .mockResolvedValue("token");
    const httpClientMock = vi
      .spyOn(httpClientModule, "httpClient")
      .mockResolvedValue({
        id: "creator-id",
        name: "Adria",
        avatarUrl: null,
        coverImageUrl: null,
        rating: 0,
        location: "Santa Luzia/MG",
        distance: {
          km: 16.5,
          formatted: "16.5 km",
          isWithinServiceRadius: true,
          effectiveServiceRadiusKm: 30,
        },
        bio: "bio",
        tags: [],
        niche: "UGC",
        minPrice: 150,
        ageYears: 22,
        services: [],
        portfolio: {
          id: "portfolio-id",
          userId: "creator-id",
          media: [
            {
              id: "video-id",
              type: "VIDEO",
              url: "https://cdn.example.com/portfolio/clip.mov",
              thumbnailUrl: null,
              mimeType: "video/quicktime",
              sortOrder: 0,
              status: "READY",
              createdAt: "2026-04-18T05:37:19.239Z",
              updatedAt: "2026-04-18T05:37:19.239Z",
            },
          ],
          createdAt: "2026-04-18T04:44:06.823Z",
          updatedAt: "2026-04-18T04:44:06.823Z",
        },
        testimonials: [],
        availability: {
          timezone: "America/Sao_Paulo",
          workingHours: {
            start: "07:00",
            end: "23:30",
          },
          days: [],
        },
      });

    const profile = await getCreatorProfileDetail("creator-id");

    expect(getAccessTokenMock).toHaveBeenCalled();
    expect(httpClientMock).toHaveBeenCalledWith("/profiles/creators/creator-id", {
      token: "token",
    });
    expect(profile.portfolio).toEqual([
      expect.objectContaining({
        id: "video-id",
        mediaType: "video",
        videoUrl: "https://cdn.example.com/portfolio/clip.mov",
        videoMimeType: "video/quicktime",
      }),
    ]);
  });

  it("falls back to url extension when legacy payload omits mime type", async () => {
    vi.spyOn(authService, "getAccessToken").mockResolvedValue("token");
    vi.spyOn(httpClientModule, "httpClient").mockResolvedValue({
      id: "creator-id",
      name: "Adria",
      avatarUrl: null,
      coverImageUrl: null,
      rating: 0,
      location: "Santa Luzia/MG",
      distance: {
        km: 16.5,
        formatted: "16.5 km",
        isWithinServiceRadius: true,
        effectiveServiceRadiusKm: 30,
      },
      bio: "bio",
      tags: [],
      niche: "UGC",
      minPrice: 150,
      ageYears: 22,
      services: [],
      portfolio: {
        id: "portfolio-id",
        userId: "creator-id",
        media: [
          {
            id: "video-id",
            type: "VIDEO",
            url: "https://cdn.example.com/portfolio/clip.mov",
            thumbnailUrl: null,
            sortOrder: 0,
            status: "READY",
            createdAt: "2026-04-18T05:37:19.239Z",
            updatedAt: "2026-04-18T05:37:19.239Z",
          },
        ],
        createdAt: "2026-04-18T04:44:06.823Z",
        updatedAt: "2026-04-18T04:44:06.823Z",
      },
      testimonials: [],
      availability: {
        timezone: "America/Sao_Paulo",
        workingHours: {
          start: "07:00",
          end: "23:30",
        },
        days: [],
      },
    });

    const profile = await getCreatorProfileDetail("creator-id");

    expect(profile.portfolio[0]?.videoMimeType).toBe("video/quicktime");
  });
});
