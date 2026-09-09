$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$assetDirectory = Join-Path $PSScriptRoot '../assets/maps'
$metadata = @{}
function Project-Point($lng, $lat) {
  $sin = [Math]::Sin($lat * [Math]::PI / 180)
  return @((($lng + 180) / 360), (0.5 - [Math]::Log((1 + $sin) / (1 - $sin)) / (4 * [Math]::PI)))
}
foreach ($country in @('France', 'Japan')) {
  $data = Get-Content -Raw -LiteralPath (Join-Path $assetDirectory "source/$($country.ToLower()).geojson") | ConvertFrom-Json
  # Metropolitan France and the Japanese archipelago; overseas territories are outside this overview.
  $polygons = @($data.geometry.coordinates | Where-Object {
    $p = $_[0][0]
    if ($country -eq 'France') { $p[0] -gt -6 -and $p[0] -lt 10 -and $p[1] -gt 40 -and $p[1] -lt 52 }
    else { $p[0] -gt 122 -and $p[0] -lt 147 -and $p[1] -gt 24 -and $p[1] -lt 46 }
  })
  $points = @($polygons | ForEach-Object { foreach ($point in $_[0]) { ,(Project-Point $point[0] $point[1]) } })
  $minX = ($points | ForEach-Object { $_[0] } | Measure-Object -Minimum).Minimum
  $maxX = ($points | ForEach-Object { $_[0] } | Measure-Object -Maximum).Maximum
  $minY = ($points | ForEach-Object { $_[1] } | Measure-Object -Minimum).Minimum
  $maxY = ($points | ForEach-Object { $_[1] } | Measure-Object -Maximum).Maximum
  $scale = [Math]::Min(720 / ($maxX - $minX), 510 / ($maxY - $minY))
  $offsetX = (900 - ($maxX - $minX) * $scale) / 2 - $minX * $scale
  $offsetY = (650 - ($maxY - $minY) * $scale) / 2 - $minY * $scale
  $metadata[$country] = @{ scale = $scale; offsetX = $offsetX; offsetY = $offsetY }
  $bitmap = [System.Drawing.Bitmap]::new(1800, 1300)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#edf1f5'))
  $g.ScaleTransform(2, 2)
  $fill = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#cfebbe'))
  $border = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#697E50'), 1.3)
  try {
    foreach ($polygon in $polygons) {
      $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
      foreach ($ring in $polygon) {
        $drawPoints = [System.Drawing.PointF[]]@($ring | ForEach-Object {
          $p = Project-Point $_[0] $_[1]
          [System.Drawing.PointF]::new(($p[0] * $scale + $offsetX), ($p[1] * $scale + $offsetY))
        })
        if ($drawPoints.Length -ge 3) { $path.AddPolygon($drawPoints) }
      }
      $g.FillPath($fill, $path)
      $g.DrawPath($border, $path)
      $path.Dispose()
    }
    $bitmap.Save((Join-Path $assetDirectory "$($country.ToLower())-overview.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "Rendered $country overview"
  } finally { $g.Dispose(); $bitmap.Dispose(); $fill.Dispose(); $border.Dispose() }
}
$metadata | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $assetDirectory 'overview-projection.json') -Encoding utf8
