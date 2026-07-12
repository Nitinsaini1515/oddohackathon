export const initialDepartments = [
  { id: 'dept-1', name: 'Engineering', code: 'ENG', manager: 'Sarah Jenkins', employeeCount: 18, status: 'Active', budget: '$150,000', description: 'Core software development, infrastructure, and QA operations.' },
  { id: 'dept-2', name: 'Information Technology', code: 'IT', manager: 'David Miller', employeeCount: 8, status: 'Active', budget: '$90,000', description: 'Internal support, systems administration, and hardware management.' },
  { id: 'dept-3', name: 'Human Resources', code: 'HR', manager: 'Emma Watson', employeeCount: 5, status: 'Active', budget: '$45,000', description: 'Recruitment, employee relations, onboarding, and payroll.' },
  { id: 'dept-4', name: 'Finance & Accounts', code: 'FIN', manager: 'Robert Chen', employeeCount: 6, status: 'Active', budget: '$60,000', description: 'Financial planning, budgeting, audits, and bookkeeping.' },
  { id: 'dept-5', name: 'Operations', code: 'OPS', manager: 'Elena Rostova', employeeCount: 12, status: 'Active', budget: '$110,000', description: 'Logistics, office administration, and day-to-day facilities.' },
  { id: 'dept-6', name: 'Marketing', code: 'MKT', manager: 'Sophia Al-Jamil', employeeCount: 7, status: 'Inactive', budget: '$35,000', description: 'Public relations, social media, campaign coordination, and ads.' }
];

export const initialEmployees = [
  { id: 'emp-1', name: 'Sarah Jenkins', email: 'sarah.j@assetflow.com', department: 'Engineering', role: 'Manager', status: 'Active', avatar: 'SJ', phone: '+1 (555) 019-2834', joiningDate: '2023-03-15', assignedAssetsCount: 2 },
  { id: 'emp-2', name: 'David Miller', email: 'david.m@assetflow.com', department: 'Information Technology', role: 'Manager', status: 'Active', avatar: 'DM', phone: '+1 (555) 019-5821', joiningDate: '2022-08-01', assignedAssetsCount: 3 },
  { id: 'emp-3', name: 'Alex Rivera', email: 'alex.r@assetflow.com', department: 'Engineering', role: 'Team Lead', status: 'Active', avatar: 'AR', phone: '+1 (555) 019-9942', joiningDate: '2023-01-10', assignedAssetsCount: 2 },
  { id: 'emp-4', name: 'Marcus Chen', email: 'marcus.c@assetflow.com', department: 'Engineering', role: 'Engineer', status: 'Active', avatar: 'MC', phone: '+1 (555) 019-3829', joiningDate: '2024-02-18', assignedAssetsCount: 1 },
  { id: 'emp-5', name: 'Emma Watson', email: 'emma.w@assetflow.com', department: 'Human Resources', role: 'Manager', status: 'Active', avatar: 'EW', phone: '+1 (555) 019-8761', joiningDate: '2021-11-04', assignedAssetsCount: 1 },
  { id: 'emp-6', name: 'Robert Chen', email: 'robert.c@assetflow.com', department: 'Finance & Accounts', role: 'Manager', status: 'Active', avatar: 'RC', phone: '+1 (555) 019-4567', joiningDate: '2020-05-12', assignedAssetsCount: 1 },
  { id: 'emp-7', name: 'Jessica Taylor', email: 'jessica.t@assetflow.com', department: 'Operations', role: 'Admin', status: 'Active', avatar: 'JT', phone: '+1 (555) 019-1234', joiningDate: '2023-09-01', assignedAssetsCount: 2 },
  { id: 'emp-8', name: 'Michael Novak', email: 'michael.n@assetflow.com', department: 'Information Technology', role: 'Analyst', status: 'On Leave', avatar: 'MN', phone: '+1 (555) 019-4321', joiningDate: '2022-10-15', assignedAssetsCount: 0 },
  { id: 'emp-9', name: 'Sophia Al-Jamil', email: 'sophia.a@assetflow.com', department: 'Marketing', role: 'Team Lead', status: 'Inactive', avatar: 'SA', phone: '+1 (555) 019-7890', joiningDate: '2024-05-01', assignedAssetsCount: 0 }
];

