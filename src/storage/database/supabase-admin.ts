import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Only create Supabase admin client if environment variables are set
const supabaseUrl = process.env.COZE_SUPABASE_URL;
const supabaseServiceKey = process.env.COZE_SUPABASE_SERVICE_ROLE_KEY;

// 服务端客户端 - 使用 service_role_key，绕过 RLS
export const supabaseAdmin: SupabaseClient | null = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// 验证 RLS 配置
export async function verifyRLS() {
  if (!supabaseAdmin) {
    console.warn("Supabase admin not configured, skipping RLS verification");
    return false;
  }

  try {
    const { error } = await supabaseAdmin.from('health_check').select('*').limit(1);
    if (error) {
      console.error('RLS verification failed:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('RLS verification error:', e);
    return false;
  }
}
