# Vigo Store API Test Script
# Run: .\test-api.ps1

$baseUrl = "http://localhost:3001"
$token = ""

Write-Host "🧪 Vigo Store API Tests" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

# 1. Health Check
Write-Host "`n1. Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method GET
    Write-Host "✅ Server is $($response.status)" -ForegroundColor Green
    Write-Host "   DB Latency: $($response.database.latency)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    exit 1
}

# 2. Get Categories
Write-Host "`n2. Get Categories..." -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "$baseUrl/api/categories" -Method GET
    Write-Host "✅ Found $($categories.Count) categories" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# 3. Get Products
Write-Host "`n3. Get Products..." -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/api/products?limit=5" -Method GET
    Write-Host "✅ Found $($products.products.Count) products" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# 4. Login as Admin
Write-Host "`n4. Admin Login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@vigo.com"
        password = "admin123"
    } | ConvertTo-Json
    
    $login = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST `
        -ContentType "application/json" -Body $loginBody
    
    $token = $login.token
    Write-Host "✅ Logged in as $($login.user.email) (role: $($login.user.role))" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
}

# 5. Access Admin Stats
if ($token) {
    Write-Host "`n5. Admin Stats (Protected)..." -ForegroundColor Yellow
    try {
        $headers = @{ "Authorization" = "Bearer $token" }
        $stats = Invoke-RestMethod -Uri "$baseUrl/api/admin/stats" -Method GET -Headers $headers
        Write-Host "✅ Stats: $($stats.products) products, $($stats.orders) orders, $($stats.users) users" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed: $_" -ForegroundColor Red
    }

    # 6. Get Admin Products
    Write-Host "`n6. Admin Products List..." -ForegroundColor Yellow
    try {
        $headers = @{ "Authorization" = "Bearer $token" }
        $adminProducts = Invoke-RestMethod -Uri "$baseUrl/api/admin/products" -Method GET -Headers $headers
        Write-Host "✅ Admin view: $($adminProducts.Count) products" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed: $_" -ForegroundColor Red
    }
}

Write-Host "`n======================" -ForegroundColor Cyan
Write-Host "✅ API Tests Complete!" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Cyan
