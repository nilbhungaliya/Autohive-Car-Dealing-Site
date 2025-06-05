import { SettingsPageContent } from "@/components/admin/settings/content";

export default function SettingsPage() {
  return (
    <>
      <div className="flex flex-col p-6 text-foreground">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg md:text-2xl">
            Account Settings
          </h1>
        </div>
      </div>
      <SettingsPageContent />
    </>
  );
}