export const initialCategories = [
  { id: 'cat-1', name: 'Laptops & Workstations', code: 'LAP', icon: 'Laptop', itemCount: 18, totalValue: '$27,400', status: 'Active', description: 'Developer machines, office notebooks, and high-performance workstations.' },
  { id: 'cat-2', name: 'Servers & Networking', code: 'SRV', icon: 'Server', itemCount: 6, totalValue: '$48,000', status: 'Active', description: 'Datacenter server racks, switch routers, firewall hardware, and NAS arrays.' },
  { id: 'cat-3', name: 'Mobile & Tablet Devices', code: 'MOB', icon: 'Smartphone', itemCount: 12, totalValue: '$9,600', status: 'Active', description: 'Testing handsets, tablets for presentations, and executive communication tools.' },
  { id: 'cat-4', name: 'Monitors & Displays', code: 'DIS', icon: 'Monitor', itemCount: 22, totalValue: '$7,800', status: 'Active', description: 'Ultra-wide workstation monitors, meeting room screens, and projection equipment.' },
  { id: 'cat-5', name: 'Office Furniture', code: 'FUR', icon: 'Armchair', itemCount: 45, totalValue: '$18,500', status: 'Active', description: 'Ergonomic chairs, sit-stand desks, conference tables, and lounge setups.' }
];

