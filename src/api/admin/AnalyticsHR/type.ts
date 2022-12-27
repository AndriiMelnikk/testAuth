export type getAnalyticsHR = {
  id: string;
  companyId: string;
  userId: string;
  event: 'View' | 'Click' | '';
  page: string;
  block: string | null;
  element: string | null;
  date: Date | '';
  time: string;
};
