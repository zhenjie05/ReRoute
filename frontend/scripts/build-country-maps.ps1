$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$assetDirectory = Join-Path $PSScriptRoot '../assets/maps'
New-Item -ItemType Directory -Force -Path $assetDirectory | Out-Null
# Fixed-size raster maps; city hotspots use this same Web Mercator camera.
$maps = @(
  @{ Name = 'france'; Lat = 46.55; Lng = 2.25; Zoom = 6 },
  @{ Name = 'japan'; Lat = 37.25; Lng = 138.2; Zoom = 5 }
)
foreach ($map in $maps) {
  $size = 256 * [Math]::Pow(2, $map.Zoom)
  $sin = [Math]::Sin($map.Lat * [Math]::PI / 180)
  $left = ($map.Lng + 180) / 360 * $size - 450
  $top = (0.5 - [Math]::Log((1 + $sin) / (1 - $sin)) / (4 * [Math]::PI)) * $size - 325
  $bitmap = [System.Drawing.Bitmap]::new(900, 650)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    for ($x = [int][Math]::Floor($left / 256); $x -le [Math]::Floor(($left + 899) / 256); $x++) {
      for ($y = [int][Math]::Floor($top / 256); $y -le [Math]::Floor(($top + 649) / 256); $y++) {
        $url = "https://tile.openstreetmap.org/$($map.Zoom)/$x/$y.png"
        $tileFile = Join-Path ([System.IO.Path]::GetTempPath()) "reroute-map-$($map.Zoom)-$x-$y.png"
        node -e 'fetch(process.argv[1], {headers:{"User-Agent":"ReRoute-frontend-demo/1.0"}}).then(async r=>{if(!r.ok)throw Error(r.status);require("fs").writeFileSync(process.argv[2],Buffer.from(await r.arrayBuffer()))}).catch(e=>{console.error(e);process.exit(1)})' $url $tileFile
        if ($LASTEXITCODE -ne 0) { throw "Map tile download failed: $url" }
        $tile = [System.Drawing.Image]::FromFile($tileFile)
        try { $graphics.DrawImage($tile, [int]($x * 256 - $left), [int]($y * 256 - $top), 256, 256) }
        finally { $tile.Dispose() }
      }
    }
    $bitmap.Save((Join-Path $assetDirectory "$($map.Name).png"), [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "Saved $($map.Name).png (900 x 650)"
  } finally { $graphics.Dispose(); $bitmap.Dispose() }
}
