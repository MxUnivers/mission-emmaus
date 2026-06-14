import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getSupabaseService() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseService();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const currentUserId = userData.user.id;

    // Check if current user is admin
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUserId)
      .single();

    if (!currentProfile || currentProfile.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const path = url.pathname;

    // GET /admin-users - list all profiles
    if (req.method === "GET" && path.endsWith("/admin-users")) {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, role, created_at, updated_at")
        .order("created_at", { ascending: false });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get user emails from auth.users via service role
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) {
        return new Response(JSON.stringify({ error: usersError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const emailMap = new Map();
      (users.users || []).forEach((u) => {
        emailMap.set(u.id, u.email);
      });

      const enriched = (profiles || []).map((p) => ({
        ...p,
        email: emailMap.get(p.id) || "Inconnu",
      }));

      return new Response(JSON.stringify({ users: enriched }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /admin-users/setup - make current user admin
    if (req.method === "POST" && path.endsWith("/admin-users/setup")) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", currentUserId)
        .single();

      if (existing) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: "admin", updated_at: new Date().toISOString() })
          .eq("id", currentUserId);

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } else {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({ id: currentUserId, role: "admin" });

        if (insertError) {
          return new Response(JSON.stringify({ error: insertError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      return new Response(JSON.stringify({ success: true, message: "You are now admin" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /admin-users/promote - promote a user to admin
    if (req.method === "POST" && path.endsWith("/admin-users/promote")) {
      const body = await req.json();
      const { userId } = body;
      if (!userId) {
        return new Response(JSON.stringify({ error: "Missing userId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: target } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (target) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: "admin", updated_at: new Date().toISOString() })
          .eq("id", userId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({ id: userId, role: "admin" });
        if (insertError) throw insertError;
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /admin-users/demote - demote a user to user
    if (req.method === "POST" && path.endsWith("/admin-users/demote")) {
      const body = await req.json();
      const { userId } = body;
      if (!userId) {
        return new Response(JSON.stringify({ error: "Missing userId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Prevent self-demotion if last admin
      const { data: admins } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin");
      if (admins && admins.length <= 1 && userId === currentUserId) {
        return new Response(JSON.stringify({ error: "Cannot remove the last admin" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: "user", updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE /admin-users/:id - delete user account
    if (req.method === "DELETE" && path.includes("/admin-users/")) {
      const userId = path.split("/admin-users/").pop();
      if (!userId) {
        return new Response(JSON.stringify({ error: "Missing userId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Prevent self-deletion
      if (userId === currentUserId) {
        return new Response(JSON.stringify({ error: "Cannot delete yourself" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
      if (deleteError) {
        return new Response(JSON.stringify({ error: deleteError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
