const baseUrl = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const teamName = process.argv[3] || '测试团队'
const endpoint = `${baseUrl}/api/generate-poster`

const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: teamName }),
})

if (!response.ok) {
  const body = await response.text()
  console.error(`FAIL: HTTP ${response.status} ${response.statusText}`)
  console.error(body)
  process.exit(1)
}

const contentType = response.headers.get('content-type') ?? ''
if (!contentType.includes('image/png')) {
  console.error(`FAIL: expected image/png, got "${contentType}"`)
  process.exit(1)
}

const buffer = Buffer.from(await response.arrayBuffer())
if (buffer.length < 1024) {
  console.error(`FAIL: PNG too small (${buffer.length} bytes)`)
  process.exit(1)
}

console.log(`OK: ${endpoint}`)
console.log(`    team="${teamName}" size=${buffer.length} bytes`)
