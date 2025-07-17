// src/components/HeroAnimation.tsx

'use client';
import { useRive, Layout, Fit, Alignment, useStateMachineInput } from '@rive-app/react-canvas';

export default function HeroAnimation() {
  const { rive, RiveComponent } = useRive({
    src: '/vehicles.riv',
    autoplay: true,
    // We specify the state machine to use here
    stateMachines: "loops", 
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  // This is the "trigger" input from the Rive editor for the "drive" state
  const bumpInput = useStateMachineInput(rive, "loops", "bump");

  // When the component is hovered, we fire the trigger
  const handleMouseEnter = () => {
    if (bumpInput) {
      bumpInput.fire();
    }
  };

  return <RiveComponent onMouseEnter={handleMouseEnter} />;
}