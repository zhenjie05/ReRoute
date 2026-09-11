# Country overview images

`france-overview.png` and `japan-overview.png` are the country-only illustrations used by the Planning map.
They are 1800 × 1300 local PNGs, rendered from public-domain [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/) geography using `scripts/render-country-overviews.ps1`.
The source GeoJSON lives in `source/`; `overview-projection.json` keeps the raster projection aligned with city coordinates.
City labels are independent interactive overlays, with leader lines linking them to the geographic anchors.
The map component contains no country-border SVG paths and needs no map server at runtime.

## Earlier map assets

`france.png` and `japan.png` are local 900 × 650 raster maps for the frontend demo.
Map data and cartography © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), ODbL.
Source tiles: https://tile.openstreetmap.org/ (saved September 2026).

The camera settings in `scripts/build-country-maps.ps1` match `JapanMap.tsx`.
Keep the image aspect ratio and camera settings together so city hotspots stay aligned.
These images load from bundled assets and do not call a map service at runtime.
