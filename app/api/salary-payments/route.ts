import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const payments = await sql`SELECT * FROM salary_payments ORDER BY created_at DESC`;
    return Response.json(payments);
  } catch (error) {
    console.error('Error fetching salary payments:', error);
    return Response.json({ error: 'Failed to fetch salary payments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payment = await request.json();
    const id = Date.now().toString();
    
    await sql`
      INSERT INTO salary_payments (id, employee_id, amount, payment_date)
      VALUES (${id}, ${payment.employeeId}, ${payment.amount}, ${payment.paymentDate})
    `;
    
    return Response.json({ id, ...payment }, { status: 201 });
  } catch (error) {
    console.error('Error creating salary payment:', error);
    return Response.json({ error: 'Failed to create salary payment' }, { status: 500 });
  }
}
