import { createClient } from "@supabase/supabase-js";
import type { User } from "@shared/schema";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthResult {
  user?: User;
  error?: string;
}

export async function supabaseSignUp(
  email: string,
  password: string,
  displayName: string,
  role: "traveler" | "guide" = "traveler"
): Promise<AuthResult> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (authError) {
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Failed to create account" };
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email: email,
        role: role,
        display_name: displayName,
        avatar_url: null,
        verified: false,
        status: "active",
      })
      .select()
      .single();

    if (userError) {
      console.error("Error creating user profile:", userError);
      return { error: "Account created but profile setup failed" };
    }

    if (role === "traveler") {
      const { error: travelerError } = await supabase
        .from("traveler_profiles")
        .insert({
          uid: authData.user.id,
          display_name: displayName,
          avatar_url: null,
        });

      if (travelerError) {
        console.error("Error creating traveler profile:", travelerError);
      }
    }

    return {
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role as "traveler" | "guide" | "admin",
        displayName: userData.display_name,
        avatarUrl: userData.avatar_url,
        status: userData.status || "active",
        verified: userData.verified || false,
        bannedUntil: userData.banned_until || null,
        createdAt: userData.created_at,
      },
    };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

export async function supabaseSignIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Failed to sign in" };
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (userError) {
      console.error("Error fetching user profile:", userError);
      return { error: "Failed to load user profile" };
    }

    return {
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role as "traveler" | "guide" | "admin",
        displayName: userData.display_name,
        avatarUrl: userData.avatar_url,
        status: userData.status || "active",
        verified: userData.verified || false,
        bannedUntil: userData.banned_until || null,
        createdAt: userData.created_at,
      },
    };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

export async function supabaseSignOut(): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return {};
  } catch (error: any) {
    console.error("Sign out error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }
    return session;
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

export async function resetPassword(email: string): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error: any) {
    console.error("Password reset error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

export async function signInWithGoogle(): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error: any) {
    console.error("Google sign in error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

export async function signInWithApple(): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error: any) {
    console.error("Apple sign in error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}
