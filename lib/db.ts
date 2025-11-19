import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Initialize database schema if needed
export async function initializeDatabase() {
  try {
    // Check if tables exist
    const result = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'employees'
    `
    
    if (result.length === 0) {
      console.log('Initializing database schema...')
      // Tables don't exist, but this will be handled by migration
    }
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

export { sql }
