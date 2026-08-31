import ParentSidebar from "@/components/ParentSidebar";
export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen"><ParentSidebar /><main className="min-w-0 flex-1">{children}</main></div>;
}
