// Overrides the parent admin layout's auth guard — the login page must be reachable when logged out.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center px-6">{children}</div>;
}
