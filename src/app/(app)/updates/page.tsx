import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

export default async function UpdatesPage() {
  const supabase = await createClient();

  const { data: updates } = await supabase
    .from("daily_updates")
    .select(
      "*, units(id, unit_number, buildings(name)), unit_stages(stage_templates(name))"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Daily Updates</h1>
        <p className="text-gray-500">All renovation updates across buildings</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {updates?.map((update) => {
              const unit = update.units as {
                id: string;
                unit_number: string;
                buildings: { name: string };
              } | null;
              const stageInfo = update.unit_stages as {
                stage_templates: { name: string };
              } | null;

              return (
                <div key={update.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {unit && (
                        <Link
                          href={`/units/${unit.id}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {unit.buildings.name} — Unit {unit.unit_number}
                        </Link>
                      )}
                      {stageInfo && (
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {stageInfo.stage_templates.name}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(update.created_at)}
                    </span>
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
