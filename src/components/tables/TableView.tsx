"use client";

import { useStore } from "@/store/useStore";
import { Plus, Trash2 } from "lucide-react";

export default function TableView() {
  const {
    activePageId,
    pages,
    addTableColumn,
    addTableRow,
    updateTableCell,
    removeTableRow,
    removeTableColumn,
  } = useStore();
  const activePage = pages.find((p) => p.id === activePageId);

  if (!activePage?.tableData) return null;

  const { columns, rows } = activePage.tableData;

  const renderCell = (
    rowId: string,
    columnId: string,
    columnType: string,
    value: string | number | boolean | undefined,
    options?: string[]
  ) => {
    switch (columnType) {
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) =>
              activePageId &&
              updateTableCell(activePageId, rowId, columnId, e.target.checked)
            }
            className="accent-accent"
          />
        );
      case "select":
        return (
          <select
            value={(value as string) || ""}
            onChange={(e) =>
              activePageId &&
              updateTableCell(activePageId, rowId, columnId, e.target.value)
            }
            className="bg-transparent outline-none text-sm w-full text-text-primary"
          >
            <option value="">—</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "number":
        return (
          <input
            type="number"
            value={(value as number) ?? ""}
            onChange={(e) =>
              activePageId &&
              updateTableCell(
                activePageId,
                rowId,
                columnId,
                e.target.value ? Number(e.target.value) : ""
              )
            }
            className="bg-transparent outline-none text-sm w-full text-text-primary"
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={(value as string) || ""}
            onChange={(e) =>
              activePageId &&
              updateTableCell(activePageId, rowId, columnId, e.target.value)
            }
            className="bg-transparent outline-none text-sm w-full text-text-primary"
          />
        );
      default:
        return (
          <input
            type="text"
            value={(value as string) || ""}
            onChange={(e) =>
              activePageId &&
              updateTableCell(activePageId, rowId, columnId, e.target.value)
            }
            placeholder="Type here..."
            className="bg-transparent outline-none text-sm w-full text-text-primary placeholder:text-text-muted"
          />
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                className="text-left px-3 py-2 border border-border bg-surface text-sm font-medium text-text-secondary group"
              >
                <div className="flex items-center justify-between">
                  <span>{col.name}</span>
                  <button
                    onClick={() =>
                      activePageId && removeTableColumn(activePageId, col.id)
                    }
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-error transition-opacity"
                    title="Remove column"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </th>
            ))}
            <th className="border border-border bg-surface w-10">
              <button
                onClick={() =>
                  activePageId &&
                  addTableColumn(activePageId, { name: "Column", type: "text" })
                }
                className="p-1 text-text-muted hover:text-text-primary w-full flex justify-center"
                title="Add column"
              >
                <Plus size={14} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="group">
              {columns.map((col) => (
                <td key={col.id} className="px-3 py-2 border border-border">
                  {renderCell(row.id, col.id, col.type, row.cells[col.id], col.options)}
                </td>
              ))}
              <td className="border border-border w-10">
                <button
                  onClick={() =>
                    activePageId && removeTableRow(activePageId, row.id)
                  }
                  className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-error w-full flex justify-center transition-opacity"
                  title="Remove row"
                >
                  <Trash2 size={12} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => activePageId && addTableRow(activePageId)}
        className="flex items-center gap-1 px-3 py-2 text-sm text-text-muted hover:text-text-secondary hover:bg-surface-hover w-full border border-border border-t-0 transition-colors"
      >
        <Plus size={14} />
        New row
      </button>
    </div>
  );
}
