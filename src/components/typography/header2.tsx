export function Header2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-montserrat scroll-m-20 pb-2 text-4xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}
