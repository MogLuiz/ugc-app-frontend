export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: "S",
  tue: "T",
  wed: "Q",
  thu: "Q",
  fri: "S",
  sat: "S",
  sun: "D",
};
