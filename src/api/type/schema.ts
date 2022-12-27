import { StatusChallenge, ActiveChallenge } from './type';

export type SchemaChallenges = {
  id: string;
  idAuthor: string;
  name: string;
  description: string;
  status: StatusChallenge;
  prize: boolean;
  created_at: string;
  type: ActiveChallenge;
  img: string;
  period: number;
  condition: string;
};

export type SchemaActiveChallengesCompany = {
  id: string;
  created_at: string;
  companyId: string;
  challengeId: string;
  dateStart: string;
  dateEnd: string;
  prizes: string;
  status: StatusChallenge;
};

export type SchemaCompany = {
  id: string;
  name: string;
  language: string;
  created_at: string;
  code: string;
  socialNetwork: string;
  dateAdded: string;
};

export type SchemaTags = {
  id: string;
  created_at: string;
  challengeId: string;
  authorId: string;
  name: string;
  color: string;
};

export type SchemaChallengeTag = {
  id: string;
  created_at: string;
  challengeId: string;
  tagId: string;
};
export type SchemaUsers = {
  id: string;
  created_at: string;
  userId: string;
  DateCreate: string;
  companyId: string;
  nickname: string;
  hrDashboardFlag: boolean;
};

export type SchemaAnalytics = {
  id: string;
  userId: string;
  event: 'View' | 'Click';
  page: string;
  block: string | null;
  element: string | null;
  date: Date;
  time: string;
};
