"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { addDailyUpdate } from "./actions";

interface Stage {
  id: string;
  stage_templates: { name: string };
}

export function UpdateForm({
  unitId,
  stages,
}: {
  unitId: string;
  stages: Stage[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await addDailyUpdate(formData);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <input type="hidden" name="unit_id" value={unitId} />
      <Textarea name="notes" placeholder="Add a daily update note..." required />
      <div className="flex items-center gap-3">
        <Select name="unit_stage_id" className="max-w-xs">
          <option value="">Link to stage (optional)</option>
          {stages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.stage_templates.name}
            </option>
          ))}
        </Select>
        <Button type="submit">Add Update</Button>
      </div>
    </form>
  );
}