export const initialAssets = [
  {
    id: 'ast-101',
    name: 'MacBook Pro 16" M3 Max',
    category: 'Laptops & Workstations',
    location: 'HQ - New York',
    condition: 'New',
    status: 'Allocated',
    serialNumber: 'C02F9X8GMD6T',
    assetTag: 'AST-LAP-001',
    description: 'High-performance developer machine with 64GB Unified Memory and 1TB SSD.',
    purchaseDate: '2024-01-15',
    purchaseCost: '$3,499',
    currentHolderId: 'emp-1', // Sarah Jenkins
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    specifications: {
      Processor: 'Apple M3 Max (16-core)',
      Memory: '64GB RAM',
      Storage: '1TB SSD',
      OS: 'macOS Sonoma'
    },
    history: [
      { date: '2024-01-15', event: 'Asset Registered', user: 'David Miller', notes: 'Purchased directly from Apple Store Enterprise portal.' },
      { date: '2024-01-16', event: 'Quality Check Completed', user: 'David Miller', notes: 'Condition verified as New. Configured standard security profiles.' },
      { date: '2024-01-20', event: 'Asset Allocated', user: 'David Miller', notes: 'Assigned to Sarah Jenkins (Engineering Dept).' }
    ]
  },
  {
    id: 'ast-102',
    name: 'ThinkPad P1 Gen 6',
    category: 'Laptops & Workstations',
    location: 'HQ - New York',
    condition: 'Good',
    status: 'Allocated',
    serialNumber: 'PF4X92KD',
    assetTag: 'AST-LAP-002',
    description: 'Windows engineering workstation with Intel Core i9, NVIDIA RTX 4080, and 32GB RAM.',
    purchaseDate: '2023-09-10',
    purchaseCost: '$2,850',
    currentHolderId: 'emp-3', // Alex Rivera
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    specifications: {
      Processor: 'Intel Core i9-13900H',
      Memory: '32GB DDR5',
      Storage: '1TB NVMe SSD',
      GPU: 'NVIDIA RTX 4080 (12GB)'
    },
    history: [
      { date: '2023-09-10', event: 'Asset Registered', user: 'David Miller', notes: 'PO #49912 received.' },
      { date: '2023-09-12', event: 'Asset Allocated', user: 'David Miller', notes: 'Assigned to Alex Rivera for 3D modeling work.' }
    ]
  },
  {
    id: 'ast-103',
    name: 'Dell PowerEdge R760 Server',
    category: 'Servers & Networking',
    location: 'Data Center - Virginia',
    condition: 'New',
    status: 'Available',
    serialNumber: 'SV-R760-88X2',
    assetTag: 'AST-SRV-001',
    description: 'Datacenter virtualization rack server. Configured with dual Intel Xeon and 256GB ECC RAM.',
    purchaseDate: '2024-04-05',
    purchaseCost: '$8,200',
    currentHolderId: null,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    specifications: {
      Processor: 'Dual Intel Xeon Gold 6430',
      Memory: '256GB DDR5 ECC',
      Storage: '4x 1.92TB Enterprise SSD RAID-5',
      FormFactor: '2U Rack'
    },
    history: [
      { date: '2024-04-05', event: 'Asset Registered', user: 'David Miller', notes: 'Delivered to DC-Virginia. Provisioned rack space.' }
    ]
  },
  {
    id: 'ast-104',
    name: 'iPad Pro 12.9" M2',
    category: 'Mobile & Tablet Devices',
    location: 'Branch - San Francisco',
    condition: 'Good',
    status: 'Allocated',
    serialNumber: 'DLX72K9W01',
    assetTag: 'AST-MOB-001',
    description: 'Design and markup tablet. Provided with Apple Pencil 2nd Gen.',
    purchaseDate: '2023-02-18',
    purchaseCost: '$1,199',
    currentHolderId: 'emp-7', // Jessica Taylor
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    specifications: {
      Processor: 'Apple M2',
      Memory: '8GB Unified',
      Storage: '256GB Wi-Fi',
      Accessories: 'Apple Pencil 2'
    },
    history: [
      { date: '2023-02-18', event: 'Asset Registered', user: 'David Miller', notes: 'Purchased for Design team.' },
      { date: '2023-02-20', event: 'Asset Allocated', user: 'David Miller', notes: 'Assigned to Jessica Taylor.' }
    ]
  },
  {
    id: 'ast-105',
    name: 'Dell UltraSharp 38" Curved Monitor',
    category: 'Monitors & Displays',
    location: 'HQ - New York',
    condition: 'Good',
    status: 'Allocated',
    serialNumber: 'MX-088D2X',
    assetTag: 'AST-DIS-001',
    description: 'USB-C Hub monitor with curved display, ideal for workspace consolidation.',
    purchaseDate: '2022-11-30',
    purchaseCost: '$950',
    currentHolderId: 'emp-2', // David Miller
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    specifications: {
      Resolution: '3840 x 1600 (WQHD+)',
      RefreshRate: '60Hz',
      Ports: 'USB-C (90W PD), DisplayPort, HDMI',
      PanelType: 'IPS Curved'
    },
    history: [
      { date: '2022-11-30', event: 'Asset Registered', user: 'Jessica Taylor', notes: 'Purchased for office inventory.' },
      { date: '2022-12-05', event: 'Asset Allocated', user: 'Jessica Taylor', notes: 'Assigned to David Miller for IT Operations desk.' }
    ]
  },
  {
    id: 'ast-106',
    name: 'Ergonomic Mesh Chair (Steelcase)',
    category: 'Office Furniture',
    location: 'HQ - New York',
    condition: 'Fair',
    status: 'Allocated',
    serialNumber: 'SC-LEAP-9812',
    assetTag: 'AST-FUR-001',
    description: 'Steelcase Leap v2 ergonomic desk chair, fabric upholstery, fully adjustable.',
    purchaseDate: '2021-04-12',
    purchaseCost: '$1,050',
    currentHolderId: 'emp-5', // Emma Watson
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
    specifications: {
      Model: 'Leap V2',
      Upholstery: 'Black Fabric',
      Frame: 'Platinum Finish'
    },
    history: [
      { date: '2021-04-12', event: 'Asset Registered', user: 'Admin', notes: 'Facilities acquisition batch.' },
      { date: '2021-04-15', event: 'Asset Allocated', user: 'Admin', notes: 'Allocated to Emma Watson (HR Desk).' }
    ]
  },
  {
    id: 'ast-107',
    name: 'Ubiquiti UniFi Dream Machine SE',
    category: 'Servers & Networking',
    location: 'Data Center - Virginia',
    condition: 'New',
    status: 'Under Maintenance',
    serialNumber: 'UDM-SE-908A',
    assetTag: 'AST-SRV-002',
    description: 'Enterprise console with integrated security gateway, PoE switch, and network controller.',
    purchaseDate: '2024-05-10',
    purchaseCost: '$499',
    currentHolderId: null,
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    specifications: {
      Processor: 'Quad-Core ARM Cortex-A57 (1.7 GHz)',
      Interfaces: '1x 10G SFP+ WAN, 8x GbE RJ45 PoE/PoE+',
      Storage: '128GB SSD Integrated'
    },
    history: [
      { date: '2024-05-10', event: 'Asset Registered', user: 'David Miller', notes: 'Purchased for network upgrades.' },
      { date: '2024-06-01', event: 'Sent for Maintenance', user: 'David Miller', notes: 'Firmware upgrade fail caused bootloop. RMA or console recovery in progress.' }
    ]
  }
];

export const mockDashboardStats = {
  totalAssets: 103,
  availableAssets: 42,
  allocatedAssets: 55,
  departmentsCount: 6,
  employeesCount: 9,
  maintenanceToday: 3,
  bookingsToday: 5
};

