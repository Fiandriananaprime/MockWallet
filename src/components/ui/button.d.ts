import type { ButtonHTMLAttributes, ComponentType } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: string;
  size?: string;
  asChild?: boolean;
};

export const Button: ComponentType<ButtonProps>;
export function buttonVariants(options?: Record<string, unknown>): string;
