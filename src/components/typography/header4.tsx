type Header4Props = {
  children: React.ReactNode;
  className?: string;
};
export function Header4({ children, className }: Header4Props) {
  return (
    <h4
      className={`${className} font-montserrat scroll-m-20 text-lg font-semibold tracking-tight`}
    >
      {children}
    </h4>
  );
}
