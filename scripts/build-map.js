// Only run during build process - skip in production/worker environment
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  try {
    const { writeFileSync } = await import('node:fs')
    const { join } = await import('node:path')
    const { WorldMapSimplestTopoJSON } = await import('@unovis/ts/maps.js')

    writeFileSync(join(import.meta.dirname, '../public/world.json'), JSON.stringify(WorldMapSimplestTopoJSON), 'utf8')
  }
  catch {
    // Silently fail in worker environment
    console.log('Skipping map build in worker environment')
  }
}
