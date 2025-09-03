import { PrismaClient } from '@prisma/client'

// Simple lazy connection test with limited retries to surface clearer diagnostics for P1001
async function ensureConnection(client: PrismaClient) {
  const maxAttempts = 3
  let lastErr: any
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Lightweight connectivity probe
      await client.$queryRawUnsafe('SELECT 1')
      if (attempt > 1) {
        console.info(`[prisma] Connected after retry attempt ${attempt}`)
      }
      return
    } catch (e: any) {
      lastErr = e
      // P1001 or network style errors; brief backoff
      if (/P1001|ECONN|timeout|Could not connect/i.test(e?.message || '')) {
        const delay = 300 * attempt
        console.warn(`[prisma] Connectivity attempt ${attempt} failed (${e.code || ''} ${e.message}). Retrying in ${delay}ms`) ;
        await new Promise(r => setTimeout(r, delay))
        continue
      } else {
        // Different error (e.g., syntax); abort early
        break
      }
    }
  }
  console.error('[prisma] Unable to establish initial database connection after retries.', lastErr?.message)
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

// Fire and forget connection probe (don't block import in serverless edge scenarios)
ensureConnection(prisma).catch(() => {/* already logged */})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
