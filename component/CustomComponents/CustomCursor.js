"use client";
import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Store both the actual mouse target and the dot's current position
  const mouse = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Just update the target position when the mouse moves
    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    // 2. Handle the zoom effect on clickable items
    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    // 3. The animation loop that creates the smooth trailing effect
    let animationFrameId;
    const render = () => {
      // The "0.15" is the easing amount. 
      // Lower = slower and more delayed. Higher = faster and tighter.
      cursor.current.x += (mouse.current.x - cursor.current.x) * 0.15;
      cursor.current.y += (mouse.current.y - cursor.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Call the next frame continuously
      animationFrameId = requestAnimationFrame(render);
    };

    // Start the animation loop
    render();

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{ willChange: "transform" }}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference bg-white w-4 h-4"
    />
  );
};

export default CustomCursor;