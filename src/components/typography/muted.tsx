export function TypographyMuted({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`${className} text-sm text-muted-foreground`}>{children}</p>
  );
}
