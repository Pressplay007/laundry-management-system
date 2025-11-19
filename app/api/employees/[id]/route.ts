import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await request.json();
    
    await sql`
      UPDATE employees 
      SET name = ${employee.name}, phone = ${employee.phone}, role = ${employee.role}, 
          salary = ${employee.salary}, address = ${employee.address}, status = ${employee.status},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
    `;
    
    return Response.json({ id: params.id, ...employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    return Response.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM employees WHERE id = ${params.id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return Response.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
