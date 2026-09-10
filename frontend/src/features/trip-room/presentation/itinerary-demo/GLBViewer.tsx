import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const encodedModels = new Map<number, Promise<string>>();
function modelData(asset: number) {
  if (!encodedModels.has(asset)) {
    // Bound base64 memory while retaining the most recently opened native models.
    if (encodedModels.size >= 2) encodedModels.delete(encodedModels.keys().next().value!);
    const load = Asset.fromModule(asset).downloadAsync().then(file =>
      FileSystem.readAsStringAsync(file.localUri!, { encoding: FileSystem.EncodingType.Base64 }));
    encodedModels.set(asset, load);
    load.catch(() => encodedModels.delete(asset));
  }
  return encodedModels.get(asset)!;
}
export function prepareModel(asset: number) {
  const timer = setTimeout(() => { Asset.fromModule(asset).downloadAsync().catch(() => {}); }, 500);
  return () => clearTimeout(timer);
}

export default function GLBViewer({ asset, name }: { asset: number; name: string }) {
  const [base64, setBase64] = useState('');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    modelData(asset).then(data => {
      if (current) setBase64(data);
    }).catch(() => { if (current) setError('Unable to load model.'); });
    return () => { current = false; };
  }, [asset, attempt]);
  return <View style={{ width: '100%', aspectRatio: 1, borderRadius: 18, overflow: 'hidden', backgroundColor: '#303436' }}>
    {base64 && !error ? <WebView originWhitelist={['*']} javaScriptEnabled scrollEnabled={false} onError={() => setError('Unable to start 3D viewer.')} source={{ html: `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#303436}model-viewer{width:100vw;height:100vh;touch-action:none}#status{position:absolute;bottom:10px;left:0;right:0;text-align:center;color:white;font:12px sans-serif}</style><script type="module" src="https://unpkg.com/@google/model-viewer@4.1.0/dist/model-viewer.min.js"></script><model-viewer camera-controls touch-action="none" shadow-intensity="1" camera-orbit="25deg 65deg auto"></model-viewer><div id="status">Loading 3D model…</div><script>const model=document.querySelector('model-viewer');model.alt=${JSON.stringify(name)};const data=Uint8Array.from(atob(${JSON.stringify(base64)}),c=>c.charCodeAt(0));model.src=URL.createObjectURL(new Blob([data],{type:'model/gltf-binary'}));model.addEventListener('load',()=>document.getElementById('status').textContent='Drag to rotate · Pinch to zoom');model.addEventListener('error',()=>document.getElementById('status').textContent='Unable to load model. Check connection.');</script>` }} /> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}><Text style={{ color: '#fff' }}>{error || 'Loading 3D model…'}</Text>{!!error && <Pressable onPress={() => { setError(''); setBase64(''); setAttempt((value) => value + 1); }}><Text style={{ color: '#ffb75e' }}>Retry</Text></Pressable>}</View>}
  </View>;
}
