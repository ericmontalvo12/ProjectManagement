"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Paperclip, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { addDailyUpdate, addAttachments } from "./actions";

interface Stage {
  id: string;
  stage_templates: { name: string };
}

const ACCEPTED_TYPES =
  "image/png,image/jpeg,image/webp,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function UpdateForm({
  unitId,
  stages,
}: {
  unitId: string;
  stages: Stage[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const valid = selected.filter((f) => f.size <= MAX_FILE_SIZE);
    setFiles((prev) => [...prev, ...valid]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    try {
      const updateId = await addDailyUpdate(formData);

      if (updateId && files.length > 0) {
        const supabase = createClient();
        const uploaded: { file_url: string; file_name: string; file_type: string }[] = [];

        for (const file of files) {
          const ext = file.name.split(".").pop() ?? "";
          const path = `${unitId}/${updateId}/${Date.now()}-${file.name}`;

          const { data, error } = await supabase.storage
            .from("attachments")
            .upload(path, file, { contentType: file.type });

          if (!error && data) {
            const {
              data: { publicUrl },
            } = supabase.storage.from("attachments").getPublicUrl(data.path);

            uploaded.push({
              file_url: publicUrl,
              file_name: file.name,
              file_type: file.type || ext,
            });
          }
        }

        if (uploaded.length > 0) {
          await addAttachments(updateId, unitId, uploaded);
        }
      }

      formRef.current?.reset();
      setFiles([]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <input type="hidden" name="unit_id" value={unitId} />
      <Textarea name="notes" placeholder="Add a daily update note..." required />

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => {
            const isImage = file.type.startsWith("image/");
            return (
              <div
                key={`${file.name}-${i}`}
                className="group relative flex items-center gap-2 rounded border bg-gray-50 px-2 py-1 text-sm"
              >
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <Paperclip className="h-4 w-4 text-gray-400" />
                )}
                <span className="max-w-[120px] truncate text-gray-600">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="ml-1 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Select name="unit_stage_id" className="max-w-xs">
          <option value="">Link to stage (optional)</option>
          {stages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.stage_templates.name}
            </option>
          ))}
        </Select>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="mr-1 h-4 w-4" />
          Attach
        </Button>

        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Add Update"
          )}
        </Button>
      </div>
    </form>
  );
}
