import Navbar from "../../components/layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-8 px-6 py-32 text-center sm:items-start sm:text-left">
        <h1 className="font-heading max-w-md text-4xl font-bold leading-tight tracking-tight text-ink">
          Welcome to Kumpas
        </h1>
      </main>
    </div>
  );
}