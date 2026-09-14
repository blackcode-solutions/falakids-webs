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
