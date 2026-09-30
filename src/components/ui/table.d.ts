import type { ComponentType, HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export const Table: ComponentType<TableHTMLAttributes<HTMLTableElement>>;
export const TableHeader: ComponentType<HTMLAttributes<HTMLTableSectionElement>>;
export const TableBody: ComponentType<HTMLAttributes<HTMLTableSectionElement>>;
export const TableFooter: ComponentType<HTMLAttributes<HTMLTableSectionElement>>;
export const TableRow: ComponentType<HTMLAttributes<HTMLTableRowElement>>;
export const TableHead: ComponentType<ThHTMLAttributes<HTMLTableCellElement>>;
export const TableCell: ComponentType<TdHTMLAttributes<HTMLTableCellElement>>;
export const TableCaption: ComponentType<HTMLAttributes<HTMLTableCaptionElement>>;
