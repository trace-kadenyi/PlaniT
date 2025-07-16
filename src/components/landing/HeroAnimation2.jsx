import Lottie from "lottie-react";
import planningLottie from "../../assets/animations/Meetings.json";

export default function HeroAnimation() {
  return (
    <div className="w-full max-w-[500px] mx-auto md:ml-0">
      <Lottie
        animationData={planningLottie}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
