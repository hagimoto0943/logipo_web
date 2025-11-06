import { Outlet } from "react-router-dom";
import { AppSidebar } from '@components/app/Sidebar';

export default function Root() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
