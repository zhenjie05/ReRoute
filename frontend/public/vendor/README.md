# Model viewer browser bundle

`model-viewer.min.js` is the unmodified official browser distribution from
`@google/model-viewer@4.1.0`, licensed under Apache 2.0 (see adjacent license).
It bundles the Three.js renderer. Expo Metro cannot compile the library's
variable dynamic imports, so the web component loads this local static file.

To refresh after an intentional library upgrade, copy
`node_modules/@google/model-viewer/dist/model-viewer.min.js` and its `LICENSE`
into this directory. GLB assets are served separately by Metro.
