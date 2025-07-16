import HeroIllustration from "../../assets/hero-planning.svg";

export default function HeroImage() {
  return (
    <img
      src={HeroIllustration}
      alt="Event planning illustration"
      className="w-full max-w-xs mx-auto md:ml-0"
    />
  );
}
