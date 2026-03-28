interface Column {
  header: string;
  key: string;
  color?: "default" | "red" | "green" | "cyan" | "amber";
}

interface DataTableProps {
  columns: Column[];
  rows: Record<string, React.ReactNode>[];
  className?: string;
}

const headerColorMap = {
  default: "text-slate-400",
  red: "text-red-400",
  green: "text-green-400",
  cyan: "text-cyan-400",
  amber: "text-amber-400",
};

const cellColorMap = {
  default: "text-slate-200",
  red: "text-red-300",
  green: "text-green-300",
  cyan: "text-cyan-300",
  amber: "text-amber-300",
};

export function DataTable({ columns, rows, className = "" }: DataTableProps) {
  return (
    <table className={`w-full border-separate border-spacing-y-2 ${className}`}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${headerColorMap[col.color ?? "default"]}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td
                key={col.key}
                className={`px-4 py-3 text-sm ${cellColorMap[col.color ?? "default"]} bg-white/[0.03] first:rounded-l-lg last:rounded-r-lg`}
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}