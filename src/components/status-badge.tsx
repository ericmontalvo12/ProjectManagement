import { Badge } from "@/components/ui/badge";
import { statusColors, statusLabels } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={statusColors[status] || "bg-gray-100 text-gray-700"}>
      {statusLabels[status] || status}
    </Badge>
  );
}
