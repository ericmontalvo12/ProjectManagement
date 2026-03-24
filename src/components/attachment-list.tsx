"use client";

import { Paperclip, FileText, Download } from "lucide-react";
import { useState } from "react";

interface AttachmentItem {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string | null;
}

export function AttachmentList({ attachments }: { attachments: AttachmentItem[] }) {
  if (attachments.length === 0) return null;

  const images = attachments.filter((a) => a.file_type?.startsWith("image/"));
  const docs = attachments.filter((a) => !a.file_type?.startsWith("image/"));

  return (
    <div className="mt-2 space-y-2">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img) => (
            <ImageThumb key={img.id} attachment={img} />
          ))}
        </div>
      )}
      {docs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {docs.map((doc) => (
            <a
              key={doc.id}
              href={doc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded border bg-gray-50 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="max-w-[140px] truncate">{doc.file_name}</span>
              <Download className="h-3 w-3 text-gray-400" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageThumb({ attachment }: { attachment: AttachmentItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="overflow-hidden rounded border"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={attachment.file_url}
          alt={attachment.file_name}
          className="h-16 w-16 object-cover transition-transform hover:scale-105"
        />
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-8"
          onClick={() => setExpanded(false)}
        >
          <div className="relative max-h-[80vh] max-w-[80vw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={attachment.file_url}
              alt={attachment.file_name}
              className="max-h-[80vh] max-w-[80vw] rounded-lg object-contain"
            />
            <a
              href={attachment.file_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 text-gray-700 hover:bg-white"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
