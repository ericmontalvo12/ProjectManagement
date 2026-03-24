"use client";

import { StatusBadge } from "@/components/status-badge";
import { Select } from "@/components/ui/select";
import { updateStageStatus } from "./actions";
import { formatDate } from "@/lib/utils";

interface StageCardProps {
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

export function StageCard({ stage, unitId }: StageCardProps) {
  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const formData = new FormData();
    formData.set("stage_id", stage.id);
    formData.set("status", e.target.value);
    formData.set("unit_id", unitId);
    await updateStageStatus(formData);
  }

  return (
    <div className="border-b px-4 py-3 last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {stage.stage_templates.sort_order}. {stage.stage_templates.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {stage.stage_templates.trade}
            </span>
            <StatusBadge status={stage.status} />
          </div>
        </div>
      </div>

      <div className="mt-2">
        <Select
          value={stage.status}
          onChange={handleStatusChange}
          className="h-8 w-full text-xs"
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="blocked">Blocked</option>
          <option value="completed">Completed</option>
        </Select>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
        <div>
          <span className="text-gray-400">Sub: </span>
          {stage.subcontractors ? stage.subcontractors.name : "—"}
        </div>
        <div>
          <span className="text-gray-400">Started: </span>
          {formatDate(stage.started_at)}
        </div>
        {stage.notes && (
          <div className="col-span-2">
            <span className="text-gray-400">Notes: </span>
            {stage.notes}
          </div>
        )}
        {stage.completed_at && (
          <div>
            <span className="text-gray-400">Done: </span>
            {formatDate(stage.completed_at)}
          </div>
        )}
      </div>
    </div>
  );
}
