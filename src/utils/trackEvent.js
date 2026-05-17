import { supabase } from "../lib/supabaseClient";

export async function trackEvent(user, eventType, eventValue = null, metadata = null) {
  if (!user) return;

  const { error } = await supabase.from("usage_events").insert([
    {
      user_id: user.id,
      user_email: user.email,
      event_type: eventType,
      event_value: eventValue,
      metadata,
    },
  ]);

  if (error) {
    console.error("Erreur tracking:", error);
  }
}
