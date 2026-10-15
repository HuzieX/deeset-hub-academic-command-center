// Types used across the Next app
export type User = {
  name: string;
  email: string;
  role: 'student'|'admin';
  paymentStatus: 'free'|'paid_premium';
}
