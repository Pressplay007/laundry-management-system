import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const employees = await sql`SELECT * FROM employees ORDER BY created_at DESC`;
    return Response.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return Response.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const employee = await request.json();
    const id = Date.now().toString();
    
    await sql`
      INSERT INTO employees (id, name, phone, role, salary, address, status)
      VALUES (${id}, ${employee.name}, ${employee.phone}, ${employee.role}, ${employee.salary}, ${employee.address}, ${employee.status})
    `;
    
    return Response.json({ id, ...employee }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return Response.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
