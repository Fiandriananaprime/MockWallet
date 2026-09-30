import type { ButtonHTMLAttributes, ComponentType, HTMLAttributes, ReactNode } from 'react';

export const AlertDialog: ComponentType<{ open?: boolean; onOpenChange?: (open: boolean) => void; children?: ReactNode }>;
export const AlertDialogTrigger: ComponentType<any>;
export const AlertDialogPortal: ComponentType<any>;
export const AlertDialogOverlay: ComponentType<any>;
export const AlertDialogContent: ComponentType<HTMLAttributes<HTMLDivElement>>;
export const AlertDialogHeader: ComponentType<HTMLAttributes<HTMLDivElement>>;
export const AlertDialogFooter: ComponentType<HTMLAttributes<HTMLDivElement>>;
export const AlertDialogTitle: ComponentType<HTMLAttributes<HTMLHeadingElement>>;
export const AlertDialogDescription: ComponentType<HTMLAttributes<HTMLParagraphElement>>;
export const AlertDialogAction: ComponentType<ButtonHTMLAttributes<HTMLButtonElement>>;
export const AlertDialogCancel: ComponentType<ButtonHTMLAttributes<HTMLButtonElement>>;
