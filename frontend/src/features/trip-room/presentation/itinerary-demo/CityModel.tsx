import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import type { ModelKind } from './demo-data';

type Point = [number, number, number];
type Face = { vertices: Point[]; color: string };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function geometry(kind: ModelKind) {
  const faces: Face[] = [];
  const face = (vertices: Point[], color: string) => faces.push({ vertices, color });
  function box(x: number, z: number, w: number, d: number, h: number, color: string, y = 0) {
    const a: Point = [x, y, z], b: Point = [x + w, y, z], c: Point = [x + w, y, z + d], e: Point = [x, y, z + d];
    const up = (p: Point): Point => [p[0], p[1] + h, p[2]];
    face([a, b, up(b), up(a)], color); face([b, c, up(c), up(b)], color);
    face([c, e, up(e), up(c)], color); face([e, a, up(a), up(e)], color);
    face([up(a), up(b), up(c), up(e)], color === '#dd7155' ? '#ef9475' : ['#c9b59f', '#d5c7b5'].includes(color) ? '#f6eee0' : color);
  }
  // A modeled city block with raised streets, parks, trees and a focal landmark.
  box(-108, -108, 216, 216, 8, '#c8d4c4', -8);
  box(-105, -105, 210, 210, 1, '#dfe8d5');
  for (const offset of [-72, 65]) {
    box(-104, offset, 208, 10, 1.5, '#bbc4c4');
    box(offset, -104, 10, 208, 1.5, '#bbc4c4');
  }
  const blocks = [[-96, -95, 22, 18, 28], [-60, -98, 20, 22, 38], [-27, -96, 22, 19, 21], [8, -97, 24, 22, 34], [42, -99, 16, 26, 24], [82, -96, 19, 22, 42], [-96, -55, 18, 26, 35], [-98, -15, 20, 25, 23], [-96, 23, 18, 32, 43], [81, -52, 20, 29, 32], [84, -6, 16, 24, 44], [81, 29, 20, 25, 26], [-96, 81, 26, 19, 24], [-55, 83, 20, 20, 32], [-21, 82, 26, 20, 20], [19, 81, 30, 20, 34], [78, 82, 25, 18, 28]];
  blocks.forEach(([x, z, w, d, h], index) => {
    box(x, z, w, d, h, index % 3 === 0 ? '#c9b59f' : '#d5c7b5');
    for (let floor = 8; floor < h - 3; floor += 9) box(x - 0.2, z - 0.2, w + 0.4, d + 0.4, 1, '#b1bcc0', floor);
  });
  for (let i = 0; i < 14; i++) {
    const x = i < 7 ? -52 : 48, z = -52 + (i % 7) * 16;
    box(x + 3, z + 3, 3, 3, 8, '#a68b6d'); box(x, z, 10, 10, 12, i % 2 ? '#779877' : '#9caf84', 6);
  }
  if (kind === 'temple') {
    box(-30, -27, 60, 50, 9, '#a18d79'); box(-25, -22, 50, 40, 27, '#b85245', 9);
    for (let level = 0; level < 3; level++) {
      const w = 40 - level * 7, y = 37 + level * 20;
      face([[-w, y, -30], [w, y, -30], [w - 7, y + 14, 0], [-w + 7, y + 14, 0]], '#68777a');
      face([[-w, y, 30], [w, y, 30], [w - 7, y + 14, 0], [-w + 7, y + 14, 0]], '#829092');
      if (level < 2) box(-w + 10, -16, w * 2 - 20, 32, 12, '#c8654f', y + 10);
    }
    box(-28, 41, 4, 4, 28, '#b94f3c'); box(24, 41, 4, 4, 28, '#b94f3c'); box(-35, 40, 70, 7, 4, '#b94f3c', 27);
  } else if (kind === 'pyramid') {
    const top: Point = [0, 68, 0];
    const base: Point[] = [[-39, 1, -39], [39, 1, -39], [39, 1, 39], [-39, 1, 39]];
    base.forEach((p, i) => face([p, base[(i + 1) % 4], top], i % 2 ? '#92b8bc' : '#b2d5d4'));
    // Smaller courtyard pyramid.
    face([[36, 1, 42], [58, 1, 42], [47, 23, 53]], '#9bbfc3'); face([[58, 1, 42], [58, 1, 64], [47, 23, 53]], '#7fa4b0');
  } else {
    const red = kind === 'tokyo-tower', color = red ? '#dd7155' : '#a58660';
    const levels = [[0, 35], [36, 22], [68, 13], [112, 5], [151, 2]];
    for (let level = 0; level < levels.length - 1; level++) {
      const [y, width] = levels[level], [topY, topWidth] = levels[level + 1];
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        const thick = level < 2 ? 5 : 2;
        const a: Point = [sx * width, y, sz * width], b: Point = [sx * topWidth, topY, sz * topWidth];
        face([a, [a[0] + thick, y, a[2]], [b[0] + thick, topY, b[2]], b], red && level % 2 ? '#f2e8d6' : color);
        face([a, [a[0], y, a[2] + thick], [b[0], topY, b[2] + thick], b], color);
        // Diagonal lattice braces along the four sides.
        face([[sx * width, y + 4, sz * width], [-sx * topWidth, topY - 4, sz * topWidth], [-sx * topWidth + 1.5, topY - 4, sz * topWidth], [sx * width + 1.5, y + 4, sz * width]], color);
      }
      if (level === 1 || level === 2) box(-width - 5, -width - 5, (width + 5) * 2, (width + 5) * 2, 5, color, y);
    }
    box(-1, -1, 2, 2, 20, color, 150);
  }
  return faces;
}

