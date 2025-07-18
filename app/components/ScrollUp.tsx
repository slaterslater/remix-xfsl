import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";

export default function ScrollUp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 150);
    };
    window.addEventListener("scroll", onScroll);
    // Check on mount in case already scrolled
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button id="scroll-up" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <MdKeyboardDoubleArrowUp />
    </button>
  );
}