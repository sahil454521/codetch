"use client";

import createGlobe, { COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, forwardRef } from "react";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

export const Globe = forwardRef<HTMLDivElement, any>(function Globe(
  {
    className,
    config = GLOBE_CONFIG,
    targetLat,
    targetLng,
    moveToLocationTrigger,
    scale = 1, // Add scale prop with default value
  },
  ref
) {
  let phi = 0;
  let theta = 0.3; // Add theta for Y axis
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractingY = useRef<number | null>(null); // Ref for Y axis interaction
  const pointerInteractionMovement = useRef(0);
  const autoSpin = useRef(true);

  const r = useMotionValue(0);
  const t = useMotionValue(0); // Add for theta
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });
  const ts = useSpring(t, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number, clientY?: number) => {
    if (pointerInteracting.current !== null) {
      const deltaX = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = deltaX;
      r.set(r.get() + deltaX / MOVEMENT_DAMPING);

      // Y axis movement
      if (clientY !== undefined && pointerInteractingY.current !== null) {
        const deltaY = clientY - pointerInteractingY.current;
        t.set(t.get() + deltaY / MOVEMENT_DAMPING);
      }
    }
  };

  function moveToLocation(lat: number, lng: number) {
    // Convert lat/lng to phi/theta (COBE uses radians)
    // phi: longitude, theta: latitude
    phi = -lng * (Math.PI / 180);
    theta = lat * (Math.PI / 180);
    r.set(0);
    t.set(0);
    // Optionally, stop auto-spin
    autoSpin.current = false;
  }

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        // Only auto-spin if not interacting and autoSpin is true
        if (autoSpin.current && !pointerInteracting.current) phi += 0.005;
        state.phi = phi + rs.get();
        state.theta = theta + ts.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => (canvasRef.current!.style.opacity = "1"), 0);
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, ts, config]);

  useEffect(() => {
    if (
      typeof targetLat === "number" &&
      typeof targetLng === "number" &&
      moveToLocationTrigger !== undefined
    ) {
      // Stop auto-spin immediately
      autoSpin.current = false;
      
      // Move to the target location
      phi = -targetLng * (Math.PI / 180);
      theta = targetLat * (Math.PI / 180);
      r.set(0);
      t.set(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveToLocationTrigger, targetLat, targetLng]);

  // Add a useEffect to handle scale changes - we need to modify canvas size
  useEffect(() => {
    if (canvasRef.current) {
      // Update width calculation based on scale
      const baseWidth = canvasRef.current.offsetWidth;
      width = baseWidth * scale;
      
      // Apply scale transform to the canvas
      canvasRef.current.style.transform = `scale(${scale})`;
    }
  }, [scale]);

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className,
      )}
      ref={ref} // Attach the ref passed from parent
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size] origin-center",
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          pointerInteractingY.current = e.clientY;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => {
          updatePointerInteraction(null);
          pointerInteractingY.current = null;
        }}
        onPointerOut={() => {
          updatePointerInteraction(null);
          pointerInteractingY.current = null;
        }}
        onMouseMove={(e) => updateMovement(e.clientX, e.clientY)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX, e.touches[0].clientY)
        }
      />
      
      {/* You can remove or keep the simplified continent patterns depending on if they're visible with cobe */}
    </div>
  );
});

