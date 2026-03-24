import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { WorkQueueTabs } from "./tabs";

export default async function WorkQueuePage() {
  const supabase = await createClient();

  const { data: openStages } = await supabase
    .from("unit_stages")
    .select(
      "*, stage_templates(*), subcontractors(name, company), units(id, unit_number, buildings(name))"
    )
    .in("status", ["not_started", "in_progress", "blocked"])
    .order("stage_templates(sort_order)");

  const byTrade: Record<string, typeof openStages> = {};
  const bySub: Record<string, typeof openStages> = {};

  openStages?.forEach((stage) => {
    const trade = stage.stage_templates?.trade ?? "Unknown";
    if (!byTrade[trade]) byTrade[trade] = [];
    byTrade[trade]!.push(stage);

    const subName = stage.subcontractors?.name ?? "Unassigned";
    if (!bySub[subName]) bySub[subName] = [];
    bySub[subName]!.push(stage);
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Work Queue</h1>
        <p className="text-gray-500">
          {openStages?.length ?? 0} open stages across all units
        </p>
      </div>

      <WorkQueueTabs
        byTrade={
          <div className="space-y-6">
            {Object.entries(byTrade).map(([trade, stages]) => (
              <Card key={trade}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {trade}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      ({stages?.length} open)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6 sm:pt-0">
                  <StageTable stages={stages ?? []} />
                  <StageCards stages={stages ?? []} />
                </CardContent>
              </Card>
            ))}
            {Object.keys(byTrade).length === 0 && (
              <p className="text-sm text-gray-500">No open stages.</p>
            )}
          </div>
        }
        bySub={
          <div className="space-y-6">
            {Object.entries(bySub).map(([sub, stages]) => (
              <Card key={sub}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {sub}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      ({stages?.length} open)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6 sm:pt-0">
                  <StageTable stages={stages ?? []} />
                  <StageCards stages={stages ?? []} />
                </CardContent>
              </Card>
            ))}
            {Object.keys(bySub).length === 0 && (
              <p className="text-sm text-gray-500">No open stages.</p>
            )}
          </div>
        }
      />
    </div>
  );
}

function StageTable({ stages }: { stages: Array<Record<string, unknown>> }) {
  return (
    <div className="hidden sm:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stage</TableHead>
            <TableHead>Building</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subcontractor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stages.map((stage) => {
            const template = stage.stage_templates as { name: string; sort_order: number };
            const unit = stage.units as { id: string; unit_number: string; buildings: { name: string } };
            const sub = stage.subcontractors as { name: string; company: string | null } | null;
            return (
              <TableRow key={stage.id as string}>
                <TableCell className="font-medium">
                  {template.sort_order}. {template.name}
                </TableCell>
                <TableCell>{unit.buildings.name}</TableCell>
                <TableCell>
                  <Link
                    href={`/units/${unit.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Unit {unit.unit_number}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={stage.status as string} />
                </TableCell>
                <TableCell>{sub ? sub.name : "Unassigned"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function StageCards({ stages }: { stages: Array<Record<string, unknown>> }) {
  return (
    <div className="divide-y sm:hidden">
      {stages.map((stage) => {
        const template = stage.stage_templates as { name: string; sort_order: number };
        const unit = stage.units as { id: string; unit_number: string; buildings: { name: string } };
        const sub = stage.subcontractors as { name: string; company: string | null } | null;
        return (
          <div key={stage.id as string} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm">
                  {template.sort_order}. {template.name}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {unit.buildings.name}
                </p>
              </div>
              <StatusBadge status={stage.status as string} />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <Link
                href={`/units/${unit.id}`}
                className="text-blue-600 hover:underline"
              >
                Unit {unit.unit_number}
              </Link>
              <span className="text-gray-500">
                {sub ? sub.name : "Unassigned"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
