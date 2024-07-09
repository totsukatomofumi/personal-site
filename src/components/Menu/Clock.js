import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Clock() {
  const [date, setDate] = useState(new Date());
  const colonRef = useRef();

  useEffect(() => {
    let clockId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(clockId);
    };
  }, []);

  useGSAP(() => {
    gsap.to(colonRef.current, {
      opacity: 0,
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "none",
      repeatDelay: 1,
    });
  });

  return (
    <>
      <div className="text-8xl text-custom-grey-700 text-center flex justify-center">
        <div className="w-72">
          {date.getHours() % 12 || 12}
          <span ref={colonRef}>:</span>
          {date.getMinutes().toString().padStart(2, "0")}
        </div>
        <div className="relative bottom-2 w-0 text-4xl flex flex-col justify-end">
          <div>{date.getHours() >= 12 ? "PM" : "AM"}</div>
        </div>
      </div>
      <div className="mt-8 text-6xl text-custom-grey-dark text-center font-bold">
        {date.toLocaleDateString([], {
          weekday: "short",
        })}{" "}
        {date.toLocaleDateString([], {
          day: "2-digit",
          month: "2-digit",
        })}
      </div>
    </>
  );
}

export default Clock;
