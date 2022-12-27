import supabase from '../../../supabase';

import useRange from '../../useRange';

const useGetParticipant = async (challengeId: string, page = 1) => {
  try {
    const { rangeFrom, rangeTo } = useRange(page);

    const { data, error } = await supabase
      .from('activeChallengeUser')
      .select(`id, users(*)`)
      .eq('accId', challengeId)
      .range(rangeFrom, rangeTo);

    if (error) return error;

    const participant = data.map(el => ({ idChallengeParticipant: el.id, ...el.users }));

    return participant;
  } catch (e: any) {
    return e;
  }
};

export default useGetParticipant;
