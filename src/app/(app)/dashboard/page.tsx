import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatDateTime } from "@/lib/utils";
import { Building2, Hammer, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { DashboardChart } from "./chart";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: buildingCount },
    { data: units },
    { data: recentUpdates },
  ] = await Promise.all([
    supabase.from("buildings").select("*", { count: "exact", head: true }),
    supabase.from("units").select("id, status"),
    supabase
      .from("daily_updates")
      .select("*, units(unit_number, buildings(name))")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const inProgress = units?.filter((u) => u.status === "in_progress").length ?? 0;
  const blocked = units?.filter((u) => u.status === "blocked").length ?? 0;
  const completed = units?.filter((u) => u.status === "completed").length ?? 0;
  const notStarted = units?.filter((u) => u.status === "not_started").length ?? 0;
  const totalUnits = units?.length ?? 0;

  const chartData = [
    { name: "Not Started", value: notStarted, fill: "#e5e7eb" },
    { name: "In Progress", value: inProgress, fill: "#93c5fd" },
    { name: "Blocked", value: blocked, fill: "#fca5a5" },
    { name: "Completed", value: completed, fill: "#86efac" },
  ];

  const stats = [
    {
      title: "Buildings",
      value: buildingCount ?? 0,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Hammer,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Blocked",
      value: blocked,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Overview of renovation progress</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Unit Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {totalUnits > 0 ? (
              <DashboardChart data={chartData} />
            ) : (
              <p className="text-sm text-gray-500">No units yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUpdates && recentUpdates.length > 0 ? (
                recentUpdates.map((update) => {
                  const u = update as Record<string, unknown>;
                  const unitData = u.units as Record<string, unknown> | null;
                  const buildingData = unitData?.buildings as Record<string, unknown> | null;
                  return (
                    <div key={update.id} className="border-b pb-3 last:border-0">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                          href={`/units/${update.unit_id}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {buildingData?.name as string} — Unit{" "}
                          {unitData?.unit_number as string}
                        </Link>
                        <span className="text-xs text-gray-400">
                          {formatDateTime(update.created_at)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {update.notes}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No updates yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
