"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  onCLS,
  onFCP,
  onINP,
  onLCP,
  onTTFB,
} from "web-vitals/attribution";
import type { Metric } from "web-vitals";

const PREFIX = "[LUCIA Perf]";

function shouldLog(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV === "development") return true;
  return process.env.NEXT_PUBLIC_PERF_LOG === "true";
}

function logMetricLine(m: Metric) {
  const unit = m.name === "CLS" ? "" : " ms";
  const val = m.name === "CLS" ? m.value.toFixed(4) : Math.round(m.value);
  console.log(`${PREFIX} ${m.name}: ${val}${unit} · ${m.rating}`);
}

function logNavigationTiming() {
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (!nav || nav.entryType !== "navigation") return;

  const t = (a: number, b: number) =>
    Number.isFinite(a) && Number.isFinite(b) ? Math.round(b - a) : null;

  console.log(`${PREFIX} Navigation timing (carga completa del documento)`, {
    redirect: t(nav.redirectStart, nav.redirectEnd),
    dns: t(nav.domainLookupStart, nav.domainLookupEnd),
    tcp: t(nav.connectStart, nav.connectEnd),
    ttfb: t(nav.requestStart, nav.responseStart),
    download: t(nav.responseStart, nav.responseEnd),
    domInteractive: t(nav.startTime, nav.domInteractive),
    domContentLoaded: t(nav.startTime, nav.domContentLoadedEventEnd),
    loadEventEnd: t(nav.startTime, nav.loadEventEnd),
  });
}

/**
 * Registra en consola Core Web Vitals y tiempos de navegación.
 * - En desarrollo: siempre activo.
 * - En producción: solo si NEXT_PUBLIC_PERF_LOG=true
 */
export function WebVitalsLogger() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (!shouldLog()) return;

    onLCP((m) => {
      logMetricLine(m);
      const a = m.attribution;
      console.log(`${PREFIX} LCP atribución`, {
        target: a.target,
        url: a.url,
        timeToFirstByteMs: Math.round(a.timeToFirstByte),
        resourceLoadDelayMs: Math.round(a.resourceLoadDelay),
        resourceLoadDurationMs: Math.round(a.resourceLoadDuration),
        elementRenderDelayMs: Math.round(a.elementRenderDelay),
      });
    });

    onCLS((m) => {
      logMetricLine(m);
      const a = m.attribution;
      console.log(`${PREFIX} CLS atribución`, {
        largestShiftTarget: a.largestShiftTarget,
        largestShiftValue: a.largestShiftValue,
        largestShiftTime: a.largestShiftTime,
      });
    });

    onFCP((m) => logMetricLine(m));
    onINP((m) => logMetricLine(m));
    onTTFB((m) => logMetricLine(m));

    requestAnimationFrame(() => logNavigationTiming());
  }, []);

  useEffect(() => {
    if (!shouldLog()) return;
    if (prevPath.current === null) {
      prevPath.current = pathname;
      console.log(`${PREFIX} Ruta inicial: ${pathname}`);
      return;
    }
    if (prevPath.current !== pathname) {
      console.log(
        `${PREFIX} Navegación cliente → ${pathname} · performance.now()=${Math.round(performance.now())}ms`,
      );
      prevPath.current = pathname;
    }
  }, [pathname]);

  return null;
}
