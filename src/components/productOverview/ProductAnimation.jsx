import Lottie from "lottie-react";
import productLottie from "../../assets/animations/planning.json";

export default function ProductAnimation() {
  return (
    <div className="w-full max-w-[150px] sm:max-w-[200px] mx-auto md:ml-0">
      <Lottie
        animationData={productLottie}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
