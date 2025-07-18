import { EaseOutFunc } from "../ui/FramerMotion";

export default function Footer() {
  return (
    <EaseOutFunc>
      <section className="bg-[#9B2C62] text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Ready to plan smarter?</h3>
          <p className="mb-6 text-lg">
            Join event pros using PlaniT to bring structure and clarity to their
            events. It’s your turn to plan like a pro.
          </p>
          <button className="bg-[#F59E0B] text-black font-semibold px-8 py-3 rounded hover:bg-[#d97706] transition">
            Sign Up Free
          </button>
        </div>
      </section>
    </EaseOutFunc>
  );
}
