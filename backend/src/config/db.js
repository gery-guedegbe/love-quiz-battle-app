const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables Supabase manquantes dans .env");
  console.error("   Assurez-vous d'avoir SUPABASE_URL et SUPABASE_ANON_KEY");
  process.exit(1);
}

console.log("🔗 Connexion Supabase...");

try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log("✅ Supabase connecté");
  module.exports = { supabase };
} catch (error) {
  console.error("❌ Impossible de se connecter à Supabase:", error.message);
  process.exit(1);
}
