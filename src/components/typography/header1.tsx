export function Header1({
  children,
  primaryColor,
}: {
  children: React.ReactNode;
  primaryColor?: boolean;
}) {
  return (
    <h1
      className="font-montserrat scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
      style={{ color: primaryColor ? "var(--primary)" : undefined }}
    >
      {children}
    </h1>
  );
}
