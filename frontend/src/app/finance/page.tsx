import AppHeader from "@/components/AppHeader";
import PurchaseLog from "@/components/PurchaseLog";
import GrantsList from "@/components/GrantsList";

export default function FinancePage() {
  return (
    <>
      <AppHeader />
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <h1 className="text-3xl mb-8">Finance</h1>
        <PurchaseLog />
        <GrantsList />
      </div>
    </>
  );
}
