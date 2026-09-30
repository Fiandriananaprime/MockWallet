import type { ComponentType, ReactNode } from 'react';

export const Select: ComponentType<{ value?: string; onValueChange?: (value: string) => void; children?: ReactNode }>;
export const SelectGroup: ComponentType<any>;
export const SelectValue: ComponentType<any>;
export const SelectTrigger: ComponentType<any>;
export const SelectContent: ComponentType<any>;
export const SelectLabel: ComponentType<any>;
export const SelectItem: ComponentType<{ value: string; children?: ReactNode }>;
export const SelectSeparator: ComponentType<any>;
export const SelectScrollUpButton: ComponentType<any>;
export const SelectScrollDownButton: ComponentType<any>;
