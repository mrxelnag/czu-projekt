import "@/loading.css";

export default function LoadingPage() {
  return (
    <div className="mx-auto flex w-full max-w-md items-center justify-center p-12">
      <div className="loader" aria-label="Načítání" />
    </div>
  );
}
