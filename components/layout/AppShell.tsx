import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type AppShellProps = {
  title: string;
  description?: string;
  showAvatar?: boolean;
  children: React.ReactNode;
};

export function AppShell({ title, description, showAvatar = false, children }: AppShellProps) {
  return (
    <div className="flex h-screen w-full bg-neutral-light">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar title={title} description={description} showAvatar={showAvatar} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}