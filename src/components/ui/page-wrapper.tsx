type Props = {
  children: React.ReactNode;
};
export default function PageWrapper({ children }: Props) {
  return <div className="container mx-auto mb-4 w-full px-4">{children}</div>;
}
