"use client";

import { StatusBadge } from "@/components/status-badge";
import { Select } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { updateStageStatus } from "./actions";
import { formatDate } from "@/lib/utils";

interface StageRowProps {
  stage: {
    id: string;
    status: string;
    notes: string | null;
    started_at: string | null;
    completed_at: string | null;
    stage_templates: { name: string; trade: string; sort_order: number };
    subcontractors: { name: string; company: string | null } | null;
  };
  unitId: string;
}

export function StageRow({ stage, unitId }: StageRowProps) {
  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const formData = new FormData();
    formData.set("stage_id", stage.id);
    formData.set("status", e.target.value);
    formData.set("unit_id", unitId);
    await updateStageStatus(formData);
  }

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap font-medium">
        {stage.stage_templates.sort_order}. {stage.stage_templates.name}
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {stage.stage_templates.trade}
        </span>
      </TableCell>
      <TableCell>
        <StatusBadge status={stage.status} />
      </TableCell>
      <TableCell>
        <Select
          value={stage.status}
          onChange={handleStatusChange}
          className="h-8 w-32 text-xs"
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="blocked">Blocked</option>
          <option value="completed">Completed</option>
        </Select>
      </TableCell>
      <TableCell>
        {stage.subcontractors
          ? `${stage.subcontractors.name}${stage.subcontractors.company ? ` (${stage.subcontractors.company})` : ""}`
          : "—"}
      </TableCell>
      <TableCell className="text-xs text-gray-500">
        {stage.notes || "—"}
      </TableCell>
      <TableCell className="whitespace-nowrap text-xs text-gray-500">
        {formatDate(stage.started_at)}
      </TableCell>
      <TableCell className="whitespace-nowrap text-xs text-gray-500">
        {formatDate(stage.completed_at)}
      </TableCell>
    </TableRow>
  );
}
