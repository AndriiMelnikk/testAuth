import supabase from '../../../../supabase';

const useRemoveTags = async (id: string) => {
  const { error } = await supabase.from('challengeTag').delete().eq('id', id).single();

  if (error) return error;

  return;
};

export default useRemoveTags;
