export async function GET() {
  return Response.json({
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    sample: process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 20) + '...' : null,
  })
}
