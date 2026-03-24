import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BuildingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: building } = await supabase
    .from("buildings")
    .select("*")
    .eq("id", id)
    .single();

  if (!building) notFound();

  const { data: units } = await supabase
    .from("units")
    .select("*, unit_stages(status)")
    .eq("building_id", id)
    .order("unit_number");

  const totalUnits = units?.length ?? 0;
  const completed = units?.filter((u) => u.status === "completed").length ?? 0;
  const inProgress = units?.filter((u) => u.status === "in_progress").length ?? 0;
  const blocked = units?.filter((u) => u.status === "blocked").length ?? 0;
  const notStarted = units?.filter((u) => u.status === "not_started").length ?? 0;
  const pct = totalUnits > 0 ? Math.round((completed / totalUnits) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/buildings"
          className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Buildings
        </Link>
        <h1 className="text-2xl font-bold">{building.name}</h1>
        <div className="flex items-center gap-1 text-gray-500">
          <MapPin className="h-4 w-4" />
          {building.address}, {building.city}, {building.state} {building.zip}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalUnits}</p>
            <p className="text-sm text-gray-500">Total Units</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{inProgress}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{blocked}</p>
            <p className="text-sm text-gray-500">Blocked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Units</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{pct}% complete</span>
              <Progress value={pct} className="w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {units?.map((unit) => {
              const stages = (unit.unit_stages ?? []) as Array<{ status: string }>;
              const stagesCompleted = stages.filter((s) => s.status === "completed").length;
              const stagesPct =
                stages.length > 0 ? Math.round((stagesCompleted / stages.length) * 100) : 0;

              return (
                <Link
                  key={unit.id}
                  href={`/units/${unit.id}`}
                  className="flex flex-col gap-2 py-3 hover:bg-gray-50 px-2 -mx-2 rounded transition-colors sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="font-medium">Unit {unit.unit_number}</span>
                      {unit.floor && (
                        <span className="ml-2 text-sm text-gray-500">
                          Floor {unit.floor}
                        </span>
                      )}
                    </div>
                    <StatusBadge status={unit.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span>
                      {unit.bedrooms}bd / {unit.bathrooms}ba
                      {unit.sqft && ` / ${unit.sqft} sqft`}
                    </span>
                    <span>{stagesCompleted}/{stages.length} stages</span>
                    <Progress value={stagesPct} className="w-20" />
                    {unit.target_date && (
                      <span className="text-xs">Target: {formatDate(unit.target_date)}</span>
                    )}
                  </div>
                </Link>
              );
            })}
            {(!units || units.length === 0) && (
              <p className="py-4 text-sm text-gray-500">No units in this building.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
