# Stop Backend (Port 8080)
$backendId = (Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Where-Object OwningProcess -NE 0).OwningProcess | Select-Object -First 1
if ($backendId) {
    Write-Host "Stopping Backend (Process $backendId)..." -ForegroundColor Red
    try {
        Stop-Process -Id $backendId -Force -ErrorAction Stop
    }
    catch {
        Write-Host "Failed to stop process $backendId. Try running as Admin." -ForegroundColor Red
    }
}
else {
    Write-Host "Backend (8080) is not running." -ForegroundColor Yellow
}

# Stop Frontend (Port 4200)
$frontendId = (Get-NetTCPConnection -LocalPort 4200 -ErrorAction SilentlyContinue | Where-Object OwningProcess -NE 0).OwningProcess | Select-Object -First 1
if ($frontendId) {
    Write-Host "Stopping Frontend (Process $frontendId)..." -ForegroundColor Red
    try {
        Stop-Process -Id $frontendId -Force -ErrorAction Stop
    }
    catch {
        Write-Host "Failed to stop process $frontendId. Try running as Admin." -ForegroundColor Red
    }
}
else {
    Write-Host "Frontend (4200) is not running." -ForegroundColor Yellow
}

# Close the browser page by title
Write-Host "Closing browser page..." -ForegroundColor Cyan
$browserHosts = Get-Process | Where-Object { $_.MainWindowTitle -match "CustomerX Cloud | Enterprise CRM Management" }
if ($browserHosts) {
    foreach ($proc in $browserHosts) {
        $proc.CloseMainWindow() | Out-Null
        Start-Sleep -Milliseconds 500
        if (!$proc.HasExited) { $proc.Kill() }
    }
}
else {
    Write-Host "No browser page with title 'CustomerX Cloud | Enterprise CRM Management' found." -ForegroundColor Yellow
}

# Close the terminal window by title
Write-Host "Closing terminal window..." -ForegroundColor Cyan
$terminalHosts = Get-Process | Where-Object { $_.MainWindowTitle -match "SpringRestAngularTest \(8080/4200\)" -or $_.MainWindowTitle -match "SPRING_BOOT_BACKEND" -or $_.MainWindowTitle -match "ANGULAR_FRONTEND" }
if ($terminalHosts) {
    foreach ($proc in $terminalHosts) {
        $proc.CloseMainWindow() | Out-Null
        Start-Sleep -Milliseconds 500
        if (!$proc.HasExited) { $proc.Kill() }
    }
}
else {
    Write-Host "No terminal window with title 'Spring Boot and Angular' found." -ForegroundColor Yellow
}

Write-Host "Stop sequence finished." -ForegroundColor Green
