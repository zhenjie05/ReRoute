import React, { useEffect, useRef, useState } from 'react';
import { Asset } from 'expo-asset';
import { Pressable, Text, View } from 'react-native';

type ModelElement = HTMLElement & { getCameraOrbit: () => { theta: number; phi: number; radius: number }; cameraOrbit: string; jumpCameraToGoal: () => void };
let engine: Promise<void> | null = null;
function loadEngine() {
  if (customElements.get('model-viewer')) return Promise.resolve();
  if (!engine) engine = new Promise<void>((resolve, reject) => {
    // The official browser bundle avoids dynamic imports that Metro cannot compile.
    const script = document.createElement('script');
    script.type = 'module'; script.src = '/vendor/model-viewer.min.js';
    script.onload = () => { customElements.whenDefined('model-viewer').then(() => resolve()); };
    script.onerror = () => { engine = null; script.remove(); reject(new Error('Viewer engine unavailable')); };
    document.head.appendChild(script);
  });
  return engine;
}
const prefetched = new Set<string>();
// Warm only the first likely model; parsing every 20 MB asset would hurt responsiveness.
export function prepareModel(asset: number) {
  let cancelled = false;
  const timer = setTimeout(() => {
    if (cancelled) return;
    loadEngine().then(() => {
      const constructor = customElements.get('model-viewer') as (CustomElementConstructor & { modelCacheSize: number }) | undefined;
      // model-viewer retains parsed geometry/materials and clones them on a repeat visit.
      if (constructor) constructor.modelCacheSize = 3;
    }).catch(() => {});
    const uri = Asset.fromModule(asset).uri;
    if (!prefetched.has(uri)) {
      prefetched.add(uri);
      const link = document.createElement('link');
      link.rel = 'prefetch'; link.href = uri; link.as = 'fetch';
      document.head.appendChild(link);
    }
  }, 500);
  return () => { cancelled = true; clearTimeout(timer); };
}
export default function GLBViewer({ asset, name }: { asset: number; name: string }) {
  const element = useRef<ModelElement | null>(null);
  const initialOrbit = useRef('');
  const [status, setStatus] = useState('Loading 3D model…');
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false, loaded = false;
    const viewer = element.current!;
    const onLoad = () => {
      if (cancelled) return;
      loaded = true;
      const orbit = viewer.getCameraOrbit();
      initialOrbit.current = `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius}m`;
      setStatus(''); setReady(true);
    };
    const onError = () => { if (!cancelled) { setStatus('Unable to load this model. Try again.'); setReady(false); } };
    viewer.addEventListener('load', onLoad); viewer.addEventListener('error', onError);
    const timeout = setTimeout(() => { if (!cancelled && !loaded) setStatus('Large model still loading… You can retry if needed.'); }, 45000);
    loadEngine().catch(onError);
    return () => { cancelled = true; clearTimeout(timeout); viewer.removeEventListener('load', onLoad); viewer.removeEventListener('error', onError); };
  }, [asset, attempt]);
  const adjust = (rotation: number, scale: number) => {
    const viewer = element.current;
    if (!viewer || !ready) return;
    if (scale === 0) { viewer.cameraOrbit = initialOrbit.current; return; }
    const orbit = viewer.getCameraOrbit();
    viewer.cameraOrbit = `${orbit.theta + rotation}rad ${orbit.phi}rad ${orbit.radius * scale}m`;
  };
  return <View style={{ borderRadius: 18, overflow: 'hidden', backgroundColor: '#e3e9ed' }}>
    <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#303436' }}>
      {React.createElement('model-viewer', {
        key: attempt, ref: element, src: Asset.fromModule(asset).uri, alt: `${name} 3D model`, loading: 'eager',
        'camera-controls': '', 'touch-action': 'none', 'interaction-prompt': 'none',
        'shadow-intensity': '1', exposure: '1.1', 'camera-orbit': '25deg 65deg auto',
        style: { width: '100%', height: '100%', touchAction: 'none' },
      })}
      {!!status && <View pointerEvents="box-none" style={{ position: 'absolute', left: 12, right: 12, bottom: 12, alignItems: 'center', gap: 8 }}>
        <Text accessibilityLiveRegion="polite" style={{ color: '#fff', backgroundColor: '#303436dd', padding: 7, fontSize: 12 }}>{status}</Text>
        {status !== 'Loading 3D model…' && <Pressable accessibilityRole="button" onPress={() => { setReady(false); setStatus('Loading 3D model…'); setAttempt((value) => value + 1); }}><Text style={{ color: '#ffb75e' }}>Retry model</Text></Pressable>}
      </View>}
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10 }}>
      {[{ text: '＋', label: 'Zoom in model', rotation: 0, scale: 0.8 }, { text: '−', label: 'Zoom out model', rotation: 0, scale: 1.25 }, { text: '↶', label: 'Rotate model', rotation: Math.PI / 6, scale: 1 }, { text: '⟲', label: 'Reset model', rotation: 0, scale: 0 }].map((button) => <Pressable key={button.label} disabled={!ready} accessibilityRole="button" accessibilityLabel={button.label} onPress={() => adjust(button.rotation, button.scale)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#f3f7fa', alignItems: 'center', justifyContent: 'center', opacity: ready ? 1 : 0.4 }}><Text style={{ color: '#8b4b00', fontSize: 20 }}>{button.text}</Text></Pressable>)}
      <Text style={{ flex: 1, fontSize: 10, color: '#575c5f' }}>Drag to rotate{ '\n' }Pinch / scroll to zoom</Text>
    </View>
  </View>;
}
