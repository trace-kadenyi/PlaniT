import Lottie from 'lottie-react';
import eventPlanning from './animations/event-planning.json';

export function HeroAnimation() {
  return (
    <div className="w-80 mx-auto md:ml-0 md:w-[320px]">
      <Lottie animationData={eventPlanning} loop autoplay />
    </div>
  );
}
