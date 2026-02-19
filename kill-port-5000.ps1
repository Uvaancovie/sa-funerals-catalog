# Kill Process on Port 5000
# Use this script if you get "address already in use" error

Write-Host "🔍 Checking for processes on port 5000..." -ForegroundColor Cyan

$processes = netstat -ano | findstr :5000 | ForEach-Object {
    $line = $_.Trim() -split '\s+'
    if ($line.Length -ge 5) {
        [PSCustomObject]@{
            Protocol = $line[0]
            LocalAddress = $line[1]
            State = $line[3]
            PID = $line[4]
        }
    }
}

if ($processes) {
    $uniquePIDs = $processes | Select-Object -ExpandProperty PID -Unique
    
    Write-Host "Found process(es) using port 5000:" -ForegroundColor Yellow
    
    foreach ($pid in $uniquePIDs) {
        try {
            $process = Get-Process -Id $pid -ErrorAction Stop
            Write-Host "  PID: $pid - $($process.ProcessName)" -ForegroundColor Yellow
            
            $response = Read-Host "Kill process $pid ($($process.ProcessName))? (Y/n)"
            if ($response -eq "" -or $response -eq "y" -or $response -eq "Y") {
                Stop-Process -Id $pid -Force
                Write-Host "  ✅ Process $pid killed" -ForegroundColor Green
            } else {
                Write-Host "  ⏭️  Skipped process $pid" -ForegroundColor Gray
            }
        } catch {
            Write-Host "  ⚠️  Could not find process $pid" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "✅ Done! Port 5000 should now be available." -ForegroundColor Green
} else {
    Write-Host "✅ No processes found using port 5000" -ForegroundColor Green
}
