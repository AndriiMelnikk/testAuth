import { SchemaChallenges } from '../../type/schema';
import { MergeTwoType } from '../../hooks/useMargeType';

export enum AuthorChallenges {
  all = 'all',
  admin = 'admin',
}

export enum SortActiveChallenges {
  dateStart = 'dateStart',
  dateEnd = 'dateEnd',
  name = 'name',
}

export type SchemaActiveChallengesCompanyData = {
  companyId: { name: string; id: string }[];
  challengeId: string;
  dateStart: string;
  prizes: string;
  period: number;
};

type _putChallenge = {
  tags: {
    id: string;
    idChallengeTag: string;
    status: 'add' | 'remove';
  }[];
};

export type putChallenge = MergeTwoType<SchemaChallenges, _putChallenge>;
