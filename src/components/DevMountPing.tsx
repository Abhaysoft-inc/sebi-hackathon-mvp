"use client";
import { useEffect } from 'react';
export default function DevMountPing() {
  useEffect(() => { console.log('[DevMountPing] mounted'); }, []);
  return null;
}
