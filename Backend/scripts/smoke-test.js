/**
 * AssetFlow API Smoke Test
 * Run: node scripts/smoke-test.js
 */
const BASE = process.env.API_URL || 'http://localhost:5000/api/v1';

const request = async (method, path, body, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok && res.status !== 409) {
    throw new Error(`${method} ${path} => ${res.status}: ${data.message}`);
  }
  return { status: res.status, data };
};

const run = async () => {
  console.log('AssetFlow Smoke Test\n');

  const health = await request('GET', '/health');
  console.log('✔ Health:', health.data.data.database.state);

  let token;

  try {
    const login = await request('POST', '/auth/login', {
      email: 'david.m@assetflow.com',
      password: 'password123',
    });
    token = login.data.data.accessToken;
    console.log('✔ Auth Login (admin)');
  } catch {
    const reg = await request('POST', '/auth/register', {
      name: 'Admin User',
      email: `admin.${Date.now()}@assetflow.com`,
      password: 'password123',
      department: 'Engineering',
    });
    token = reg.data.data.accessToken;
    console.log('✔ Auth Register (first admin)');
  }

  await request('GET', '/auth/me', null, token);
  console.log('✔ Auth Me');

  const dept = await request('POST', '/departments', {
    name: `Dept ${Date.now()}`,
    code: `D${Date.now().toString().slice(-4)}`,
    budget: 100000,
  }, token);
  const deptId = dept.data.data.department._id;
  console.log('✔ Department CRUD create');

  const cat = await request('POST', '/categories', {
    name: `Category ${Date.now()}`,
    code: `C${Date.now().toString().slice(-3)}`,
  }, token);
  const catId = cat.data.data.category._id;
  console.log('✔ Category create');

  const asset = await request('POST', '/assets', {
    name: 'Test Laptop',
    categoryId: catId,
    serialNumber: `SN${Date.now()}`,
    purchaseCost: 1500,
    location: 'HQ',
  }, token);
  const assetId = asset.data.data.asset._id;
  console.log('✔ Asset create - Tag:', asset.data.data.asset.assetTag);

  const emp = await request('POST', '/employees', {
    name: 'Test Employee',
    email: `emp.${Date.now()}@assetflow.com`,
    password: 'password123',
    departmentId: deptId,
  }, token);
  const empId = emp.data.data.employee.id;
  console.log('✔ Employee create');

  await request('POST', '/allocations/allocate', {
    assetId,
    employeeId: empId,
  }, token);
  console.log('✔ Allocation');

  const res = await request('POST', '/bookings/resources', {
    name: `Room ${Date.now()}`,
    type: 'Meeting Rooms',
  }, token);

  await request('POST', '/bookings', {
    resourceId: res.data.data.resource._id,
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 90000000).toISOString(),
    purpose: 'Test meeting',
  }, token);
  console.log('✔ Booking');

  await request('POST', '/maintenance', {
    assetId,
    description: 'Smoke test maintenance',
    priority: 'Low',
  }, token);
  console.log('✔ Maintenance');

  await request('POST', '/audits', {
    cycleName: 'Smoke Audit',
    auditorId: (await request('GET', '/auth/me', null, token)).data.data.user.id,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
  }, token);
  console.log('✔ Audit');

  await request('GET', '/notifications', null, token);
  console.log('✔ Notifications');

  await request('GET', '/reports/assets', null, token);
  console.log('✔ Reports');

  await request('GET', '/analytics/utilization', null, token);
  console.log('✔ Analytics');

  await request('GET', `/innovation/assets/${assetId}/passport`, null, token);
  console.log('✔ Innovation Passport');

  await request('GET', '/dashboard/stats', null, token);
  console.log('✔ Dashboard');

  console.log('\n✅ All smoke tests passed!');
};

run().catch((err) => {
  console.error('\n❌ Smoke test failed:', err.message);
  process.exit(1);
});
