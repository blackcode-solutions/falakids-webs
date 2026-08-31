export type Patient = {
  id: string;
  name: string;
  age: number;
  avatarColor: string;
  initials: string;
  condition: string;
  progress: number;
  nextSession?: { day: string; time: string };
  birthDate: string;
  diagnosis: string;
  startDate: string;
  frequency: string;
  observations: string;
  responsible: string;
  phone: string;
  email: string;
  fonoNote: string;
};

export const patients: Patient[] = [
  {
    id: "joao-pedro",
    name: "João Pedro",
    age: 5,
    avatarColor: "#CDEBFF",
    initials: "JP",
    condition: "Dislalia",
    progress: 82,
    nextSession: { day: "Hoje", time: "14:00" },
    birthDate: "12/03/2019",
    diagnosis: "Dislalia",
    startDate: "15/01/2024",
    frequency: "2x por semana",
    observations: "Dificuldade com fonemas /r/ e /s/.",
    responsible: "Juliana Silva (Mãe)",
    phone: "(11) 98765-4321",
    email: "juliana.silva@email.com",
    fonoNote:
      "Evolução positiva. João tem se mostrado muito engajado nas atividades.",
  },
  {
    id: "maria-clara",
    name: "Maria Clara",
    age: 6,
    avatarColor: "#FFD7E4",
    initials: "MC",
    condition: "Atraso de Fala",
    progress: 74,
    nextSession: { day: "Hoje", time: "15:00" },
    birthDate: "22/07/2018",
    diagnosis: "Atraso de fala",
    startDate: "03/02/2024",
    frequency: "2x por semana",
    observations: "Vocabulário reduzido para a idade.",
    responsible: "Carlos Oliveira (Pai)",
    phone: "(11) 91234-5678",
    email: "carlos.oliveira@email.com",
    fonoNote: "Já incorpora frases mais longas nas sessões.",
  },
  {
    id: "lucas-gabriel",
    name: "Lucas Gabriel",
    age: 7,
    avatarColor: "#D8F5E3",
    initials: "LG",
    condition: "Gagueira",
    progress: 68,
    nextSession: { day: "Hoje", time: "16:00" },
    birthDate: "05/11/2017",
    diagnosis: "Gagueira",
    startDate: "20/03/2024",
    frequency: "1x por semana",
    observations: "Bloqueios mais frequentes em situações de ansiedade.",
    responsible: "Fernanda Costa (Mãe)",
    phone: "(11) 99887-6655",
    email: "fernanda.costa@email.com",
    fonoNote: "Técnicas de fala suave estão reduzindo os bloqueios.",
  },
  {
    id: "ana-julia",
    name: "Ana Júlia",
    age: 5,
    avatarColor: "#FFE3C2",
    initials: "AJ",
    condition: "Troca de Fonemas",
    progress: 91,
    birthDate: "18/09/2019",
    diagnosis: "Troca de fonemas",
    startDate: "10/01/2024",
    frequency: "2x por semana",
    observations: "Troca /l/ por /r/ em palavras compostas.",
    responsible: "Ana Paula (Mãe)",
    phone: "(11) 97766-5544",
    email: "ana.paula@email.com",
    fonoNote: "Excelente evolução, quase na alta do fonema trabalhado.",
  },
  {
    id: "pedro-henrique",
    name: "Pedro Henrique",
    age: 4,
    avatarColor: "#E3D8FF",
    initials: "PH",
    condition: "Desvio Fonológico",
    progress: 63,
    birthDate: "14/02/2020",
    diagnosis: "Desvio fonológico",
    startDate: "28/02/2024",
    frequency: "2x por semana",
    observations: "Simplifica encontros consonantais.",
    responsible: "Marcos Henrique (Pai)",
    phone: "(11) 96655-4433",
    email: "marcos.henrique@email.com",
    fonoNote: "Precisa de mais reforço em casa entre as sessões.",
  },
  {
    id: "sofia-lima",
    name: "Sofia Lima",
    age: 6,
    avatarColor: "#FFD7D2",
    initials: "SL",
    condition: "Linguagem",
    progress: 78,
    birthDate: "30/05/2018",
    diagnosis: "Atraso de linguagem",
    startDate: "12/12/2023",
    frequency: "2x por semana",
    observations: "Boa compreensão, dificuldade na expressão.",
    responsible: "Beatriz Lima (Mãe)",
    phone: "(11) 95544-3322",
    email: "beatriz.lima@email.com",
    fonoNote: "Ampliando o vocabulário expressivo a cada semana.",
  },
];

export type Activity = {
  id: string;
  name: string;
  phoneme: string;
  position: string;
  emoji: string;
  bg: string;
};

export const activities: Activity[] = [
  { id: "rato", name: "Rato", phoneme: "R", position: "inicial", emoji: "🐭", bg: "#E9ECFB" },
  { id: "rua", name: "Rua", phoneme: "R", position: "inicial", emoji: "🛣️", bg: "#D9F0E4" },
  { id: "rei", name: "Rei", phoneme: "R", position: "inicial", emoji: "👑", bg: "#FDE9C8" },
  { id: "sol", name: "Sol", phoneme: "S", position: "inicial", emoji: "☀️", bg: "#FFEFC2" },
  { id: "sapo", name: "Sapo", phoneme: "S", position: "inicial", emoji: "🐸", bg: "#D8F5D0" },
  { id: "sapato", name: "Sapato", phoneme: "S", position: "inicial", emoji: "👞", bg: "#FBE0D6" },
  { id: "roda", name: "Roda", phoneme: "R", position: "inicial", emoji: "🎡", bg: "#DCEBFF" },
  { id: "ra", name: "Rã", phoneme: "R", position: "inicial", emoji: "🐸", bg: "#E4F7EF" },
];

