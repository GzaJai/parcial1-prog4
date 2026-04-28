import { Outlet } from 'react-router-dom';
import { Sidebar } from './Navbar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-bg-main text-zinc-100 font-sans selection:bg-brand/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
