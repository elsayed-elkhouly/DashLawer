import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
   const pages = useMemo(() => {
    const result = [];
    const delta = 1;
    const range = [];

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 2) {
      result.push(1, "...");
    } else if (range[0] === 2) {
      result.push(1);
    }

    result.push(...range);

    if (range[range.length - 1] < totalPages - 1) {
      result.push("...", totalPages);
    } else if (range[range.length - 1] === totalPages - 1) {
      result.push(totalPages);
    }

    return result;
  }, [currentPage, totalPages]);


  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/5 px-5 py-4 text-sm text-slate-400">
      <p>عرض 1-10 من أصل 1,284 عميل</p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className="px-1 text-slate-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition ${
                currentPage === page
                  ? "bg-amber-400 text-slate-950"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

}

export default Pagination