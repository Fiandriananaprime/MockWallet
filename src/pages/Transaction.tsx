import TransactionTable from '@/components/wallet/TransactionTable';

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">All activity on your wallet.</p>
      </div>
      <TransactionTable />
    </div>
  );
}