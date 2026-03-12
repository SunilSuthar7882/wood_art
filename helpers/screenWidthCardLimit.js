import { useEffect, useState } from "react";

export function screenWidthCardLimit() {
  const [screenWidth, setScreenWidth] = useState();

  useEffect(() => {
    if (screenWidth === undefined || screenWidth) {
      const handleResize = () => {
        setScreenWidth(window.screen.width);
      };
      handleResize();

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [screenWidth]);

  return screenWidth;
}
