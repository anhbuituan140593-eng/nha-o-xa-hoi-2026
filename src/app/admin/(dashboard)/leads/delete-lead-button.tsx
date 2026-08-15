"use client";

import { Trash2 } from "lucide-react";
import { deleteLead } from "./actions";

export default function DeleteLeadButton({ id }: { id: string }) {
  return (
    <form
      action={deleteLead.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
        title="Xóa khách hàng"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
