import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StageRow } from "./stage-row";
import { UpdateForm } from "./update-form";

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: unit } = await supabase
    .from("units")
    .select("*, buildings(id, name)")
    .eq("id", id)
    .single();

  if (!unit) notFound();

  const [{ data: stages }, { data: updates }] = await Promise.all([
    supabase
      .from("unit_stages")
      .select("*, stage_templates(*), subcontractors(name, company)")
      .eq("unit_id", id)
      .order("stage_templates(sort_order)"),
    supabase
      .from("daily_updates")
      .select("*, unit_stages(stage_templates(name))")
      .eq("unit_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const building = unit.buildings as { id: string; name: string };
  const stagesCompleted = stages?.filter((s) => s.status === "completed").length ?? 0;
  const totalStages = stages?.length ?? 0;
  const stagesPct = totalStages > 0 ? Math.round((stagesCompleted / totalStages) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/buildings/${building.id}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {building.name}
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">
            {building.name} — Unit {unit.unit_number}
          </h1>
          <StatusBadge status={unit.status} />
        </div>
        <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
          {unit.floor && <span>Floor {unit.floor}</span>}
          <span>
            {unit.bedrooms}bd / {unit.bathrooms}ba
            {unit.sqft && ` / ${unit.sqft} sqft`}
          </span>
          {unit.target_date && <span>Target: {formatDate(unit.target_date)}</span>}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={stagesPct} className="max-w-xs" />
          <span className="text-sm text-gray-500">
            {stagesCompleted}/{totalStages} stages ({stagesPct}%)
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Renovation Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead>Trade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Update</TableHead>
                <TableHead>Subcontractor</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stages?.map((stage) => (
                <StageRow key={stage.id} stage={stage} unitId={id} />
              ))}
            </TableBody>
          </Table>
          {(!stages || stages.length === 0) && (
            <p className="py-4 text-sm text-gray-500">No stages configured.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <UpdateForm
            unitId={id}
            stages={(stages ?? []).map((s) => ({
              id: s.id,
              stage_templates: s.stage_templates,
            }))}
          />

          <div className="space-y-4">
            {updates?.map((update) => {
              const stageInfo = update.unit_stages as {
                stage_templates: { name: string };
              } | null;
              return (
                <div key={update.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {formatDateTime(update.created_at)}
                    </span>
                    {stageInfo && (
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {stageInfo.stage_templates.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{update.notes}</p>
                </div>
              );
            })}
            {(!updates || updates.length === 0) && (
              <p className="text-sm text-gray-500">No updates yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
