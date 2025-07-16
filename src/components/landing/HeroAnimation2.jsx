import Lottie from 'lottie-react';
import planningLottie from '../../assets/animations/eventPlanning.json';

export default function HeroAnimation() {
  return (
    <div className="w-80 mx-auto md:ml-0 md:w-[320px]">
      <Lottie animationData={planningLottie} loop autoplay />
    </div>
  );
}
