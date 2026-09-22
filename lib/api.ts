const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message = body?.error?.message || "Algo deu errado. Tente novamente.";
    const code = body?.error?.code || "UNKNOWN_ERROR";
    throw new ApiError(message, code, res.status, body?.error?.details);
  }

  return body as T;
}

// ---- Auth (Better Auth endpoints, mounted at /api/auth/*) ----

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
}

export function signUp(input: { name: string; email: string; password: string }) {
  return request<{ user?: AuthUser }>("/api/auth/sign-up/email", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function signIn(input: { email: string; password: string }) {
  return request<{ user?: AuthUser; token?: string }>("/api/auth/sign-in/email", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function signOut() {
  return request<void>("/api/auth/sign-out", { method: "POST" });
}

export function getMe() {
  return request<{ user: AuthUser }>("/api/me");
}

// ---- Clinic (therapist) ----

export interface TherapistProfile {
  id: string;
  name: string;
  email: string;
  clinicName: string;
  specialty?: string;
  phone?: string;
}

export function getClinicMe() {
  return request<{ therapist: TherapistProfile }>("/api/clinic/me");
}

export function registerClinic(input: { clinicName: string; specialty?: string; phone?: string }) {
  return request<{ therapist: { clinicName: string; specialty: string | null; phone: string | null } }>(
    "/api/clinic/register",
    { method: "POST", body: JSON.stringify(input) },
  );
}

export interface ClinicPatient {
  id: string;
  linkId: string;
  name: string;
  age: number;
  birthDate: string;
  diagnosis?: string;
  frequency?: string;
  mainGoal?: string;
  startDate?: string;
  observations?: string;
  responsibleName?: string;
  responsibleRelation?: string;
  responsiblePhone?: string;
  responsibleEmail?: string;
  isClaimed: boolean;
  pendingAssignments: number;
  createdAt: string;
  updatedAt: string;
}

export function listPatients() {
  return request<{ patients: ClinicPatient[] }>("/api/clinic/patients");
}

export interface CreatePatientInput {
  name: string;
  birthDate: string;
  diagnosis?: string;
  startDate?: string;
  observations?: string;
  frequency?: string;
  mainGoal?: string;
  responsibleName?: string;
  responsibleRelation?: string;
  responsiblePhone?: string;
  responsibleEmail?: string;
}

export function createPatient(input: CreatePatientInput) {
  return request<{ patient: ClinicPatient }>("/api/clinic/patients", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface PatientAssignment {
  id: string;
  childId: string;
  title: string;
  notes?: string;
  contentItemIds: string[];
  dueDate?: string;
  status: "PENDING" | "COMPLETED";
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientSessionSummary {
  id: string;
  startedAt: string;
  finishedAt?: string;
  durationSecs?: number;
  wordsAttempted: number;
  wordsCompleted: number;
}

export function getPatient(id: string) {
  return request<{ patient: ClinicPatient; assignments: PatientAssignment[]; recentSessions: PatientSessionSummary[] }>(
    `/api/clinic/patients/${id}`,
  );
}

export function updatePatient(id: string, input: Partial<CreatePatientInput>) {
  return request<{ patient: ClinicPatient }>(`/api/clinic/patients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function createPatientInvite(id: string, expiresInHours = 72) {
  return request<{ invite: { code: string; expiresAt: string } }>(`/api/clinic/patients/${id}/invite`, {
    method: "POST",
    body: JSON.stringify({ expiresInHours }),
  });
}

export function createGenericInvite(expiresInHours = 72) {
  return request<{ invite: { code: string; expiresAt: string } }>("/api/clinic/invites", {
    method: "POST",
    body: JSON.stringify({ expiresInHours }),
  });
}

export function createAssignment(
  patientId: string,
  input: { title: string; notes?: string; contentItemIds?: string[]; dueDate?: string },
) {
  return request<{ assignment: PatientAssignment }>(`/api/clinic/patients/${patientId}/assignments`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteAssignment(patientId: string, assignmentId: string) {
  return request<void>(`/api/clinic/patients/${patientId}/assignments/${assignmentId}`, {
    method: "DELETE",
  });
}

export interface GlobalAssignment extends PatientAssignment {
  patientName: string;
}

export function listAllAssignments(status?: "PENDING" | "COMPLETED") {
  const qs = status ? `?status=${status}` : "";
  return request<{ assignments: GlobalAssignment[] }>(`/api/clinic/assignments${qs}`);
}

// ---- Content library (used by the session builder) ----

export type ContentCategory =
  | "ANIMALS"
  | "COLORS"
  | "FRUITS"
  | "FAMILY"
  | "HOUSE"
  | "NUMBERS"
  | "BODY"
  | "VEHICLES"
  | "NATURE"
  | "EMOTIONS"
  | "TRANSPORTS"
  | "FOOD"
  | "ALFABET";

export interface ContentItem {
  id: string;
  category: ContentCategory;
  slug: string;
  labelPT: string;
  labelEN: string;
  soundPT: string;
  soundEN: string;
  imageUrl?: string;
  mouthVideoUrl?: string;
  onomatopoeia?: string;
  difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  updatedAt?: string;
}

export function listContent(category?: ContentCategory) {
  const qs = category ? `?category=${category}` : "";
  return request<{ contents: ContentItem[] }>(`/api/content${qs}`);
}

// ---- Dashboard ----

export interface DashboardStats {
  activePatients: number;
  pendingTasks: number;
  completedActivities: number;
  weeklyEngagement: number;
  weekProgress: { day: string; value: number }[];
}

export interface RecentSessionSummary {
  id: string;
  childId: string;
  childName: string;
  finishedAt: string;
  wordsAttempted: number;
  wordsCompleted: number;
}

export function getDashboardStats() {
  return request<{ stats: DashboardStats; recentSessions: RecentSessionSummary[] }>("/api/clinic/dashboard");
}

// ---- Messages ----

export interface Message {
  id: string;
  patientLinkId: string;
  senderRole: "THERAPIST" | "PARENT";
  body: string;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  patientLinkId: string;
  childId: string;
  childName: string;
  lastMessage?: Message;
  unreadCount: number;
}

export function getConversations() {
  return request<{ conversations: Conversation[] }>("/api/clinic/conversations");
}

export function getPatientMessages(patientId: string, opts?: { before?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (opts?.before) params.set("before", opts.before);
  if (opts?.limit) params.set("limit", String(opts.limit));
  const qs = params.toString() ? `?${params.toString()}` : "";
  return request<{ messages: Message[] }>(`/api/clinic/patients/${patientId}/messages${qs}`);
}

export function sendPatientMessage(patientId: string, body: string) {
  return request<{ message: Message }>(`/api/clinic/patients/${patientId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export function markPatientMessagesRead(patientId: string) {
  return request<void>(`/api/clinic/patients/${patientId}/messages/read`, { method: "POST" });
}

// ---- Messages & sessions (app/parent side — same API the mobile app and a
// future parent web portal consume; not yet wired into any screen in this
// Next.js project, since the parent-facing pages here (components/Parent*)
// have no auth/child-selection wiring at all yet, unlike the clinic side) ----

export interface ChildConversation {
  patientLinkId: string;
  therapistName: string;
  clinicName?: string;
  lastMessage?: Message;
  unreadCount: number;
}

export function getChildConversations(childId: string) {
  return request<{ conversations: ChildConversation[] }>(`/api/children/${childId}/conversations`);
}

export function getChildMessages(childId: string, opts?: { linkId?: string; before?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (opts?.linkId) params.set("linkId", opts.linkId);
  if (opts?.before) params.set("before", opts.before);
  if (opts?.limit) params.set("limit", String(opts.limit));
  const qs = params.toString() ? `?${params.toString()}` : "";
  return request<{ patientLinkId: string; messages: Message[] }>(`/api/children/${childId}/messages${qs}`);
}

export function sendChildMessage(childId: string, body: string, linkId?: string) {
  return request<{ message: Message }>(`/api/children/${childId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body, linkId }),
  });
}

export function markChildMessagesRead(childId: string, linkId?: string) {
  return request<void>(`/api/children/${childId}/messages/read`, {
    method: "POST",
    body: JSON.stringify({ linkId }),
  });
}
