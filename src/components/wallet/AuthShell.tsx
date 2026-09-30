import { type ReactNode } from 'react';
import { Wallet } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthShell({ children, title, subtitle }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col bg-muted/30">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Wallet className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}