export function CityModel({ kind, city }: { kind: ModelKind; city: string }) {
  const [camera, setCamera] = useState({ yaw: -0.65, tilt: 0.63, zoom: 1 });
  const latest = useRef(camera);
  useEffect(() => { latest.current = camera; }, [camera]);
  const initial = useRef({ ...camera, distance: 0 });
  const mesh = useMemo(() => geometry(kind), [kind]);
  // PanResponder registers callbacks; refs are read only when a gesture runs.
  /* eslint-disable react-hooks/refs */
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      const [a, b] = event.nativeEvent.touches;
      initial.current = { ...latest.current, distance: a && b ? Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY) : 0 };
    },
    onPanResponderMove: (event, gesture) => {
      const [a, b] = event.nativeEvent.touches;
      if (a && b) {
        const distance = Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
        if (!initial.current.distance) initial.current = { ...latest.current, distance };
        setCamera((previous) => ({ ...previous, zoom: clamp(initial.current.zoom * distance / Math.max(1, initial.current.distance), 0.65, 2.2) }));
      } else setCamera((previous) => ({ ...previous, yaw: initial.current.yaw + gesture.dx * 0.012, tilt: clamp(initial.current.tilt + gesture.dy * 0.005, 0.2, 1.2) }));
    },
    onPanResponderTerminationRequest: () => false,
  }), []);
  /* eslint-enable react-hooks/refs */
  const rendered = mesh.map((face) => {
    const points = face.vertices.map(([x, y, z]) => {
      const rx = x * Math.cos(camera.yaw) - z * Math.sin(camera.yaw), rz = x * Math.sin(camera.yaw) + z * Math.cos(camera.yaw);
      return { x: 180 + rx * camera.zoom, y: 236 + (rz * Math.sin(camera.tilt) - y * Math.cos(camera.tilt)) * camera.zoom, depth: rz * Math.cos(camera.tilt) + y * Math.sin(camera.tilt) };
    });
    return { ...face, points: points.map((p) => `${p.x},${p.y}`).join(' '), depth: points.reduce((sum, p) => sum + p.depth, 0) / points.length };
  }).sort((a, b) => a.depth - b.depth);
  return <View style={styles.frame}>
    <View style={StyleSheet.absoluteFill} {...responder.panHandlers} accessibilityLabel={`${city} interactive 3D model. Drag to rotate. Pinch to zoom.`}>
      <Svg width="100%" height="100%" viewBox="0 0 360 360">{rendered.map((face, i) => <Polygon key={i} points={face.points} fill={face.color} stroke="#728477" strokeWidth={0.35} />)}</Svg>
    </View>
    <View pointerEvents="none" style={styles.tag}><Text style={styles.small}>◇ {city.toUpperCase()} · 3D CITY MODEL</Text></View>
    <View style={styles.controls}>
      <Pressable accessibilityRole="button" accessibilityLabel="Rotate model left" onPress={() => setCamera((c) => ({ ...c, yaw: c.yaw - 0.35 }))} style={styles.control}><Text>↶</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Zoom out 3D model" onPress={() => setCamera((c) => ({ ...c, zoom: clamp(c.zoom - 0.15, 0.65, 2.2) }))} style={styles.control}><Text>−</Text></Pressable>
      <Text style={styles.small}>{Math.round(camera.zoom * 100)}%</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Zoom in 3D model" onPress={() => setCamera((c) => ({ ...c, zoom: clamp(c.zoom + 0.15, 0.65, 2.2) }))} style={styles.control}><Text>＋</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Reset 3D model" onPress={() => setCamera({ yaw: -0.65, tilt: 0.63, zoom: 1 })} style={styles.control}><Text>⟲</Text></Pressable>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  frame: { width: '100%', aspectRatio: 1, backgroundColor: '#eef2eb', borderRadius: 22, overflow: 'hidden' },
  tag: { position: 'absolute', top: 14, left: 14 },
  small: { fontSize: 10, color: '#405836', fontWeight: '700', letterSpacing: 0.7 },
  controls: { position: 'absolute', bottom: 12, alignSelf: 'center', backgroundColor: '#ffffffed', borderRadius: 24, padding: 4, flexDirection: 'row', alignItems: 'center', gap: 5 },
  control: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f7fa' },
});
