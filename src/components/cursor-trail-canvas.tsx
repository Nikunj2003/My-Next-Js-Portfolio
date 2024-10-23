import { CSSProperties, useEffect, useRef } from "react";
import { cursorTrail } from "@/utility/cursor-trail";

export interface CursorTrailCanvasProps {
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export default function CursorTrailCanvas(props: CursorTrailCanvasProps) {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    // Function to set the canvas size to the window's dimensions
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Set initial canvas size
    setCanvasSize();

    // Update canvas size when window is resized
    window.addEventListener("resize", setCanvasSize);

    // Cursor trail effect setup
    const { cleanUp, renderTrailCursor } = cursorTrail({
      ref: refCanvas,
      color: props.color,
    });
    renderTrailCursor();

    // Clean up on unmount or when color changes
    return () => {
      cleanUp();
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [props.color]);

  return (
    <canvas
      ref={refCanvas}
      className={props.className}
      style={props.style}
    ></canvas>
  );
}
