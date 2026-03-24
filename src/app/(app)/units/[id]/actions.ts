"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addDailyUpdate(formData: FormData) {
  const supabase = await createClient();

  const unitId = formData.get("unit_id") as string;
  const notes = formData.get("notes") as string;
  const unitStageId = formData.get("unit_stage_id") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  await supabase.from("daily_updates").insert({
    unit_id: unitId,
    notes,
    unit_stage_id: unitStageId || null,
    author_id: user.id,
  });

  revalidatePath(`/units/${unitId}`);
}

export async function updateStageStatus(formData: FormData) {
  const supabase = await createClient();

  const stageId = formData.get("stage_id") as string;
  const status = formData.get("status") as string;
  const unitId = formData.get("unit_id") as string;

  const updateData: Record<string, unknown> = { status };

  if (status === "in_progress" && !formData.get("started_at")) {
    updateData.started_at = new Date().toISOString();
  }
  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }

  await supabase.from("unit_stages").update(updateData).eq("id", stageId);

  // Auto-update unit status based on stages
  const { data: stages } = await supabase
    .from("unit_stages")
    .select("status")
    .eq("unit_id", unitId);

  if (stages) {
    const allCompleted = stages.every((s) => s.status === "completed");
    const anyBlocked = stages.some((s) => s.status === "blocked");
    const anyInProgress = stages.some(
      (s) => s.status === "in_progress" || s.status === "completed"
    );

    let unitStatus = "not_started";
    if (allCompleted) unitStatus = "completed";
    else if (anyBlocked) unitStatus = "blocked";
    else if (anyInProgress) unitStatus = "in_progress";

    await supabase.from("units").update({ status: unitStatus }).eq("id", unitId);
  }

  revalidatePath(`/units/${unitId}`);
}
