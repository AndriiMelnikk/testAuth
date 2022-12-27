import supabase from '../../../../supabase';
import { TypeGetTagsForChallenge } from '../../type';

const useGetTags: TypeGetTagsForChallenge = async (id, rangeFrom, rangeTo) => {
  try {
    const { data, error } = await supabase
      .from('challengeTag')
      .select(`id, tags(*)`)
      .eq('challengeId', id)
      .range(rangeFrom, rangeTo);

    if (error) return error;

    const tags = data.map(el => ({ idChallengeTag: el.id, ...el.tags }));

    return tags;
  } catch (e: any) {
    return e;
  }
};

export default useGetTags;
