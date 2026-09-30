import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import TopUpDialog from './TopUpDialog';
import ResetDialog from './ResetDialog';

export default function WalletShell() {
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar onTopUp={() => setTopUpOpen(true)} onReset={() => setResetOpen(true)} />
      <div className="md:pl-64">
        <MobileHeader onTopUp={() => setTopUpOpen(true)} onReset={() => setResetOpen(true)} />
        <main className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
          <Outlet context={{ openTopUp: () => setTopUpOpen(true), openReset: () => setResetOpen(true) }} />
        </main>
      </div>
      <TopUpDialog open={topUpOpen} onOpenChange={setTopUpOpen} />
      <ResetDialog open={resetOpen} onOpenChange={setResetOpen} />
    </div>
  );
}