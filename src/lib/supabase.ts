import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

function isPublicConfigurationValid() {
  if (!url || !publishableKey?.startsWith('sb_publishable_')) return false;
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

// Somente a chave publicável pode chegar ao navegador. Não há consultas a tabelas nesta etapa.
export const supabase = isPublicConfigurationValid()
  ? createClient(url!, publishableKey!, {
      auth: { flowType: 'pkce', autoRefreshToken: true, detectSessionInUrl: true, persistSession: true },
    })
  : null;

export function authenticationError(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  if (code === 'invalid_credentials') return 'E-mail ou senha inválidos. Confira suas credenciais.';
  if (code === 'email_not_confirmed') return 'Confirme seu e-mail antes de entrar.';
  if (code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit') return 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.';
  if (code === 'same_password') return 'Escolha uma senha diferente da senha atual.';
  if (code === 'weak_password') return 'A senha não atende à política de segurança da conta.';
  if (code === 'otp_expired') return 'O link expirou. Solicite uma nova recuperação de senha.';
  return 'Não foi possível concluir a operação. Verifique a conexão e tente novamente; se persistir, procure o responsável pelo acesso.';
}
