// Edge Function: delete_old_profiles
// Automatically deletes questionnaires based on GDPR deletion requests
// Runs monthly via Supabase Scheduled Tasks

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GDPRRequest {
  id: string;
  profile_id: string;
  status: string;
  scheduled_delete_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({
          error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log("Starting GDPR deletion process...");

    // Find all pending GDPR requests that are due for deletion
    const { data: gdprRequests, error: fetchError } = await supabase
      .from("gdpr_requests")
      .select("id, profile_id, status, scheduled_delete_at")
      .eq("status", "pending")
      .lte("scheduled_delete_at", new Date().toISOString());

    if (fetchError) {
      console.error("Error fetching GDPR requests:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch GDPR requests", details: fetchError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!gdprRequests || gdprRequests.length === 0) {
      console.log("No GDPR requests pending deletion");
      return new Response(
        JSON.stringify({
          success: true,
          message: "No pending GDPR requests found",
          processed: 0,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Found ${gdprRequests.length} GDPR requests to process`);

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    // Process each GDPR request
    for (const request of gdprRequests) {
      try {
        const profileId = request.profile_id;
        console.log(`Processing deletion for profile_id: ${profileId}`);

        // Delete all questionnaires for this profile_id (contact_identifier)
        // Only delete questionnaires that are older than 1 week (7 days)
        // Convert submitted_at (Unix timestamp in milliseconds) to date for comparison
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago in milliseconds
        
        const { error: deleteError } = await supabase
          .from("questionnaires")
          .delete()
          .eq("contact_identifier", profileId)
          .lt("submitted_at", oneWeekAgo); // Only delete if submitted_at < one week ago

        if (deleteError) {
          // If questionnaires are already deleted or don't exist, that's okay
          // Check if it's a "not found" type error
          if (deleteError.code === "PGRST116" || deleteError.message?.includes("not found")) {
            console.log(`No questionnaires found for profile_id: ${profileId} (may already be deleted)`);
          } else {
            throw deleteError;
          }
        } else {
          console.log(`Successfully deleted questionnaires older than 1 week for profile_id: ${profileId}`);
        }
        
        // Check if there are any questionnaires left (newer than 1 week)
        const { data: remainingQuestionnaires } = await supabase
          .from("questionnaires")
          .select("id")
          .eq("contact_identifier", profileId)
          .limit(1);
        
        if (remainingQuestionnaires && remainingQuestionnaires.length > 0) {
          console.log(`Note: Some questionnaires for profile_id ${profileId} are newer than 1 week and were not deleted. They will be deleted in the next run if they become older than 1 week.`);
        }

        // Also delete related sessions for this profile
        const { error: sessionDeleteError } = await supabase
          .from("sessions")
          .delete()
          .eq("contact_identifier", profileId);

        if (sessionDeleteError && sessionDeleteError.code !== "PGRST116") {
          console.warn(`Warning: Could not delete sessions for profile_id: ${profileId}`, sessionDeleteError);
        }

        // Also delete related OTP codes for this profile
        const { error: otpDeleteError } = await supabase
          .from("otp_codes")
          .delete()
          .eq("contact_identifier", profileId);

        if (otpDeleteError && otpDeleteError.code !== "PGRST116") {
          console.warn(`Warning: Could not delete OTP codes for profile_id: ${profileId}`, otpDeleteError);
        }

        // Update GDPR request status to 'deleted'
        const { error: updateError } = await supabase
          .from("gdpr_requests")
          .update({ status: "deleted", updated_at: new Date().toISOString() })
          .eq("id", request.id);

        if (updateError) {
          throw new Error(`Failed to update GDPR request status: ${updateError.message}`);
        }

        successCount++;
        console.log(`Successfully processed GDPR request ${request.id}`);
      } catch (error) {
        failCount++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push(`Profile ${request.profile_id}: ${errorMessage}`);

        console.error(`Error processing GDPR request ${request.id}:`, error);

        // Try to mark request as failed
        try {
          await supabase
            .from("gdpr_requests")
            .update({ status: "failed", updated_at: new Date().toISOString() })
            .eq("id", request.id);
        } catch (updateError) {
          console.error(`Failed to update status to 'failed' for request ${request.id}:`, updateError);
        }
      }
    }

    const result = {
      success: true,
      message: `Processed ${gdprRequests.length} GDPR requests`,
      processed: gdprRequests.length,
      successful: successCount,
      failed: failCount,
      ...(errors.length > 0 && { errors }),
    };

    console.log("GDPR deletion process completed:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error in delete_old_profiles function:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
