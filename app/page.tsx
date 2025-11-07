export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to WagnerBeef
        </h1>
        <p className="text-center text-lg mb-4">
          Professional bull breeding marketplace
        </p>
        <div className="flex gap-4 items-center justify-center">
          <div className="rounded-lg border border-gray-300 p-4 bg-gray-50">
            <p className="text-sm">
              🚀 Next.js 14+ with App Router
            </p>
          </div>
          <div className="rounded-lg border border-gray-300 p-4 bg-gray-50">
            <p className="text-sm">
              ⚡ TypeScript + Tailwind CSS
            </p>
          </div>
          <div className="rounded-lg border border-gray-300 p-4 bg-gray-50">
            <p className="text-sm">
              ✅ ESLint configured
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
