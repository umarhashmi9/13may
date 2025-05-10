export interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate: string;
  manufacturer?: string;
  description?: string;
  dosage?: string;
  image?: string;
}
