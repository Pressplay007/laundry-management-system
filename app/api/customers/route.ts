import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const customers = await sql`SELECT * FROM customers ORDER BY created_at DESC`;
    return Response.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return Response.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const customer = await request.json();
    const id = Date.now().toString();
    
    await sql`
      INSERT INTO customers (id, name, phone, address, total_transactions)
      VALUES (${id}, ${customer.name}, ${customer.phone}, ${customer.address}, ${customer.totalTransactions || 0})
    `;
    
    return Response.json({ id, ...customer }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return Response.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
