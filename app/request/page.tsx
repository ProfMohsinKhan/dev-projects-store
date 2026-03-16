import RequestSection from "@/components/RequestSection";

export const metadata = {
  title: "Request a Custom Project | DevStore",
  description: "Can't find what you need? Request a custom final year project.",
};

export default function RequestPage() {
  return (
    <main className="min-h-screen bg-slate-900 pt-20 pb-10">
      {/* Humne Component ko yahan direct call kar liya */}
      <RequestSection />
    </main>
  );
}