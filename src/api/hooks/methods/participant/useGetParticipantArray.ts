import supabase from '../../../supabase';

const useGetParticipant = async (arrayOfParticipant: any) => {
  try {
    const participantList: any[] = [];

    for (const { id } of arrayOfParticipant) {
      const { data, error } = await supabase.from('users').select().eq('id', id).single();
      if (error) return error;

      participantList.push(data);
    }

    return participantList;
  } catch (e: any) {
    return e;
  }
};

export default useGetParticipant;
