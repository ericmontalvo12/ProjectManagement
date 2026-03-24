import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, MapPin } from "lucide-react";
import Link from "next/link";

export default async function BuildingsPage() {
  const supabase = await createClient();

  const { data: buildings } = await supabase
    .from("buildings")
    .select("*, units(id, status)")
    .order("name");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Buildings</h1>
        <p className="text-gray-500">All properties under renovation</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {buildings?.map((building) => {
          const units = (building.units ?? []) as Array<{ id: string; status: string }>;
          const total = units.length;
          const completed = units.filter((u) => u.status === "completed").length;
          const inProgress = units.filter((u) => u.status === "in_progress").length;
          const blocked = units.filter((u) => u.status === "blocked").length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <Link key={building.id} href={`/buildings/${building.id}`}>
              <Card className="transition-shadow hover:shadow-md h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <CardTitle className="text-base">{building.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {building.address}, {building.city}, {building.state} {building.zip}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{total} units</span>
                      <span className="font-medium">{pct}% complete</span>
                    </div>
                    <Progress value={pct} />
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>{inProgress} in progress</span>
                      <span>{blocked} blocked</span>
                      <span>{completed} done</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
