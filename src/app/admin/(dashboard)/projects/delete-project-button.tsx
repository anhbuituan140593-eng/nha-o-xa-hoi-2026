"use client";

import { Trash2 } from "lucide-react";
import { deleteProject } from "./actions";

export default function DeleteProjectButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProject.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Bạn có chắc muốn xóa dự án này? Hành động không thể hoàn tác.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
        title="Xóa dự án"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
