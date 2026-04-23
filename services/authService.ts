import { supabase } from "../lib/Supabase";

interface SignupCredentials {
  email: string;
  password: string;
}

interface PublicProfile {
  username: string;
  email: string;
  phone_number: string;
}

type SignUpInput = SignupCredentials &
  Pick<PublicProfile, "username" | "phone_number">;

export async function submitProfile(signup: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email: signup.email,
    password: signup.password,
    options: {
      data: {
        username: signup.username,
        phone_number: signup.phone_number,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function createProfile(profile: PublicProfile, userId: string) {
  const { data, error } = await supabase
    .from("eat_easy_profile")
    .upsert(
      {
        user_id: userId,
        username: profile.username,
        email: profile.email,
        phone_number: profile.phone_number,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export { createProfile as creatProfile };
