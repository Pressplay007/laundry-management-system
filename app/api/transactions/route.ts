import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const transactions = await sql`SELECT * FROM transactions ORDER BY created_at DESC`;
    return Response.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return Response.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const transaction = await request.json();
    const id = Date.now().toString();
    
    await sql`
      INSERT INTO transactions (id, customer_id, employee_id, weight, order_date, collection_date, amount_to_pay, amount_paid, balance, status)
      VALUES (${id}, ${transaction.customerId}, ${transaction.employeeId}, ${transaction.weight}, ${transaction.orderDate}, ${transaction.collectionDate}, ${transaction.amountToPay}, ${transaction.amountPaid}, ${transaction.balance}, ${transaction.status})
    `;
    
    return Response.json({ id, ...transaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return Response.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
