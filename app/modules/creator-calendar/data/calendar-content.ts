import type {
  AvailabilityDay,
  CalendarEvent,
  CalendarWeekDay,
  DailyJob,
  UpcomingJob,
} from "../types";

export const DESKTOP_WEEK_DAYS: CalendarWeekDay[] = [
  { id: "seg", label: "SEG", date: "15" },
  { id: "ter", label: "TER", date: "16" },
  { id: "qua", label: "QUA", date: "17", highlighted: true },
  { id: "qui", label: "QUI", date: "18" },
  { id: "sex", label: "SEX", date: "19" },
  { id: "sab", label: "SAB", date: "20" },
  { id: "dom", label: "DOM", date: "21" },
];

export const DESKTOP_TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
];

export const DESKTOP_EVENTS: CalendarEvent[] = [
  {
    id: "live-branding",
    title: "Live Workshop: Branding",
    startLabel: "09:00",
    endLabel: "10:30",
    dayIndex: 1,
    startHour: 9,
    durationHours: 1.5,
    tone: "primary",
  },
  {
    id: "podcast",
    title: "Gravacao de Podcast",
    startLabel: "12:00",
    endLabel: "14:00",
    dayIndex: 4,
    startHour: 12,
    durationHours: 2,
    tone: "indigo",
  },
];

export const MOBILE_WEEK_DAYS: CalendarWeekDay[] = [
  { id: "dom", label: "DOM", date: "24" },
  { id: "seg", label: "SEG", date: "25" },
  { id: "ter", label: "TER", date: "26" },
  { id: "qua", label: "QUA", date: "27" },
  { id: "qui", label: "QUI", date: "28" },
  { id: "sex", label: "SEX", date: "29", highlighted: true },
  { id: "sab", label: "SAB", date: "30" },
];

export const MOBILE_UPCOMING_JOBS: UpcomingJob[] = [
  {
    id: "outono-inverno",
    category: "Sessao de Fotos",
    title: "Campanha Outono-Inverno",
    badge: "Em 2 dias",
    schedule: "09:00 - 14:00 (5h)",
    location: "Sao Paulo, SP",
    note:
      "Instrucoes: trazer kit basico de maquiagem, 3 opcoes de look casual e chegar 15 min antes.",
    tone: "primary",
  },
  {
    id: "unboxing",
    category: "Gravacao de Conteudo",
    title: "Unboxing Tech Hub",
    schedule: "15:30 - 17:30 (2h)",
    location: "Remoto",
    tone: "muted",
  },
  {
    id: "live",
    category: "Urgente",
    title: "Live de Lancamento",
    schedule: "Contrato aguardando assinatura digital.",
    location: "",
    ctaLabel: "Assinar agora",
    tone: "danger",
  },
];

export const DAILY_JOBS: DailyJob[] = [
  {
    id: "fashion-store",
    category: "Sessao de Fotos",
    title: "Fashion Store Campaign",
    badge: "Urgente",
    schedule: "09:00 - 12:00",
    location: "Estudio Central, SP",
    description: "Alerta: trazer maquiagem propria e 3 trocas de roupa casual.",
    imageUrl: "https://www.figma.com/api/mcp/asset/0feff161-d7c8-49b3-85a1-386119dab84a",
    tone: "primary",
  },
  {
    id: "tech-gadget",
    category: "Unboxing & Review",
    title: "Tech Gadget Pro",
    schedule: "14:30 - 16:00",
    location: "Home Studio",
    client: "Cliente: TechWorld Corp",
    tone: "primary",
  },
  {
    id: "briefing",
    category: "Reuniao",
    title: "Briefing Natal 2024",
    schedule: "17:00 - 18:00",
    location: "Google Meet",
    description: "Observacao: link enviado por e-mail.",
    tone: "muted",
  },
];

export const TIME_OPTIONS = [
  "08:00",
  "09:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
];

export const DEFAULT_AVAILABILITY_DAYS: AvailabilityDay[] = [
  { id: "monday", label: "Segunda-feira", enabled: true, start: "09:00", end: "18:00" },
  { id: "tuesday", label: "Terca-feira", enabled: true, start: "09:00", end: "18:00" },
  { id: "wednesday", label: "Quarta-feira", enabled: true, start: "10:00", end: "16:00" },
  { id: "thursday", label: "Quinta-feira", enabled: true, start: "09:00", end: "18:00" },
  { id: "friday", label: "Sexta-feira", enabled: true, start: "09:00", end: "14:00" },
  { id: "saturday", label: "Sabado", enabled: false, start: "09:00", end: "12:00" },
  { id: "sunday", label: "Domingo", enabled: false, start: "09:00", end: "12:00" },
];
