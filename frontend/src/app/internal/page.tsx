import AppHeader from "@/components/AppHeader";
import TestRunner from "@/components/TestRunner";

export default function InternalPage() {
  return (
    <>
      <AppHeader />
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <TestRunner />
      </div>
    </>
  );
}
