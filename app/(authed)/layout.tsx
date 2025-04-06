// app/(authed)/layout.tsx
import NavBar from '@/app/components/NavBar'; // Adjust path if needed

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {/* The rest of the page content for authed routes goes here */}
      {children}
    </>
  );
}