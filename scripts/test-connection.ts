import { config } from "dotenv";
config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("🧪 Testing Supabase & Resend Integration\n");

  console.log("📍 Configuration:");
  console.log("   Supabase URL:", supabaseUrl);
  console.log("   Resend API Key:", process.env.RESEND_API_KEY ? "✅ Set" : "❌ Not set");
  console.log("   Email From:", process.env.EMAIL_FROM || "Not set");

  console.log("\n📊 Testing database queries...\n");

  const { data: guides, error: guidesError } = await supabase
    .from("guide_profiles")
    .select("displayName, city, handle")
    .limit(5);

  if (guidesError) {
    console.error("❌ Error fetching guides:", guidesError);
    return false;
  }

  console.log("✅ Guides fetched successfully:");
  guides?.forEach(g => {
    console.log(`   - ${g.displayName} in ${g.city} (@${g.handle})`);
  });

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("email, role, displayName")
    .limit(5);

  if (usersError) {
    console.error("\n❌ Error fetching users:", usersError);
    return false;
  }

  console.log("\n✅ Users fetched successfully:");
  users?.forEach(u => {
    console.log(`   - ${u.email} (${u.role})`);
  });

  console.log("\n✅ All connection tests passed!");
  console.log("\n📝 Summary:");
  console.log(`   - ${users?.length || 0} users in database`);
  console.log(`   - ${guides?.length || 0} guide profiles`);
  console.log("   - Supabase connection: ✅ Working");
  console.log("   - Resend configured: " + (process.env.RESEND_API_KEY ? "✅ Yes" : "⚠️  No"));

  return true;
}

test().then((success) => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error("\n❌ Test failed:", err);
  process.exit(1);
});
