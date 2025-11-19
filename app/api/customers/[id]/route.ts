import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await request.json();
    
    await sql`
      UPDATE customers 
      SET name = ${customer.name}, phone = ${customer.phone}, address = ${customer.address},
          total_transactions = ${customer.totalTransactions}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
    `;
    
    return Response.json({ id: params.id, ...customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    return Response.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM customers WHERE id = ${params.id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return Response.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
