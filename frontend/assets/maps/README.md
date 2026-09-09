# Country overview images

`france.png` and `japan.png` are local 900 × 650 raster maps for the frontend demo.
Map data and cartography © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), ODbL.
Source tiles: https://tile.openstreetmap.org/ (saved September 2026).

The camera settings in `scripts/build-country-maps.ps1` match `JapanMap.tsx`.
Keep the image aspect ratio and camera settings together so city hotspots stay aligned.
These images load from bundled assets and do not call a map service at runtime.
