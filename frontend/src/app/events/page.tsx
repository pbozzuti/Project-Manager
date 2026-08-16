import AppHeader from "@/components/AppHeader";
import ComingSoon from "@/components/ComingSoon";

export default function EventsPage() {
  return (
    <>
      <AppHeader />
      <ComingSoon
        title="Events"
        description="The Chicago venue scraper for finding performance spaces will live here."
      />
    </>
  );
}