export const mockActivities = [
  { id: 'act-1', type: 'allocation', title: 'Asset Allocated', desc: 'MacBook Pro 16" assigned to Sarah Jenkins', time: '2 hours ago', user: 'David Miller' },
  { id: 'act-2', type: 'registration', title: 'New Asset Registered', desc: 'Ubiquiti Dream Machine SE logged in inventory', time: '1 day ago', user: 'David Miller' },
  { id: 'act-3', type: 'maintenance', title: 'Maintenance Request', desc: 'ThinkPad P1 reported display flicker', time: '2 days ago', user: 'Alex Rivera' },
  { id: 'act-4', type: 'status_change', title: 'Asset Status Updated', desc: 'Dell Server marked Available from Setup', time: '3 days ago', user: 'David Miller' },
  { id: 'act-5', type: 'employee', title: 'Employee Registered', desc: 'Sophia Al-Jamil joined Marketing Department', time: '5 days ago', user: 'Emma Watson' }
];

export const mockChartData = {
  monthlyActivity: [
    { name: 'Jan', Registered: 12, Allocated: 8, Maintenance: 2 },
    { name: 'Feb', Registered: 15, Allocated: 14, Maintenance: 1 },
    { name: 'Mar', Registered: 18, Allocated: 11, Maintenance: 4 },
    { name: 'Apr', Registered: 25, Allocated: 20, Maintenance: 3 },
    { name: 'May', Registered: 22, Allocated: 18, Maintenance: 5 },
    { name: 'Jun', Registered: 31, Allocated: 28, Maintenance: 2 }
  ],
  categoryBreakdown: [
    { name: 'Laptops', value: 45, color: '#4F46E5' },
    { name: 'Servers', value: 15, color: '#7C3AED' },
    { name: 'Mobile', value: 20, color: '#2563EB' },
    { name: 'Displays', value: 12, color: '#A855F7' },
    { name: 'Furniture', value: 11, color: '#22C55E' }
  ],
  conditionDistribution: [
    { name: 'New', count: 35, fill: '#22C55E' },
    { name: 'Good', count: 48, fill: '#2563EB' },
    { name: 'Fair', count: 14, fill: '#F59E0B' },
    { name: 'Poor', count: 5, fill: '#EF4444' },
    { name: 'Broken', count: 1, fill: '#6B7280' }
  ]
};

export const initialAllocations = [
  {
    id: 'alc-1',
    assetId: 'ast-101',
    assetName: 'MacBook Pro 16" M3 Max',
    assetTag: 'AST-LAP-001',
    employeeId: 'emp-1',
    employeeName: 'Sarah Jenkins',
    department: 'Engineering',
    allocatedDate: '2024-01-20',
    expectedReturnDate: '2025-01-20',
    actualReturnDate: null,
    status: 'Active',
    notes: 'Standard engineering deployment.'
  },
  {
    id: 'alc-2',
    assetId: 'ast-102',
    assetName: 'ThinkPad P1 Gen 6',
    assetTag: 'AST-LAP-002',
    employeeId: 'emp-3',
    employeeName: 'Alex Rivera',
    department: 'Engineering',
    allocatedDate: '2023-09-12',
    expectedReturnDate: '2024-09-12',
    actualReturnDate: null,
    status: 'Active',
    notes: 'For CAD work.'
  },
  {
    id: 'alc-3',
    assetId: 'ast-104',
    assetName: 'iPad Pro 12.9" M2',
    assetTag: 'AST-MOB-001',
    employeeId: 'emp-7',
    employeeName: 'Jessica Taylor',
    department: 'Operations',
    allocatedDate: '2023-02-20',
    expectedReturnDate: '2024-02-20',
    actualReturnDate: null,
    status: 'Active',
    notes: 'Creative and presentations use.'
  }
];

export const initialTransfers = [
  {
    id: 'trf-1',
    assetId: 'ast-101',
    assetName: 'MacBook Pro 16" M3 Max',
    assetTag: 'AST-LAP-001',
    sourceEmployeeId: 'emp-1',
    sourceEmployeeName: 'Sarah Jenkins',
    targetEmployeeId: 'emp-3',
    targetEmployeeName: 'Alex Rivera',
    sourceDepartment: 'Engineering',
    targetDepartment: 'Engineering',
    requestDate: '2026-07-10',
    status: 'Pending',
    notes: 'Developer needs additional graphics power for Docker testing.'
  },
  {
    id: 'trf-2',
    assetId: 'ast-105',
    assetName: 'Dell UltraSharp 38" Curved Monitor',
    assetTag: 'AST-DIS-001',
    sourceEmployeeId: 'emp-2',
    sourceEmployeeName: 'David Miller',
    targetEmployeeId: 'emp-5',
    targetEmployeeName: 'Emma Watson',
    sourceDepartment: 'Information Technology',
    targetDepartment: 'Human Resources',
    requestDate: '2026-07-08',
    status: 'Approved',
    notes: 'HR presentation desk setup upgrade.'
  }
];

