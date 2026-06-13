import { supabase } from "./supabase";

/**
 * A wrapper around the native fetch API that automatically attaches the
 * Supabase JWT token to the Authorization header if a session exists.
 */
export async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const { data: { session }, error } = await supabase.auth.getSession();

    const headers = new Headers(init?.headers);

    if (session && !error) {
        headers.set("Authorization", `Bearer ${session.access_token}`);
    }

    return fetch(input, {
        ...init,
        headers,
    });
}
