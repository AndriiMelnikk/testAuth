import supabase from '../../../../supabase';

const useGetLengthTags = async (challengeId: string) => {
  try {
    const { data, error } = await supabase.from('challengeTag').select(`tags(id)`).eq('challengeId', challengeId);

    if (error) return error;

    const tags = data.length;
    return tags;
  } catch (e: any) {
    return e;
  }
};

export default useGetLengthTags;
