import { Link, useOutletContext } from 'react-router-dom';
import BalanceCard from '@/components/wallet/BalanceCard';
import TransactionTable from '@/components/wallet/TransactionTable';

interface ShellContext {
  openTopUp: () => void;
  openReset: () => void;
}

export default function Dashboard() {
  const { openTopUp, openReset } = useOutletContext<ShellContext>();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your wallet overview.</p>
      </div>

      <BalanceCard onTopUp={openTopUp} onReset={openReset} />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent transactions</h2>
          <Link
            to="/transactions"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <TransactionTable limit={5} />
      </section>
    </div>
  );
}