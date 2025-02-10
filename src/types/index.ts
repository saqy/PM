export interface Event {
  id: number;
  title: string;
  call_type: 'impromptu' | 'fixed';
  user_id: string;
  client_id: number;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed';
  created_at: string;
  updated_at: string;
  is_recurring?: boolean;
  recurrence_pattern?: 'weekdays' | 'weekly' | 'monthly';
  duration_minutes: number;
}

export interface ProjectManager {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  clients: Client[];
}

export interface Client {
  id: number;
  company_name: string;
  contact_person: string;
  location: string;
  contract_type: 'W9' | 'W2';
  pay_cycle: 'Monthly' | 'Bi-Weekly' | 'Other';
  start_date: string;
  timezone_id: number;
  sale_profile_id: number;
  company_id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  calls: Event[];
} 