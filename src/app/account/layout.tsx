import type { Metadata } from "next";

// Client portal: never index.
export const metadata: Metadata = {
  title: "Client Portal",
  robots: { index: false, follow: false, nocache: true },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
