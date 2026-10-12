export interface ApiUser {
  id: string;
  email: string;
  role: string;
  is_admin: boolean;
}

export interface NewsletterSubscription {
  name: string;
  email: string;
}

export interface InteractionRow {
  id: string;
  session_id: string | null;
  user_message: string;
  ai_response: string;
  timestamp: string;
  is_read: boolean;
}

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const AUTH_INVALIDATED_EVENT = "portfolio:auth-invalidated";

export function notifyAuthInvalidated(status: 401 | 403) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_INVALIDATED_EVENT, { detail: { status } }));
  }
}

export function requestAuthRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_INVALIDATED_EVENT));
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined;

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: "same-origin",
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    const errorBody = typeof payload === "object" && payload !== null
      ? payload as { error?: unknown; message?: unknown; code?: unknown }
      : null;
    const message = typeof errorBody?.message === "string"
      ? errorBody.message
      : typeof errorBody?.error === "string"
        ? errorBody.error
        : `Request failed with status ${response.status}`;
    const code = typeof errorBody?.code === "string" ? errorBody.code : undefined;

    throw new ApiError(message, response.status, code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return await response.json() as T;
}

export function subscribeToNewsletter(input: NewsletterSubscription) {
  return apiRequest<{ ok: true }>("/api/newsletter", {
    method: "POST",
    body: input,
  });
}

export interface ContactMessage {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  message: string;
}

export function sendContactMessage(input: ContactMessage) {
  return apiRequest<{ ok: true }>("/api/contact", {
    method: "POST",
    body: input,
  });
}

export function loginAdmin(input: { email: string; password: string }) {
  return apiRequest<{ user: ApiUser }>("/api/auth/login", {
    method: "POST",
    body: input,
  });
}

export function getAuthSession() {
  return apiRequest<{ user: ApiUser }>("/api/auth/session");
}

export function logoutAdmin() {
  return apiRequest<void>("/api/auth/logout", { method: "POST" });
}

export function getAdminInteractions() {
  return apiRequest<{ interactions: InteractionRow[] }>("/api/admin/interactions");
}

export function markAdminSessionRead(sessionId: string) {
  return apiRequest<{ ok: true }>(`/api/admin/sessions/${encodeURIComponent(sessionId)}/read`, {
    method: "PATCH",
  });
}
