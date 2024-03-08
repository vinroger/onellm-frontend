import { Navbar } from "./navbar";

const NAVBAR_WIDTH = "250px";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row w-screen min-h-screen">
      <div style={{ width: NAVBAR_WIDTH }}>
        <Navbar />
      </div>
      {children}
    </div>
  );
}
