export type Client = {
  id: string;
  name: string;
  status: string | null;
};

export type Consultant = {
  id: string;
  full_name: string;
  email: string;
  profile: string | null;
  cost_day_rate: number | null;
  status: string | null;
};

export type Invoice = {
  id: string;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  issue_date: string | null;
  due_date: string | null;
  purchase_order_id: string | null;
  project_id: string | null;
  clients: { name: string } | null;
};

export type PurchaseOrder = {
  id: string;
  po_number: string;
  total_amount: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  project_id: string | null;
  clients: { name: string } | null;
  projects: { name: string } | null;
};

export type Project = {
  id: string;
  name: string;
  status: string;
  sell_day_rate: number;
  cost_day_rate: number;
  client_id: string;
  consultant_id: string | null;
  clients: { name: string } | null;
  consultants: { full_name: string } | null;
};

export type Timesheet = {
  id: string;
  work_date: string;
  hours: number;
  billable_days: number;
  status: string;
  project_id: string | null;
  consultant_id: string | null;
  clients: { name: string } | null;
  projects: { name: string } | null;
  consultants: { full_name: string } | null;
};

export type AIReport = {
  id: string;
  company_id: string | null;
  question: string;
  answer: string;
  created_at: string;
};