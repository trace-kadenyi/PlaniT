export default function LandingPage() {
  return (
    <div className="bg-[#9B2C62] text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">PlaniT</h1>
        <div className="space-x-4">
          <button className="border border-white rounded px-4 py-1">Sign Up</button>
          <button className="border border-white rounded px-4 py-1">Log in</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-20 max-w-6xl mx-auto gap-10">
        {/* Text */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Simplify<br />Event Planning
          </h2>
          <p className="text-[#E5E7EB] mb-6 max-w-md">
            PlaniT helps event planners organize, budget, and execute with confidence.
          </p>
          <div className="flex gap-4">
            <button className="bg-[#F59E0B] text-black font-semibold px-6 py-2 rounded hover:bg-[#d97706]">
              Get Started
            </button>
            <button className="border border-white px-6 py-2 rounded font-semibold hover:bg-white hover:text-[#9B2C62] transition">
              View Demo
            </button>
          </div>
        </div>

        {/* Placeholder for Image */}
        <div className="flex-1">
          <div className="w-full h-64 md:h-80 rounded bg-[#7c1c2e] flex items-center justify-center">
            <span className="text-white opacity-70">[ Illustration Here ]</span>
          </div>
        </div>
      </section>

       {/* <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#7C1C2E] text-white p-4 rounded">
          Primary – Crimson Plum
        </div>
        <div className="bg-[#D97706] text-black border p-4 rounded">
          Pumpkin
        </div>

        <div className="bg-[#9B2C62] text-white p-4 rounded">
          Secondary – Deep Mulberry
        </div>
        <div className="bg-[#F59E0B] text-black p-4 rounded">
          Warning – Saffron Gold
        </div>

        <div className="bg-[#BE3455] text-white p-4 rounded">
          Berry Blush – Vivid Hybrid
        </div>

        <div className="bg-[#374151] text-white p-4 rounded">
          Slate – Strong Neutral
        </div>

        <div className="bg-white text-black border p-4 rounded">
          Background – White
        </div>
      </div> */}
    </div>
  );
}
