import SearchForm from "./components/searchForm";
export default async function Home() {
  return (
    <div className="grid grid-rows-auto grid-cols-1 justify-items-center min-h-screen p-4 pb-20 gap-8 sm:p-4 font-[family-name:var(--font-geist-sans)]">
      <main className="flex w-800 row-start-1 items-center">
        <SearchForm />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        &copy; JiboStudio LLC 2025
      </footer>
    </div>
  );
}
