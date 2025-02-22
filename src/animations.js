import gsap from "gsap";

export function animateUiButton(buttonRef, toggle, scale = 0.9) {
  if (buttonRef.current === null || buttonRef.current === undefined) return;

  // toggles should be initialised as null if dont want animation to run on mounting
  if (toggle === null) return;

  const tl = gsap.timeline();

  tl.fromTo(
    buttonRef.current,
    { scale: 1 },
    { scale: scale, duration: 0.05 }
  ).to(buttonRef.current, { scale: 1, duration: 0.05 });
}
