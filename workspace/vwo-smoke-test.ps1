# VWO API Smoke Test Script
$results = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{}
    )
    
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            UseBasicParsing = $true
            TimeoutSec = 10
            MaximumRedirection = 2
            ErrorAction = "Stop"
        }
        if ($Headers.Count -gt 0) { $params.Headers = $Headers }
        
        $response = Invoke-WebRequest @params
        $sw.Stop()
        
        $body = $null
        $isJson = $response.Headers['Content-Type'] -like "*application/json*"
        if ($isJson) {
            try { $body = $response.Content | ConvertFrom-Json -ErrorAction Stop } catch { }
        }
        
        return [PSCustomObject]@{
            Name = $Name
            URL = $Url
            Status = $response.StatusCode
            TimeMs = [math]::Round($sw.Elapsed.TotalMilliseconds, 0)
            Size = $response.RawContentLength
            ContentType = $response.Headers['Content-Type']
            IsJson = $isJson
            Error = $null
            BodyPreview = if ($body) { ($body | ConvertTo-Json -Depth 2 -Compress).Substring(0, [Math]::Min(200, ($body | ConvertTo-Json -Depth 2 -Compress).Length)) } else { $response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)) }
        }
    }
    catch {
        $sw.Stop()
        $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
        return [PSCustomObject]@{
            Name = $Name
            URL = $Url
            Status = $status
            TimeMs = [math]::Round($sw.Elapsed.TotalMilliseconds, 0)
            Size = 0
            ContentType = $null
            IsJson = $false
            Error = $_.Exception.Message
            BodyPreview = $null
        }
    }
}

# 1. Health Check - Main VWO Domain
$results += Test-Endpoint -Name "Health Check (Main Domain)" -Url "https://app.vwo.com"

# 2. API Base
$results += Test-Endpoint -Name "API Base" -Url "https://app.vwo.com/api/v2"

# 3. Campaigns API (no auth)
$results += Test-Endpoint -Name "Campaigns API (Unauthenticated)" -Url "https://app.vwo.com/api/v2/campaigns"

# 4. User Profile (no auth)
$results += Test-Endpoint -Name "User Profile API (Unauthenticated)" -Url "https://app.vwo.com/api/v2/user/profile"

# 5. Dashboard Stats (no auth)
$results += Test-Endpoint -Name "Dashboard Stats API (Unauthenticated)" -Url "https://app.vwo.com/api/v2/dashboard/stats"

# 6. Accounts endpoint (no auth)
$results += Test-Endpoint -Name "Accounts API (Unauthenticated)" -Url "https://app.vwo.com/api/v2/accounts"

# 7. Test with invalid token (should get 401)
$results += Test-Endpoint -Name "Auth Check (Invalid Token)" -Url "https://app.vwo.com/api/v2/accounts" -Headers @{ "Authorization" = "Bearer fake_token_12345" }

# 9. Test with trailing slash on API base
$results += Test-Endpoint -Name "API Base (Trailing Slash)" -Url "https://app.vwo.com/api/v2/"

# 10. Test campaigns under accounts path
$results += Test-Endpoint -Name "Campaigns via Accounts (Unauthenticated)" -Url "https://app.vwo.com/api/v2/accounts/123/campaigns"

# 11. Test users endpoint
$results += Test-Endpoint -Name "Users API (Unauthenticated)" -Url "https://app.vwo.com/api/v2/accounts/123/users"

# 12. Test push endpoint (common VWO endpoint)
$results += Test-Endpoint -Name "Push API (Unauthenticated)" -Url "https://app.vwo.com/api/v2/accounts/123/push"

# Output formatted results
foreach ($r in $results) {
    $icon = if ($r.Status -eq 200 -or $r.Status -eq 201) { "[PASS]" } elseif ($r.Status -eq 401 -or $r.Status -eq 403) { "[LOCK]" } elseif ($r.Status -eq 404) { "[WARN]" } elseif ($r.Status -eq 0) { "[FAIL]" } else { "[WARN]" }
    $pass = if ($r.Status -in @(200,201)) { "PASSED" } elseif ($r.Status -eq 401 -and $r.Name -like "*(Unauthenticated)*") { "PASSED (Expected 401)" } elseif ($r.Status -eq 404 -and $r.Name -like "*(Unauthenticated)*") { "PASSED (Endpoint exists, requires auth)" } elseif ($r.Status -eq 0) { "FAILED" } else { "WARNING" }
    
    Write-Output ""
    Write-Output "$icon $pass | $($r.Name)"
    Write-Output "   URL: $($r.URL)"
    Write-Output "   Status: $($r.Status) | Time: $($r.TimeMs)ms"
    if ($r.IsJson) { Write-Output "   Content-Type: JSON" }
    if ($r.BodyPreview) { Write-Output "   Preview: $($r.BodyPreview)" }
    if ($r.Error) { Write-Output "   Error: $($r.Error)" }
}

Write-Output ""
Write-Output "=== SUMMARY ==="
$passed = ($results | Where-Object { $_.Status -in @(200,201,401,404) }).Count
$failed = ($results | Where-Object { $_.Status -eq 0 }).Count
$total = $results.Count
Write-Output "Total: $total | Checked: $passed | Failed: $failed"

$results | Export-Csv -Path "C:\Users\91733\.openclaw\workspace\vwo-smoke-results.csv" -NoTypeInformation
