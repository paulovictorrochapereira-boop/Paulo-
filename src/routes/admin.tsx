import { useEffect, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Route as rootRoute } from './__root';
import { Brand } from '@/components/brand';
import { Button } from '@/components/ui/button';
import { authenticationError, supabase } from '@/lib/supabase';

export const Route = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: Admin });

function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(!!supabase);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let mounted = true;
    let authChanged = false;
    const { data: { subscription } } = client.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      authChanged = true;
      setSession(nextSession);
      setChecking(false);
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
        setPassword('');
        setFeedback(null);
      }
      if (event === 'SIGNED_OUT') { setMode('login'); setPassword(''); setConfirmation(''); }
    });
    client.auth.getSession().then(({ data, error }) => {
      if (!mounted || authChanged) return;
      setSession(data.session);
      setChecking(false);
      if (error) setFeedback({ text: authenticationError(error), error: true });
    }).catch((error: unknown) => {
      if (!mounted || authChanged) return;
      setChecking(false);
      setFeedback({ text: authenticationError(error), error: true });
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  function switchMode(next: 'login' | 'forgot') {
    setMode(next);
    setPassword('');
    setConfirmation('');
    setFeedback(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = supabase;
    if (!client || busy) return;
    setFeedback(null);
    if (mode === 'reset' && (password.length < 12 || password !== confirmation)) {
      setFeedback({ text: 'Use pelo menos 12 caracteres e confirme a mesma senha nos dois campos.', error: true });
      return;
    }
    setBusy(true);
    try {
      if (mode === 'forgot') {
        const { error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin` });
        if (error) throw error;
        setFeedback({ text: 'Se houver uma conta elegível, você receberá as instruções por e-mail. Abra o link neste mesmo navegador.', error: false });
      } else if (mode === 'reset') {
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        setPassword('');
        setConfirmation('');
        setMode('login');
        setFeedback({ text: 'Senha atualizada. A alteração não concede permissões administrativas.', error: false });
      } else {
        const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        setPassword('');
      }
    } catch (error) {
      setFeedback({ text: authenticationError(error), error: true });
    } finally { setBusy(false); }
  }

  async function signOut() {
    if (!supabase || busy) return;
    setBusy(true);
    setFeedback(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setPassword('');
      setConfirmation('');
      setMode('login');
    } catch (error) { setFeedback({ text: authenticationError(error), error: true }); }
    finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-2">
      <aside className="industrial-grid relative flex flex-col justify-between overflow-hidden border-b border-border px-6 py-8 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-14">
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <Link to="/" className="relative w-fit" aria-label="Casa das Caldeiras, início"><Brand /></Link>
        <div className="relative max-w-md py-12 lg:py-20">
          <p className="eyebrow">Acesso restrito à equipe</p>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">O cuidado com<br />cada chegada.<br /><span className="text-primary">Em suas mãos.</span></h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted">Identificação, operação e responsabilidade. Um ponto de encontro entre a tradição industrial e a gestão contemporânea.</p>
          <div className="mt-9 flex items-center gap-3 border-t border-border pt-6 text-xs text-muted"><ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" /> Autenticação não substitui autorização.</div>
        </div>
        <p className="relative hidden text-xs uppercase tracking-[0.15em] text-muted lg:block">Casa das Caldeiras · Área administrativa</p>
      </aside>
      <main id="conteudo" className="flex items-center justify-center px-5 py-12 sm:px-10">
        <section className="w-full max-w-md">
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card"><LockKeyhole className="h-5 w-5 text-primary" aria-hidden="true" /></div>
          <p className="eyebrow">Identificação da equipe</p>
          <h2 className="mb-3 mt-3 text-3xl font-semibold">{mode === 'reset' ? 'Defina uma nova senha' : mode === 'forgot' ? 'Recuperar acesso' : session ? 'Sessão autenticada' : 'Bem-vindo de volta.'}</h2>
          <p className="mb-7 text-sm leading-6 text-muted">{mode === 'forgot' ? 'Informe o e-mail utilizado na sua conta autorizada.' : 'Utilize sua conta individual. Nunca compartilhe sua senha.'}</p>
          {!supabase && <div className="mb-6 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm leading-6 text-muted"><span className="font-medium text-foreground">Autenticação não configurada.</span> O acesso será habilitado após a configuração do serviço de contas. Nenhuma senha será recebida enquanto isso.</div>}
          {feedback && <div role={feedback.error ? 'alert' : 'status'} className={`mb-6 rounded-xl border p-4 text-sm leading-6 ${feedback.error ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-primary/30 bg-primary/5 text-foreground'}`}>{feedback.text}</div>}
          {checking ? (
            <div role="status" aria-label="Verificando sessão" className="space-y-4"><div className="h-12 animate-pulse rounded-xl bg-secondary" /><div className="h-12 animate-pulse rounded-xl bg-secondary" /><p className="text-sm text-muted">Verificando sessão…</p></div>
          ) : session && mode !== 'reset' ? (
            <div className="panel p-6">
              <p className="break-all text-sm font-medium">{session.user.email || 'Conta autenticada'}</p>
              <h3 className="mt-5 text-lg font-semibold">Painel ainda indisponível</h3>
              <p className="mb-6 mt-3 text-sm leading-6 text-muted">A identidade foi autenticada, mas a verificação das permissões administrativas no servidor ainda não está implementada. Por segurança, nenhum dado operacional é exibido.</p>
              <Button variant="secondary" className="w-full" loading={busy} onClick={signOut}>Encerrar sessão</Button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <fieldset disabled={!supabase || busy} className="space-y-5 disabled:opacity-60">
                <legend className="sr-only">{mode === 'reset' ? 'Nova senha' : 'Credenciais de acesso'}</legend>
                {mode !== 'reset' && <div><label htmlFor="email" className="field-label">E-mail corporativo</label><input id="email" type="email" className="field" autoComplete="username" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu.nome@empresa.com.br" /></div>}
                {mode !== 'forgot' && <div><label htmlFor="password" className="field-label">{mode === 'reset' ? 'Nova senha' : 'Senha'}</label><div className="relative"><input id="password" type={visible ? 'text' : 'password'} className="field pr-14" autoComplete={mode === 'reset' ? 'new-password' : 'current-password'} required minLength={mode === 'reset' ? 12 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={visible} onClick={() => setVisible(!visible)} className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:text-foreground">{visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button></div></div>}
                {mode === 'reset' && <div><label htmlFor="confirmation" className="field-label">Confirme a nova senha</label><input id="confirmation" type="password" className="field" autoComplete="new-password" required minLength={12} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /><p className="mt-2 text-xs text-muted">Use pelo menos 12 caracteres e uma senha exclusiva.</p></div>}
                <Button type="submit" className="w-full uppercase tracking-wide" loading={busy} disabled={!supabase}>{mode === 'forgot' ? 'Enviar instruções' : mode === 'reset' ? 'Salvar nova senha' : 'Entrar no sistema'}<ArrowUpRight size={17} aria-hidden="true" /></Button>
              </fieldset>
              {mode !== 'reset' && <Button variant="ghost" className="mt-3 w-full" disabled={busy} onClick={() => switchMode(mode === 'login' ? 'forgot' : 'login')}>{mode === 'login' ? 'Esqueci minha senha' : 'Voltar ao login'}</Button>}
            </form>
          )}
          <div className="mt-8 border-t border-border pt-6"><Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-foreground"><ArrowLeft size={15} aria-hidden="true" /> Voltar ao portal do visitante</Link></div>
        </section>
      </main>
    </div>
  );
}