export const initialBookings = [
  {
    id: 'bkg-1',
    resourceId: 'res-room-1',
    resourceName: 'Conference Room Alpha',
    resourceType: 'Meeting Rooms',
    userName: 'Sarah Jenkins',
    userRole: 'Engineering Manager',
    date: '2026-07-13',
    startTime: '10:00',
    endTime: '11:30',
    status: 'Upcoming'
  },
  {
    id: 'bkg-2',
    resourceId: 'res-veh-1',
    resourceName: 'Tesla Model 3 (Fleet A)',
    resourceType: 'Vehicles',
    userName: 'David Miller',
    userRole: 'IT Manager',
    date: '2026-07-12',
    startTime: '09:00',
    endTime: '17:00',
    status: 'Upcoming'
  },
  {
    id: 'bkg-3',
    resourceId: 'res-eq-1',
    resourceName: 'VR Headset (Vision Pro)',
    resourceType: 'Equipment',
    userName: 'Alex Rivera',
    userRole: 'Team Lead',
    date: '2026-07-10',
    startTime: '14:00',
    endTime: '16:00',
    status: 'Completed'
  }
];

export const initialMaintenance = [
  {
    id: 'mnt-1',
    assetId: 'ast-107',
    assetName: 'Ubiquiti UniFi Dream Machine SE',
    assetTag: 'AST-SRV-002',
    priority: 'High',
    description: 'Firmware upgrade fail caused bootloop. RMA or console recovery in progress.',
    requestDate: '2026-06-01',
    status: 'In Progress',
    technician: 'Marcus Chen',
    images: ['https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=400&q=80'],
    timeline: [
      { date: '2026-06-01', status: 'Pending', notes: 'RMA request opened.' },
      { date: '2026-06-02', status: 'Approved', notes: 'Approved by IT Admin.' },
      { date: '2026-06-05', status: 'Technician Assigned', notes: 'Assigned to Marcus Chen.' },
      { date: '2026-06-10', status: 'In Progress', notes: 'Console firmware recovery started.' }
    ]
  },
  {
    id: 'mnt-2',
    assetId: 'ast-102',
    assetName: 'ThinkPad P1 Gen 6',
    assetTag: 'AST-LAP-002',
    priority: 'Critical',
    description: 'Screen is flickering severely after 2 hours of GPU load.',
    requestDate: '2026-07-11',
    status: 'Pending',
    technician: null,
    images: [],
    timeline: [
      { date: '2026-07-11', status: 'Pending', notes: 'Ticket registered by Alex Rivera.' }
    ]
  }
];

export const initialAudits = [
  {
    id: 'aud-1',
    cycleName: 'Q3 Hardware Audit 2026',
    auditorName: 'David Miller',
    startDate: '2026-07-01',
    endDate: '2026-07-15',
    status: 'In Progress',
    verifiedAssets: [
      { assetId: 'ast-101', status: 'Verified', notes: 'Checked in person with Sarah.', verifiedDate: '2026-07-02' },
      { assetId: 'ast-102', status: 'Verified', notes: 'Verified in office.', verifiedDate: '2026-07-03' },
      { assetId: 'ast-106', status: 'Damaged', notes: 'Mesh back has a small tear.', verifiedDate: '2026-07-05' }
    ]
  },
  {
    id: 'aud-2',
    cycleName: 'Annual Data Center Audit',
    auditorName: 'Sarah Jenkins',
    startDate: '2026-05-10',
    endDate: '2026-05-20',
    status: 'Completed',
    verifiedAssets: [
      { assetId: 'ast-103', status: 'Verified', notes: 'Rack placement correct.', verifiedDate: '2026-05-11' },
      { assetId: 'ast-107', status: 'Missing', notes: 'Item was not in Virginia datacenter (Sent for repair).', verifiedDate: '2026-05-12' }
    ]
  }
];

export const initialNotifications = [
  {
    id: 'ntf-1',
    type: 'Asset Assigned',
    title: 'New Asset Assigned',
    message: 'MacBook Pro 16" M3 Max has been successfully assigned to you.',
    timestamp: '2026-07-12T09:30:00Z',
    read: false
  },
  {
    id: 'ntf-2',
    type: 'Transfer Approved',
    title: 'Transfer Request Approved',
    message: 'Your transfer request for Dell UltraSharp 38" Curved Monitor has been approved.',
    timestamp: '2026-07-11T14:20:00Z',
    read: true
  },
  {
    id: 'ntf-3',
    type: 'Booking Reminder',
    title: 'Upcoming Meeting Room Booking',
    message: 'Reminder: Conference Room Alpha is booked for tomorrow at 10:00 AM.',
    timestamp: '2026-07-12T11:00:00Z',
    read: false
  }
];

