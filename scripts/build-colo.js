// Only run during build process - skip in production/worker environment
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  try {
    const { writeFileSync } = await import('node:fs')
    const { join } = await import('node:path')

    async function main() {
      const locations = await fetch('https://raw.githubusercontent.com/Netrvin/cloudflare-colo-list/refs/heads/main/locations.json')
      if (!locations.ok) {
        throw new Error('Failed to fetch locations')
      }
      const colos = await locations.json()
      writeFileSync(join(import.meta.dirname, '../public/colos.json'), JSON.stringify(colos.reduce((acc, c) => {
        acc[c.iata] = {
          lat: c.lat,
          lon: c.lon,
        }
        return acc
      }, {}), 'utf8'))
    }

    main().catch(console.error)
  }
  catch {
    // Silently fail in worker environment
    console.log('Skipping colo build in worker environment')
  }
}