export const phonemeFilters = ["R", "S", "L", "T", "Outros"];
export const positionFilters = ["Inicial", "Medial", "Final"];
export const structureFilters = ["CV", "CVC", "CVCV", "CCV"];

export type Message = {
  id: string;
  name: string;
  relation: string;
  preview: string;
  time: string;
  unread?: boolean;
};

export const messages: Message[] = [
  { id: "1", name: "Juliana Silva (Mãe de João)", relation: "joao-pedro", preview: "Percebi que ele está pronunciando melhor o R!", time: "10:30", unread: true },
  { id: "2", name: "Carlos Oliveira (Pai da Maria)", relation: "maria-clara", preview: "Obrigado pelo feedback!", time: "Ontem" },
  { id: "3", name: "Fernanda Costa (Mãe do Lucas)", relation: "lucas-gabriel", preview: "Tudo certo, até amanhã!", time: "10:15" },
  { id: "4", name: "Ana Paula (Mãe da Sofia)", relation: "sofia-lima", preview: "Ela está pronunciando melhor o som R.", time: "Seg" },
];

export const weekProgress = [
  { day: "Seg", value: 20 },
  { day: "Ter", value: 35 },
  { day: "Qua", value: 32 },
  { day: "Qui", value: 55 },
  { day: "Sex", value: 60 },
  { day: "Sáb", value: 78 },
  { day: "Dom", value: 92 },
];

export const monthlyEvolution = [
  { month: "Jan", value: 20 },
  { month: "Fev", value: 45 },
  { month: "Mar", value: 65 },
  { month: "Abr", value: 80 },
  { month: "Mai", value: 92 },
];

export const achievements = [
  { id: "1", name: "Primeiros Passos", icon: "👣", earned: true },
  { id: "2", name: "Foco Total", icon: "🎯", earned: true },
  { id: "3", name: "Super Aprendiz", icon: "⭐", earned: true },
  { id: "4", name: "Mestre do Som R", icon: "🏆", earned: true },
  { id: "5", name: "Maratonista", icon: "🏅", earned: false },
];

export const clinicName = "Dra. Amanda";
export const clinicRole = "Fonoaudióloga";

// ----- Extras used across the app -----

export const activePatient = patients[0]; // João Pedro (paciente logado como responsável)

export type ParentTask = {
  id: string;
  title: string;
  activitiesCount: number;
  status: "pendente" | "concluida";
  progress?: number;
};

export const parentTasks: ParentTask[] = [
  { id: "t1", title: "Trabalhar o som R", activitiesCount: 3, status: "pendente" },
  { id: "t2", title: "Nomear figuras", activitiesCount: 5, status: "pendente" },
  { id: "t3", title: "Som R - Inicial", activitiesCount: 4, status: "concluida", progress: 100 },
];

export const overallProgress = 92;

export const gamification = {
  level: 5,
  xp: 350,
  xpMax: 500,
  coins: 320,
  dailyChallenge: { label: "Complete 3 atividades e ganhe 50 moedas", done: 2, total: 3 },
};

export type Session = {
  id: string;
  date: string;
  phoneme: string;
  position: string;
  status: "concluída" | "agendada";
  score?: number;
};

export const patientSessions: Session[] = [
  { id: "s1", date: "26/08/2026", phoneme: "R", position: "Inicial", status: "concluída", score: 92 },
  { id: "s2", date: "19/08/2026", phoneme: "R", position: "Inicial", status: "concluída", score: 85 },
  { id: "s3", date: "12/08/2026", phoneme: "S", position: "Medial", status: "concluída", score: 78 },
  { id: "s4", date: "05/09/2026", phoneme: "R", position: "Inicial", status: "agendada" },
];

export type PatientTask = {
  id: string;
  title: string;
  sentDate: string;
  status: "pendente" | "concluída";
};

export const patientTasks: PatientTask[] = [
  { id: "pt1", title: "Trabalhar o som R", sentDate: "28/08/2026", status: "pendente" },
  { id: "pt2", title: "Nomear figuras", sentDate: "25/08/2026", status: "concluída" },
  { id: "pt3", title: "Repetir palavras com R", sentDate: "20/08/2026", status: "concluída" },
];

export type PatientFile = { id: string; name: string; type: string; date: string };

export const patientFiles: PatientFile[] = [
  { id: "f1", name: "Avaliação inicial.pdf", type: "PDF", date: "15/01/2024" },
  { id: "f2", name: "Relatório trimestral.pdf", type: "PDF", date: "10/04/2024" },
  { id: "f3", name: "Áudio - sessão 12.mp3", type: "Áudio", date: "12/08/2026" },
];

export const reportStats = {
  acertos: 184,
  erros: 16,
  atividades: 28,
  tempoTotal: "8h 45m",
};

export type SessionActivity = { id: string; name: string; emoji: string; bg: string };

export const sessionBuilderActivities: SessionActivity[] = [
  { id: "rato", name: "Rato", emoji: "🐭", bg: "#E9ECFB" },
  { id: "rua", name: "Rua", emoji: "🛣️", bg: "#D9F0E4" },
  { id: "rei", name: "Rei", emoji: "👑", bg: "#FDE9C8" },
];