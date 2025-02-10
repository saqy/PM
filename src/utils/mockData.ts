import { ProjectManager, Client, Event } from '../types';

const now = new Date();
const today = new Date(now.setHours(9, 0, 0, 0)); // 9 AM today
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1); // 9 AM tomorrow

export const mockPMs: ProjectManager[] = [
  { id: "pm-1", name: "Alice Smith", email: "alice@company.com", email_verified_at: "2024-01-01T00:00:00Z", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", clients: [] },
  { id: "pm-2", name: "Bob Johnson", email: "bob@company.com", email_verified_at: "2024-01-01T00:00:00Z", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", clients: [] },
  { id: "pm-3", name: "Charlie Brown", email: "charlie@company.com", email_verified_at: "2024-01-01T00:00:00Z", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", clients: [] },
  { id: "pm-4", name: "Diana White", email: "diana@company.com", email_verified_at: "2024-01-01T00:00:00Z", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", clients: [] },
  { id: "pm-5", name: "Ethan Green", email: "ethan@company.com", email_verified_at: "2024-01-01T00:00:00Z", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", clients: [] },
];

export const mockClients: Client[] = [
  { id: 1, company_name: "Tech Corp", contact_person: "John Doe", location: "New York", contract_type: "W2", pay_cycle: "Monthly", start_date: "2024-01-01", timezone_id: 1, sale_profile_id: 1, company_id: 1, user_id: "pm-1", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", calls: [] },
  { id: 2, company_name: "Innovative Solutions", contact_person: "Samantha Green", location: "San Francisco", contract_type: "W2", pay_cycle: "Monthly", start_date: "2024-01-01", timezone_id: 2, sale_profile_id: 2, company_id: 2, user_id: "pm-2", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", calls: [] },
  { id: 3, company_name: "Creative Minds", contact_person: "Daniel Harris", location: "Los Angeles", contract_type: "W2", pay_cycle: "Monthly", start_date: "2024-01-01", timezone_id: 3, sale_profile_id: 3, company_id: 3, user_id: "pm-3", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", calls: [] },
  { id: 4, company_name: "Bright Innovations", contact_person: "Emma Clark", location: "Chicago", contract_type: "W2", pay_cycle: "Monthly", start_date: "2024-01-01", timezone_id: 4, sale_profile_id: 4, company_id: 4, user_id: "pm-4", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", calls: [] },
  { id: 5, company_name: "NextGen Tech", contact_person: "Lucas Walker", location: "Miami", contract_type: "W2", pay_cycle: "Monthly", start_date: "2024-01-01", timezone_id: 5, sale_profile_id: 5, company_id: 5, user_id: "pm-5", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", calls: [] },
];

export const mockEvents: Event[] = [
  // PM-1 (Alice Smith)
  {
    id: 1,
    title: "Project Kickoff",
    call_type: "fixed",
    user_id: "pm-1",
    client_id: 1,
    start_time: new Date(today.setHours(9, 15, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(9, 30, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },
  {
    id: 2,
    title: "Client Update Call",
    call_type: "fixed",
    user_id: "pm-1",
    client_id: 1,
    start_time: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(9, 30, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },
  {
    id: 3,
    title: "Monthly Review",
    call_type: "fixed",
    user_id: "pm-1",
    client_id: 1,
    start_time: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(16, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },

  // PM-2 (Bob Johnson)
  {
    id: 4,
    title: "Kickoff Call",
    call_type: "fixed",
    user_id: "pm-2",
    client_id: 2,
    start_time: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },
  {
    id: 5,
    title: "Client Feedback",
    call_type: "fixed",
    user_id: "pm-2",
    client_id: 2,
    start_time: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },
  {
    id: 6,
    title: "Status Update",
    call_type: "fixed",
    user_id: "pm-2",
    client_id: 2,
    start_time: new Date(today.setHours(16, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(17, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },

  // PM-3 (Charlie Brown)
  {
    id: 7,
    title: "Initial Briefing",
    call_type: "fixed",
    user_id: "pm-3",
    client_id: 3,
    start_time: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(12, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },
  {
    id: 8,
    title: "Design Review",
    call_type: "fixed",
    user_id: "pm-3",
    client_id: 3,
    start_time: new Date(today.setHours(13, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },
  {
    id: 9,
    title: "Project Update",
    call_type: "fixed",
    user_id: "pm-3",
    client_id: 3,
    start_time: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(16, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },

  // PM-4 (Diana White)
  {
    id: 10,
    title: "Product Discussion",
    call_type: "fixed",
    user_id: "pm-4",
    client_id: 4,
    start_time: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },
  {
    id: 11,
    title: "Sales Pitch",
    call_type: "fixed",
    user_id: "pm-4",
    client_id: 4,
    start_time: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(12, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },
  {
    id: 12,
    title: "Weekly Sync",
    call_type: "fixed",
    user_id: "pm-4",
    client_id: 4,
    start_time: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(16, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },

  // PM-5 (Ethan Green)
  {
    id: 13,
    title: "Tech Presentation",
    call_type: "fixed",
    user_id: "pm-5",
    client_id: 5,
    start_time: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },
  {
    id: 14,
    title: "Quarterly Review",
    call_type: "fixed",
    user_id: "pm-5",
    client_id: 5,
    start_time: new Date(today.setHours(12, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(13, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  },
  {
    id: 15,
    title: "Team Meeting",
    call_type: "fixed",
    user_id: "pm-5",
    client_id: 5,
    start_time: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
    end_time: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
    status: "scheduled",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    duration_minutes: 0
  }
];

// Populate the relationships
mockPMs.forEach(pm => {
  pm.clients = mockClients.filter(client => client.user_id === pm.id);
});

mockClients.forEach(client => {
  client.calls = mockEvents.filter(event => event.client_id === client.id);
});
