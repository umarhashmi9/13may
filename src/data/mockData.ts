export interface Medicine {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  expiryDate: string;
  manufacturer: string;
  dosage: string;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "cashier" | "pharmacist";
  avatar?: string;
  phone?: string;
  status?: "active" | "inactive";
  joinDate?: string;
}

export interface SaleItem {
  id: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Sale {
  id: string;
  date: string;
  customerId: string | null;
  customerName: string | null;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cashierId: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
}

export interface Purchase {
  id: string;
  date: string;
  supplierId: string;
  items: {
    medicineId: string;
    medicineName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  total: number;
}

export const medicines: Medicine[] = [
  {
    id: "med001",
    name: "Paracetamol 500mg",
    category: "Tablets",
    description: "Pain reliever and fever reducer",
    price: 5.99,
    stock: 120,
    expiryDate: "2025-06-15",
    manufacturer: "PharmaCorp",
    dosage: "500mg"
  },
  {
    id: "med002",
    name: "Amoxicillin 250mg",
    category: "Capsules",
    description: "Antibiotic used to treat bacterial infections",
    price: 12.50,
    stock: 85,
    expiryDate: "2025-03-28",
    manufacturer: "MediPharm",
    dosage: "250mg"
  },
  {
    id: "med003",
    name: "Ibuprofen 400mg",
    category: "Tablets",
    description: "Non-steroidal anti-inflammatory drug",
    price: 7.25,
    stock: 200,
    expiryDate: "2025-05-10",
    manufacturer: "PharmaCorp",
    dosage: "400mg"
  },
  {
    id: "med004",
    name: "Cetirizine 10mg",
    category: "Tablets",
    description: "Antihistamine for allergies",
    price: 8.99,
    stock: 75,
    expiryDate: "2025-04-20",
    manufacturer: "AllergyCare",
    dosage: "10mg"
  },
  {
    id: "med005",
    name: "Vitamin D3 1000IU",
    category: "Capsules",
    description: "Vitamin supplement",
    price: 15.49,
    stock: 150,
    expiryDate: "2026-01-15",
    manufacturer: "VitaHealth",
    dosage: "1000IU"
  },
  {
    id: "med006",
    name: "Omeprazole 20mg",
    category: "Capsules",
    description: "Proton pump inhibitor for acid reflux",
    price: 22.75,
    stock: 60,
    expiryDate: "2024-12-30",
    manufacturer: "GastroMed",
    dosage: "20mg"
  },
  {
    id: "med007",
    name: "Cough Syrup 100ml",
    category: "Syrups",
    description: "For dry cough relief",
    price: 13.25,
    stock: 45,
    expiryDate: "2024-08-15",
    manufacturer: "RespiCare",
    dosage: "10ml"
  },
  {
    id: "med008",
    name: "Diclofenac 50mg",
    category: "Tablets",
    description: "Non-steroidal anti-inflammatory drug",
    price: 9.99,
    stock: 110,
    expiryDate: "2025-07-25",
    manufacturer: "PainRelief",
    dosage: "50mg"
  },
  {
    id: "med009",
    name: "Insulin 10ml",
    category: "Injections",
    description: "For diabetes management",
    price: 65.00,
    stock: 30,
    expiryDate: "2024-11-10",
    manufacturer: "DiabeteCare",
    dosage: "100IU/ml"
  },
  {
    id: "med010",
    name: "Aspirin 75mg",
    category: "Tablets",
    description: "Blood thinner",
    price: 6.50,
    stock: 180,
    expiryDate: "2025-09-01",
    manufacturer: "CardioHealth",
    dosage: "75mg"
  },
];

export const customers: Customer[] = [
  {
    id: "cust001",
    name: "John Smith",
    phone: "555-123-4567",
    email: "john@example.com",
    address: "123 Main St",
    joinDate: "2023-01-15"
  },
  {
    id: "cust002",
    name: "Sarah Johnson",
    phone: "555-987-6543",
    email: "sarah@example.com",
    address: "456 Oak Ave",
    joinDate: "2023-02-20"
  },
  {
    id: "cust003",
    name: "Michael Brown",
    phone: "555-456-7890",
    email: "michael@example.com",
    address: "789 Pine Rd",
    joinDate: "2023-03-05"
  },
  {
    id: "cust004",
    name: "Emily Davis",
    phone: "555-222-3333",
    email: "emily@example.com",
    address: "101 Cedar Ln",
    joinDate: "2023-03-15"
  },
  {
    id: "cust005",
    name: "David Wilson",
    phone: "555-444-5555",
    email: "david@example.com",
    address: "202 Maple Dr",
    joinDate: "2023-04-01"
  }
];

export const users: User[] = [
  {
    id: "user001",
    name: "Admin User",
    email: "admin@medpulse.com",
    role: "admin",
  },
  {
    id: "user002",
    name: "Cashier User",
    email: "cashier@medpulse.com",
    role: "cashier",
  },
  {
    id: "user003",
    name: "Pharmacist User",
    email: "pharmacist@medpulse.com",
    role: "pharmacist",
  }
];

export const sales: Sale[] = [
  {
    id: "sale001",
    date: "2023-06-15T10:30:00",
    customerId: "cust001",
    customerName: "John Smith",
    items: [
      {
        id: "item001",
        medicineId: "med001",
        medicineName: "Paracetamol 500mg",
        quantity: 2,
        unitPrice: 5.99,
        discount: 0,
        total: 11.98
      },
      {
        id: "item002",
        medicineId: "med004",
        medicineName: "Cetirizine 10mg",
        quantity: 1,
        unitPrice: 8.99,
        discount: 0,
        total: 8.99
      }
    ],
    subtotal: 20.97,
    discount: 0,
    tax: 1.05,
    total: 22.02,
    paymentMethod: "Cash",
    cashierId: "user002"
  },
  {
    id: "sale002",
    date: "2023-06-15T14:45:00",
    customerId: "cust003",
    customerName: "Michael Brown",
    items: [
      {
        id: "item003",
        medicineId: "med007",
        medicineName: "Cough Syrup 100ml",
        quantity: 1,
        unitPrice: 13.25,
        discount: 0,
        total: 13.25
      }
    ],
    subtotal: 13.25,
    discount: 0,
    tax: 0.66,
    total: 13.91,
    paymentMethod: "Credit Card",
    cashierId: "user002"
  },
  {
    id: "sale003",
    date: "2023-06-16T09:15:00",
    customerId: null,
    customerName: null,
    items: [
      {
        id: "item004",
        medicineId: "med002",
        medicineName: "Amoxicillin 250mg",
        quantity: 1,
        unitPrice: 12.50,
        discount: 0,
        total: 12.50
      },
      {
        id: "item005",
        medicineId: "med005",
        medicineName: "Vitamin D3 1000IU",
        quantity: 1,
        unitPrice: 15.49,
        discount: 0,
        total: 15.49
      }
    ],
    subtotal: 27.99,
    discount: 0,
    tax: 1.40,
    total: 29.39,
    paymentMethod: "Cash",
    cashierId: "user002"
  }
];

export const suppliers: Supplier[] = [
  {
    id: "supp001",
    name: "MediSupply Inc.",
    contact: "555-111-2222",
    email: "contact@medisupply.com",
    address: "500 Industry Pkwy"
  },
  {
    id: "supp002",
    name: "PharmaDirect",
    contact: "555-333-4444",
    email: "orders@pharmadirect.com",
    address: "200 Commerce Ave"
  },
  {
    id: "supp003",
    name: "Global Meds",
    contact: "555-555-6666",
    email: "supply@globalmeds.com",
    address: "300 International Blvd"
  }
];

export const purchases: Purchase[] = [
  {
    id: "purch001",
    date: "2023-06-01T09:00:00",
    supplierId: "supp001",
    items: [
      {
        medicineId: "med001",
        medicineName: "Paracetamol 500mg",
        quantity: 100,
        unitPrice: 3.50,
        total: 350
      },
      {
        medicineId: "med003",
        medicineName: "Ibuprofen 400mg",
        quantity: 50,
        unitPrice: 4.25,
        total: 212.5
      }
    ],
    total: 562.5
  },
  {
    id: "purch002",
    date: "2023-06-05T11:30:00",
    supplierId: "supp002",
    items: [
      {
        medicineId: "med006",
        medicineName: "Omeprazole 20mg",
        quantity: 30,
        unitPrice: 15.00,
        total: 450
      }
    ],
    total: 450
  }
];

export const salesData = {
  daily: [
    { date: "2023-06-10", sales: 345.80 },
    { date: "2023-06-11", sales: 289.50 },
    { date: "2023-06-12", sales: 432.25 },
    { date: "2023-06-13", sales: 378.90 },
    { date: "2023-06-14", sales: 456.30 },
    { date: "2023-06-15", sales: 512.75 },
    { date: "2023-06-16", sales: 387.40 },
  ],
  weekly: [
    { week: "Week 1", sales: 1897.50 },
    { week: "Week 2", sales: 2158.30 },
    { week: "Week 3", sales: 1945.75 },
    { week: "Week 4", sales: 2256.40 },
  ],
  monthly: [
    { month: "Jan", sales: 7865.50 },
    { month: "Feb", sales: 6945.75 },
    { month: "Mar", sales: 8256.40 },
    { month: "Apr", sales: 7589.30 },
    { month: "May", sales: 8125.60 },
    { month: "Jun", sales: 7895.25 },
  ],
};
