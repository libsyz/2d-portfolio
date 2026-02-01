import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey)

// Tiny, secure "one ID per browser" helper
export function getOrCreateUuid(key = "player_uuid") {
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  }
  
  const IS_PROD = import.meta.env.VITE_IS_PROD; // Vite boolean

  export async function trackGameStage(game_stage) {
    if (!IS_PROD) return; // no-op in dev
  
    const { error } = await supabase
      .from("game_sessions")
      .insert({ user_uuid: getOrCreateUuid(), game_stage });
  
  }