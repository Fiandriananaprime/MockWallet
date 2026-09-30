import type { ComponentType, HTMLAttributes, ReactNode } from 'react';

export const Dialog: ComponentType<{ open?: boolean; onOpenChange?: (open: boolean) => void; children?: ReactNode }>;
export const DialogPortal: ComponentType<any>;
export const DialogOverlay: ComponentType<any>;
export const DialogTrigger: ComponentType<any>;
export const DialogClose: ComponentType<any>;
export const DialogContent: ComponentType<HTMLAttributes<HTMLDivElement>>;
export const DialogHeader: ComponentType<HTMLAttributes<HTMLDivElement>>;
export const DialogFooter: ComponentType<HTMLAttributes<HTMLDivElement>>;
export const DialogTitle: ComponentType<HTMLAttributes<HTMLHeadingElement>>;
export const DialogDescription: ComponentType<HTMLAttributes<HTMLParagraphElement>>;
