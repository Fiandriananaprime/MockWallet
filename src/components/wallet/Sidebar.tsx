import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Plus, RotateCcw, LogOut, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AccountSummary from './AccountSummary';
import ThemeToggle from './ThemeToggle';
import { useWalletAuth } from '@/lib/WalletAuth';
import NotificationButton from './NotificationButton';

interface Props {
  onTopUp: () => void;
  onReset: () => void;
}

const navItems = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
];

export default function Sidebar({ onTopUp, onReset }: Props) {
  const { logout } = useWalletAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex md:flex-col fixed inset-y-0 left-0 w-64 border-r bg-background">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Wallet className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Mobile Money</div>
          <div className="text-[11px] text-muted-foreground">Personal wallet</div>
        </div>
        <div className="ml-auto">
          <NotificationButton />
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="rounded-xl border p-4 bg-muted/30">
          <AccountSummary />
        </div>
      </div>

      <nav className="px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pt-4 space-y-1.5">
        <Button variant="default" className="w-full justify-start" onClick={onTopUp}>
          <Plus className="h-4 w-4" /> Top Up
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onReset}>
          <RotateCcw className="h-4 w-4" /> Reset wallet
        </Button>
      </div>

      <div className="mt-auto p-3">
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-muted-foreground"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}