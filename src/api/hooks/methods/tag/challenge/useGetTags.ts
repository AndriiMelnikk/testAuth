import supabase from '../../../../supabase';

import useRange from '../../../useRange';

const useGetTags = async (challengeId: string, page = 1) => {
  try {
    const { rangeFrom, rangeTo } = useRange(page);
    const { data, error } = await supabase
      .from('challengeTag')
      .select(`id, tags(*)`)
      .eq('challengeId', challengeId)
      .range(rangeFrom, rangeTo);

    if (error) return error;

    const tags = data.map(el => ({ idChallengeTag: el.id, ...el.tags }));

    return tags;
  } catch (e: any) {
    return e;
  }
};

export default useGetTags;
