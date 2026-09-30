import type { ComponentType, HTMLAttributes, ReactNode } from 'react';

export const Sheet: ComponentType<{ open?: boolean; onOpenChange?: (open: boolean) => void; children?: ReactNode }>;
export const SheetTrigger: ComponentType<any>;
export const SheetContent: ComponentType<HTMLAttributes<HTMLDivElement> & { side?: string }>;
export const SheetClose: ComponentType<any>;
export const SheetHeader: ComponentType<HTMLAttributes<HTMLDivElement>>;
export const SheetFooter: ComponentType<HTMLAttributes<HTMLDivElement>>;
export const SheetTitle: ComponentType<HTMLAttributes<HTMLHeadingElement>>;
export const SheetDescription: ComponentType<HTMLAttributes<HTMLParagraphElement>>;
