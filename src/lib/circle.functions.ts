import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
export const getCircle = createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const [commissions,requests]=await Promise.all([context.supabase.from('member_commissions').select('id,title,reference,stage,progress,next_update').eq('user_id',context.userId).order('created_at',{ascending:false}),context.supabase.from('concierge_requests').select('id,subject,status,created_at').eq('user_id',context.userId).order('created_at',{ascending:false}).limit(10)]);
 if(commissions.error)throw new Error('Unable to retrieve your commissions.');if(requests.error)throw new Error('Unable to retrieve your concierge requests.');
 return {commissions:commissions.data??[],requests:requests.data??[]};
});
export const requestConcierge=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input:unknown)=>z.object({subject:z.string().trim().min(3).max(150),message:z.string().trim().min(10).max(3000)}).parse(input)).handler(async({data,context})=>{
 const {error}=await context.supabase.from('concierge_requests').insert({user_id:context.userId,...data});if(error)throw new Error('Your request could not be sent. Please try again.');return {ok:true};
});
