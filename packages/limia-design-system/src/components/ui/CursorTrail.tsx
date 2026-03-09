import React, { useEffect, useRef } from "react";

export const CursorTrail = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Configuration
    const TRAIL_LENGTH = 50;
    const STROKE_WIDTH = 3;
    const STROKE_COLOR = "#2563eb";
    const FRICTION = 0.05;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const points: { x: number; y: number }[] = [];
        let mouse = { x: 0, y: 0 };
        let currentPos = { x: 0, y: 0 };
        let isActive = false;
        let isInitialized = false;

        const resizeValues = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resizeValues);
        resizeValues();

        const handleMouseMove = (e: MouseEvent) => {
            if (!isInitialized) {
                currentPos = { x: e.clientX + 6, y: e.clientY + 2 };
                mouse = { x: e.clientX + 6, y: e.clientY + 2 };
                isInitialized = true;
            }

            // Check if hovering over an element that should hide the cursor trail
            const target = e.target as HTMLElement;
            const shouldHide = target.closest && target.closest('.no-cursor-trail');

            isActive = !shouldHide;
            mouse = { x: e.clientX + 6, y: e.clientY + 2 };
        };
        window.addEventListener("mousemove", handleMouseMove);

        let animationFrameId: number;

        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (isActive || points.length > 0) {
                // Smooth follow logic (Lerp)
                // Move currentPos towards mouse
                currentPos.x += (mouse.x - currentPos.x) * FRICTION;
                currentPos.y += (mouse.y - currentPos.y) * FRICTION;

                // Only add points if active
                if (isActive) {
                    points.push({ x: currentPos.x, y: currentPos.y });
                }
            }

            // Limit trail length - OR shrink if inactive to make it disappear
            if (points.length > TRAIL_LENGTH || (!isActive && points.length > 0)) {
                points.shift();
            }

            if (points.length > 1) {
                ctx.lineJoin = "round";
                ctx.lineCap = "round";

                for (let i = 0; i < points.length - 1; i++) {
                    const p1 = points[i];
                    const p2 = points[i + 1];

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);

                    const alpha = i / points.length;
                    ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
                    ctx.lineWidth = STROKE_WIDTH * alpha;
                    ctx.stroke();
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resizeValues);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50 mix-blend-screen"
            style={{ width: "100%", height: "100%" }}
        />
    );
};
