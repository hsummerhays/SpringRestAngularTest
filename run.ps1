# Load WinAPI just for minimizing
if (-not ("WinAPI" -as [type])) {
    Add-Type @"
    using System;
    using System.Runtime.InteropServices;

    public class WinAPI {
        [DllImport("user32.dll", SetLastError = true)]
        public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
        [DllImport("user32.dll")]
        public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        [DllImport("user32.dll")]
        public static extern int GetSystemMetrics(int nIndex);
    }
"@ -ErrorAction SilentlyContinue
}

$SW_MINIMIZE = 6
$pwdPath = (Get-Location).Path

$wtFound = Get-Command wt.exe -ErrorAction SilentlyContinue

if ($wtFound) {
    Write-Host "Windows Terminal detected. Launching maximized split side-by-side panes!" -ForegroundColor Cyan
    
    # We use -M (or --maximized) to launch the window maximized immediately!
    # Naming the panes so the user gets "SpringRestAngularTest (8080/4200)"
    $wtArgs = "--window new -M --title `"SpringRestAngularTest (8080/4200)`" -d `"$pwdPath`" powershell.exe -NoExit -Command `" ./gradlew bootRun --console=plain `" `; split-pane -V --title `"SpringRestAngularTest (8080/4200)`" -d `"$pwdPath\frontend`" powershell.exe -NoExit -Command `" npm start `""
            
    Start-Process wt.exe -ArgumentList $wtArgs
    
    Write-Host "Servers are spinning up..." -ForegroundColor Green
    Write-Host "  Backend:  http://localhost:8080" -ForegroundColor Gray
    Write-Host "  Frontend: http://localhost:4200" -ForegroundColor Gray
    
}
else {
    Write-Host "Windows Terminal not found. Falling back to basic separate windows." -ForegroundColor Yellow
    
    $screenWidth = [WinAPI]::GetSystemMetrics(0)
    $screenHeight = [WinAPI]::GetSystemMetrics(1)
    $halfWidth = [int]($screenWidth / 2)

    $bProc = Start-Process powershell -ArgumentList "-WindowStyle Maximized", "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'SpringRestAngularTest (8080/4200)'; ./gradlew bootRun --console=plain" -PassThru 
    $fProc = Start-Process powershell -ArgumentList "-WindowStyle Maximized", "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'SpringRestAngularTest (8080/4200)'; cd frontend; npm start" -PassThru
}

# Wait for servers to initialize before browser opens
Write-Host "Waiting for servers to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# Find the newly created window and minimize it
Write-Host "Minimizing log window..." -ForegroundColor Gray
$wtHwnd = [IntPtr]::Zero
for ($i = 0; $i -lt 15; $i++) {
    # Scan all processes for a window matching our exact title OR the Angular 'ng serve' overwritten title
    $p = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "SpringRestAngularTest \(8080/4200\)" -or $_.MainWindowTitle -match "ng serve" } | Select-Object -First 1
    if ($p -and $p.MainWindowHandle -ne 0) {
        $wtHwnd = $p.MainWindowHandle
        break
    }
    Start-Sleep -Milliseconds 500
}

if ($wtHwnd -ne [IntPtr]::Zero) { 
    #[WinAPI]::ShowWindow($wtHwnd, $SW_MINIMIZE) | Out-Null 
}
else {
    Write-Host "Could not locate window to minimize." -ForegroundColor Yellow
}

# Open the landing page
Start-Process "http://localhost:4200"

Write-Host "Run script finished." -ForegroundColor Green
