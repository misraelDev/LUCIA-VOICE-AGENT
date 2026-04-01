"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Ancho mínimo para considerar la medida válida (evita 0 al minimizar pestaña). */
export const STABLE_CHART_MIN_WIDTH = 64;

/**
 * Ancho para Recharts sin ResponsiveContainer.
 * - No usa ancho inicial inventado (p. ej. 400): eso pintaba un chart estrecho y luego
 *   saltaba al ancho real → CLS grande y repetible (~0,22).
 * - `null` hasta la primera medida en useLayoutEffect (antes del primer pintado con chart).
 * - No baja el ancho cuando la medida cae &lt; mínimo (pestaña en background).
 */
export function useStableChartWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const read = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      setWidth((prev) => {
        if (w >= STABLE_CHART_MIN_WIDTH) return w;
        return prev;
      });
    };

    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    const onVis = () => {
      if (document.visibilityState === "visible") read();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const ready = width != null && width >= STABLE_CHART_MIN_WIDTH;

  return { ref, width: ready ? width : null, ready };
}
