// A minimal shell distinct from the marketing site's nav/footer — the account
// area is a tool, not a page to browse.
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
