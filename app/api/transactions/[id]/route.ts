import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = await request.json();
    
    await sql`
      UPDATE transactions 
      SET customer_id = ${transaction.customerId}, employee_id = ${transaction.employeeId},
          weight = ${transaction.weight}, order_date = ${transaction.orderDate}, 
          collection_date = ${transaction.collectionDate}, amount_to_pay = ${transaction.amountToPay},
          amount_paid = ${transaction.amountPaid}, balance = ${transaction.balance}, status = ${transaction.status},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
    `;
    
    return Response.json({ id: params.id, ...transaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return Response.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM transactions WHERE id = ${params.id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return Response.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
