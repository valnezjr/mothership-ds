"use client";

import React from "react";
import { Badge, type Tone } from "./primitives";

/* ============================================================
   Tabela — preparada para o esquema CRUD (v1.2): primeira coluna
   sempre uma badge de status, última sempre os ícones de ação
   (editar/excluir). Colunas marcadas `sortable` ganham alternância
   de ordenação no cabeçalho. Usa estado (ordenação), por isso
   "use client".
   ============================================================ */

function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

const EditIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const DeleteIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z" />
  </svg>
);

function SortIcon({ direction }: { direction?: "asc" | "desc" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ opacity: direction ? 1 : 0.45 }}
    >
      {direction === "asc" && <path d="M6 15l6-6 6 6" />}
      {direction === "desc" && <path d="M6 9l6 6 6-6" />}
      {!direction && <path d="M7 8l5-5 5 5M7 16l5 5 5-5" />}
    </svg>
  );
}

export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  /** Conteúdo da célula, a partir da linha. */
  cell: (row: T) => React.ReactNode;
  /** Liga a alternância de ordenação no cabeçalho. Exige `sortValue`. */
  sortable?: boolean;
  /** Valor comparável para ordenar — obrigatório se `sortable`. */
  sortValue?: (row: T) => string | number;
  align?: "end" | "center";
}

export interface TableStatus {
  label: React.ReactNode;
  tone?: Tone;
}

export interface TableProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  columns: TableColumn<T>[];
  rows: T[];
  /** Chave única de cada linha (id, geralmente). */
  rowKey: (row: T) => React.Key;
  /** Primeira coluna, sempre: badge de status derivada da linha. */
  status: (row: T) => TableStatus;
  /** Ícone de editar na última coluna; omita para não mostrar. */
  onEdit?: (row: T) => void;
  /** Ícone de excluir na última coluna; omita para não mostrar. */
  onDelete?: (row: T) => void;
  /** Ações extras, além de editar/excluir — mesma última coluna. */
  actions?: (row: T) => React.ReactNode;
  statusHeader?: React.ReactNode;
  editLabel?: string;
  deleteLabel?: string;
  /** Conteúdo exibido quando `rows` está vazio. */
  emptyState?: React.ReactNode;
}

/**
 * Tabela pronta para CRUD: a primeira coluna é sempre a badge de
 * `status`, a última é sempre a linha de ícones de ação — nenhuma
 * das duas é configurável por `columns`, pra toda tabela do sistema
 * nascer consistente. Ordenação (`sortable` + `sortValue`) é interna,
 * cíclica: asc → desc → ordem original.
 */
export function Table<T>({
  columns,
  rows,
  rowKey,
  status,
  onEdit,
  onDelete,
  actions,
  statusHeader = "Status",
  editLabel = "Editar",
  deleteLabel = "Excluir",
  emptyState = "Nada por aqui ainda.",
  className,
  ...rest
}: TableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const sortedRows = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const sortValue = col.sortValue;
    return [...rows].sort((a, b) => {
      const av = sortValue(a);
      const bv = sortValue(b);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [rows, sort, columns]);

  const toggleSort = (key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const hasActions = Boolean(onEdit || onDelete || actions);

  return (
    <div className={cx("ms-table-wrap", className)} {...rest}>
      <table className="ms-table">
        <thead>
          <tr>
            <th scope="col" className="ms-table__status-head">
              {statusHeader}
            </th>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  className={cx("ms-table__th", col.align && `ms-table__th--${col.align}`)}
                  aria-sort={col.sortable ? (active ? (sort!.dir === "asc" ? "ascending" : "descending") : "none") : undefined}
                >
                  {col.sortable ? (
                    <button type="button" className="ms-table__sort" onClick={() => toggleSort(col.key)}>
                      <span>{col.header}</span>
                      <SortIcon direction={active ? sort!.dir : undefined} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
            {hasActions && <th scope="col" className="ms-table__actions-head" aria-hidden="true" />}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => {
            const s = status(row);
            return (
              <tr key={rowKey(row)}>
                <td className="ms-table__status">
                  <Badge tone={s.tone}>{s.label}</Badge>
                </td>
                {columns.map((col) => (
                  <td key={col.key} className={cx(col.align && `ms-table__td--${col.align}`)}>
                    {col.cell(row)}
                  </td>
                ))}
                {hasActions && (
                  <td className="ms-table__actions">
                    <div className="ms-table__actions-row">
                      {onEdit && (
                        <button
                          type="button"
                          className="ms-table__action"
                          aria-label={editLabel}
                          onClick={() => onEdit(row)}
                        >
                          {EditIcon}
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          className="ms-table__action ms-table__action--danger"
                          aria-label={deleteLabel}
                          onClick={() => onDelete(row)}
                        >
                          {DeleteIcon}
                        </button>
                      )}
                      {actions?.(row)}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 && <div className="ms-table__empty">{emptyState}</div>}
    </div>
  );
}
