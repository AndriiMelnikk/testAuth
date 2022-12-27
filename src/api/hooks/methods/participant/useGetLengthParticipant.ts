import supabase from '../../../supabase';

const useGetLengthParticipant = async (challengeId: string) => {
  try {
    const { data, error } = await supabase.from('activeChallengeUser').select(`users(id)`).eq('accId', challengeId);

    if (error) return error;

    const participant = data.length;

    return participant;
  } catch (e: any) {
    return e;
  }
};

export default useGetLengthParticipant;
