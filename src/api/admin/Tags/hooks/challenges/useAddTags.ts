import supabase from '../../../../supabase';

const useAddTags = async ({ id }: { id: string }, challengeId: string) => {
  const { error } = await supabase.from('challengeTag').insert({ challengeId, tagId: id });

  if (error) return error;
};

export default useAddTags;
