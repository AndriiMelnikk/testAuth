import { MergeTwoType } from '../../hooks/useMargeType';

import { StatusChallenge } from '../../type/type';
import { SchemaChallenges } from '../../type/schema';

// ACTIVE
export enum StatusChallengeActive {
  active = 'active',
  wait = 'wait',
}

export type getActiveChallenges = {
  page?: number;
  status?: StatusChallengeActive | null;
};

export type getActiveChallenge = {
  id?: string;
};

export type addChallengesActive = {
  userId: string;
  challengeId: string;
  dateStart: string;
  prizes: string;
};

export type createChallengesActive = {
  name: string;
  description: string;
  prize: string;
  status: StatusChallenge.active;
  dateStart: string;
  period: number;
  participant: { id: string };
  type: string;
  condition: string;
  idAuthor: string;
};

// TEMPLATE

export type getChallengesTemplate = {
  page?: number;
  status?: StatusChallenge;
};
export type getChallengeTemplate = {
  id?: string;
  tagsPage?: number;
};

type _putChallengeTemplate = {
  tags: {
    id: string;
    idChallengeTag: string;
    status: 'add' | 'remove';
  }[];
};

type _createChallengeTemplate = {
  tags: {
    id: string;
  }[];
};

export type putChallengeTemplate = MergeTwoType<SchemaChallenges, _putChallengeTemplate>;
export type createChallengeTemplate = MergeTwoType<SchemaChallenges, _createChallengeTemplate>;
