import { WhoseError } from './useResponse';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SchemaUsers } from '../type/schema';
import supabase from '../supabase';

const useGetUserInCompany = async (userId: string) => {
  const user: PostgrestSingleResponse<SchemaUsers> = await supabase
    .from('users')
    .select()
    .eq('userId', userId)
    .single();

  if (!user.data) {
    throw new Error(`${WhoseError.web} User is not defined`);
  }

  if (user.data?.companyId && user.data?.hrDashboardFlag)
    return { companyId: user.data.companyId, assent: user.data.hrDashboardFlag };

  return { companyId: '', assent: false };
};

export default useGetUserInCompany;
