import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Wallet, Plus, RotateCcw, LogOut, LayoutDashboard, ArrowLeftRight, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AccountSummary from './AccountSummary';
import ThemeToggle from './ThemeToggle';
import { useWalletAuth } from '../../lib/WalletAuth';
import { useAccount } from '../../hook/useAccount';
import { formatMoney } from '../../utils/format';
import { type ComponentType, useState } from 'react';

interface Props {
  onTopUp: () => void;
  onReset: () => void;
}

const navItems = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
];

const TypedButton = Button as ComponentType<any>;
const TypedSheetContent = SheetContent as ComponentType<any>;
const TypedSeparator = Separator as ComponentType<any>;

export default function MobileHeader({ onTopUp, onReset }: Props) {
  const [open, setOpen] = useState(false);
  const { logout } = useWalletAuth();
  const navigate = useNavigate();
  const { data } = useAccount() as {
    data?: { balance: number; currency: string };
  };

  return (
    <header className="md:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold">Mobile Money</span>
      </div>

      <div className="flex items-center gap-2">
        {data && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold tabular-nums">
            {formatMoney(data.balance, data.currency)}
          </span>
        )}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <TypedButton variant="ghost" size="icon" aria-label="Open menu" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </TypedButton>
          </SheetTrigger>
          <TypedSheetContent side="right" className="w-72 p-0">
            <div className="flex items-center justify-between px-4 h-14 border-b">
              <span className="text-sm font-semibold">Menu</span>
              <SheetClose asChild>
                <TypedButton variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </TypedButton>
              </SheetClose>
            </div>
            <div className="px-4 py-4">
              <div className="rounded-xl border p-4 bg-muted/30">
                <AccountSummary />
              </div>
            </div>
            <nav className="px-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
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
              <TypedButton
                className="w-full justify-start"
                onClick={() => {
                  setOpen(false);
                  onTopUp();
                }}
              >
                <Plus className="h-4 w-4" /> Top Up
              </TypedButton>
              <TypedButton
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setOpen(false);
                  onReset();
                }}
              >
                <RotateCcw className="h-4 w-4" /> Reset wallet
              </TypedButton>
            </div>
            <div className="mt-auto absolute bottom-0 inset-x-0 p-3">
              <TypedSeparator className="my-2" />
              <div className="flex items-center justify-between">
                <TypedButton
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </TypedButton>
                <ThemeToggle />
              </div>
            </div>
          </TypedSheetContent>
        </Sheet>
      </div>
    </header>
  );
}