import { supabase } from "../lib/Supabase";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

/**
 * Sign in with Google OAuth using expo-web-browser.
 * Returns the session tokens on success.
 */
export async function signInWithGoogle() {
  const redirectUrl = Linking.createURL("/auth/callback");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error("No authentication URL returned");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

  if (result.type === "success" && result.url) {
    const extract = (url: string, key: string) => {
      const regex = new RegExp(`${key}=([^&]*)`);
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const access_token = extract(result.url, "access_token");
    const refresh_token = extract(result.url, "refresh_token");

    if (access_token && refresh_token) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (sessionError) throw sessionError;
      return { access_token, refresh_token };
    }

    throw new Error("Tokens missing from OAuth response URL.");
  }

  throw new Error("Authentication was cancelled.");
}
