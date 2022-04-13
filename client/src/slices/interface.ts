export interface AuthInput {
  email: string;
  password: string;
}

export interface AuthState {
  user: {} | null;
  isAuthenticated: boolean;
  message: string;
}

export interface ScheduleState {
  schedules: [];
  reservations: [];
  message: "";
  statistics: Statistic[];
}

export interface Statistic {
  date: string;
  reservations: number;
  available: number;
  blocked: number;
}

export interface ReservationInput {
  title: string;
  date: string;
}

export interface ScheduleInput {
  from: string;
  to: string;
}
