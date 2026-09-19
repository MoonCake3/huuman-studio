'use client';

import { useSyncExternalStore } from 'react';

let cachedSupported: boolean | null = null;

function checkWebGL(): boolean {
  if (typeof window === 'undefined') return true;
  if (cachedSupported !== null) return cachedSupported;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    cachedSupported = !!gl;
  } catch {
    cachedSupported = false;
  }
  return cachedSupported;
}

function subscribe() {
  return () => {};
}

function getSnapshot(): boolean {
  return checkWebGL();
}

function getServerSnapshot(): boolean {
  return true;
}

export function useWebGL(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
