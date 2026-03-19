export type CreatorJobTypeItem = {
  id: string;
  name: string;
  mode: 'PRESENTIAL' | 'REMOTE' | 'HYBRID';
  durationMinutes: number;
  price: number;
  selected: boolean;
  basePriceCents: number | null;
};
