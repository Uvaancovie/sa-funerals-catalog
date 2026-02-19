# Start Development Servers
# This script starts both the .NET API and Angular frontend

Write-Host "Starting SA Funeral Supplies Development Environment" -ForegroundColor Green
Write-Host ""

# Check if we're in the correct directory
if (-Not (Test-Path "SAFuneralSuppliesAPI")) {
    Write-Host "Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Checking prerequisites..." -ForegroundColor Cyan

# Check if .NET is installed
try {
    $dotnetVersion = dotnet --version
    Write-Host "[OK] .NET SDK found: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] .NET SDK not found. Please install .NET 8.0 SDK" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found. Please install Node.js v18 or higher" -ForegroundColor Red
    exit 1
}

# Check if Angular CLI is available
try {
    $ngVersion = ng version --skip-confirmation 2>$null | Select-Object -First 1
    Write-Host "[OK] Angular CLI found" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Angular CLI not found globally. Using local version..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting backend API..." -ForegroundColor Cyan

# Check if port 5000 is already in use
$port5000InUse = netstat -ano | findstr :5000 2>$null
if ($port5000InUse) {
    Write-Host "[WARNING] Port 5000 is already in use" -ForegroundColor Yellow
    $pidMatch = $port5000InUse | Select-Object -First 1 | Select-String -Pattern '\d+$'
    if ($pidMatch) {
        $processId = $pidMatch.Matches[0].Value
        try {
            $process = Get-Process -Id $processId -ErrorAction Stop
            Write-Host "   Process: $($process.ProcessName) (PID: $processId)" -ForegroundColor Gray
            $response = Read-Host "Kill this process and continue? (Y/n)"
            if ($response -eq "" -or $response -eq "y" -or $response -eq "Y") {
                Stop-Process -Id $processId -Force
                Write-Host "[OK] Process killed" -ForegroundColor Green
                Start-Sleep -Seconds 2
            } else {
                Write-Host "[ERROR] Cannot start API while port 5000 is in use" -ForegroundColor Red
                exit 1
            }
        } catch {
            Write-Host "[WARNING] Could not identify process" -ForegroundColor Yellow
        }
    }
}

# Start backend in a new window
$apiPath = Join-Path $PWD "SAFuneralSuppliesAPI"
$command = "Write-Host '.NET API Server' -ForegroundColor Magenta; Write-Host ''; Set-Location `"$apiPath`"; dotnet run"
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", $command -PassThru

Write-Host "[OK] Backend starting in new window (PID: $($backendJob.Id))" -ForegroundColor Green
Write-Host "   API will be available at: http://localhost:5000" -ForegroundColor Gray
Write-Host "   Swagger UI: http://localhost:5000/swagger" -ForegroundColor Gray

Write-Host ""
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 7

Write-Host ""
Write-Host "Starting frontend..." -ForegroundColor Cyan

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "[OK] Starting Angular development server..." -ForegroundColor Green
Write-Host "   Frontend will be available at: http://localhost:4200" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================================" -ForegroundColor Gray
Write-Host "   Press Ctrl+C to stop the frontend server" -ForegroundColor Yellow
Write-Host "   The backend will continue running in the other window" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""

# Start frontend (this will block)
npx ng serve --proxy-config proxy.conf.json

# If user stops the frontend, ask about backend
Write-Host ""
Write-Host "Frontend stopped." -ForegroundColor Yellow
$response = Read-Host "Stop the backend server too? (y/N)"

if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "Stopping backend..." -ForegroundColor Yellow
    Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] All servers stopped" -ForegroundColor Green
} else {
    Write-Host "Backend still running in the other window" -ForegroundColor Gray
}
