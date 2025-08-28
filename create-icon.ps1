# PowerShell script to create a simple icon
Add-Type -AssemblyName System.Drawing

# Create bitmap
$bitmap = New-Object System.Drawing.Bitmap(128, 128)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Background
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 120, 212))
$graphics.FillRectangle($brush, 0, 0, 128, 128)

# Border
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(0, 90, 158), 4)
$graphics.DrawRectangle($pen, 2, 2, 124, 124)

# Text "1C"
$font = New-Object System.Drawing.Font("Arial", 36, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics.DrawString("1C", $font, $textBrush, 20, 35)

# Simple folder icon
$folderBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 180))
$graphics.FillRectangle($folderBrush, 20, 80, 24, 18)
$graphics.FillRectangle($folderBrush, 20, 80, 6, 4)

# Document icons
$docBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 215, 0))
$graphics.FillRectangle($docBrush, 50, 85, 12, 16)
$graphics.FillRectangle($docBrush, 68, 85, 12, 16)
$graphics.FillRectangle($docBrush, 86, 85, 12, 16)

# Save
$bitmap.Save("icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()

Write-Host "Icon created: icon.png"