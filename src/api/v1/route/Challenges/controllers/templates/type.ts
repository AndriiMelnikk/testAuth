import { MergeTwoType } from '../../../../hooks/useMargeType';

import { SchemaChallenges } from '../../../../../type/schema';
import { ActiveChallenge, StatusChallenge } from '../../../../../type/type';
import { Roles } from '../../../../type/role';

type queryPut = {
  tags: {
    id: string;
    idChallengeTag: string;
    status: 'add' | 'remove';
  }[];
};

type queryCreate = {
  tags: {
    id: string;
  }[];
};
type roleUpdate = {
  userId: string;
  tags: {
    id: string;
    idChallengeTag: string;
    status: 'add' | 'remove';
  }[];
};

type mergeRoleUpdate = MergeTwoType<SchemaChallenges, roleUpdate>;

export type QueryGet = { page?: number; search?: string; author?: string; status?: StatusChallenge | '' };
export type QueryPut = MergeTwoType<SchemaChallenges, queryPut>;
export type QueryCreate = MergeTwoType<SchemaChallenges, queryCreate>;

export type RoleGet_s = (
  role: Roles,
  {
    userId,
    page,
    author,
    search,
    status,
  }: {
    userId: string;
    page: number;
    author: string;
    search: string;
    status: StatusChallenge | '';
  },
) => any;

export type RoleGet = (
  role: Roles,
  {
    userId,
    idTemplate,
  }: {
    userId: string;
    idTemplate: string;
  },
) => any;

export type RoleCreate = (
  role: Roles,
  {
    userId,
    name,
    description,
    prize,
    type,
    period,
    condition,
    img,
  }: {
    userId: string;
    name: string;
    description: string;
    prize: boolean;
    type: ActiveChallenge;
    period: number;
    condition: string;
    img: string;
  },
) => any;

export type RoleUpdate = (
  role: Roles,
  { id, name, description, status, prize, type, img, period, condition, tags, userId }: Partial<mergeRoleUpdate>,
) => any;
