import { useRef, useState, type FormEvent } from 'react';
import { createRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, ClipboardCheck, Info, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Route as rootRoute } from './__root';
import { Brand } from '@/components/brand';
import { Button } from '@/components/ui/button';
import { emptyDraft, normalizeDraft, validateDraft, visitorTypes, type DraftErrors, type VisitorDraft } from '@/lib/visitor-validation';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/credenciamento',
  validateSearch: (search: Record<string, unknown>): { token?: string; convite?: string } => ({
    token: typeof search.token === 'string' ? search.token : undefined,
    convite: typeof search.convite === 'string' ? search.convite : undefined,
  }),
  component: Registration,
});

function Registration() {
  const search = Route.useSearch();
  const [draft, setDraft] = useState<VisitorDraft>(emptyDraft);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [reviewing, setReviewing] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const hasInvitation = search.token !== undefined || search.convite !== undefined;

  function change<K extends keyof VisitorDraft>(field: K, value: VisitorDraft[K]) {
    setDraft((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      document.getElementById(first)?.focus();
      return;
    }
    setDraft(normalizeDraft(draft));
    setReviewing(true);
    requestAnimationFrame(() => heading.current?.focus());
  }

  function clear() {
    setDraft(emptyDraft());
    setErrors({});
    setReviewing(false);
    requestAnimationFrame(() => heading.current?.focus());
  }

  function error(field: keyof VisitorDraft) {
    return errors[field] ? <p id={`${field}-error`} className="mt-2 text-sm text-destructive" role="alert">{errors[field]}</p> : null;
  }

  return (
    <div className="industrial-grid min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 md:px-10"><Link to="/" aria-label="Voltar ao início"><Brand /></Link><Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-foreground"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao portal</Link></header>
      <main id="conteudo" className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-8 md:px-10 lg:grid-cols-[0.7fr_1fr]">
        <aside className="lg:pt-7">
          <p className="eyebrow">Portal do visitante</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">Uma boa experiência<br /><span className="text-primary">começa aqui.</span></h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted">Confira os campos da sua identificação. A confirmação de entrada será realizada pela equipe da recepção, nunca pelo formulário.</p>
          <ol aria-label="Etapas do credenciamento" className="mt-9 space-y-6">
            {['Identificação', 'Revisão dos dados', 'Envio e confirmação'].map((label, index) => (
              <li key={label} aria-current={index === (reviewing ? 1 : 0) ? 'step' : undefined} className={`flex items-center gap-4 text-sm ${index === (reviewing ? 1 : 0) ? 'text-foreground' : 'text-muted'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${index === (reviewing ? 1 : 0) ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}>0{index + 1}</span>{label}{index === 2 && <LockKeyhole size={13} aria-label="Etapa indisponível" />}</li>
            ))}
          </ol>
          <div className="mt-9 flex max-w-sm items-start gap-3 border-t border-border pt-6 text-xs leading-6 text-muted"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><p>Nenhum RG ou CPF é solicitado nesta etapa. Evite documentos pessoais no motivo da visita.</p></div>
        </aside>

        <section className="panel p-6 shadow-industrial sm:p-8">
          <div className="mb-7 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm leading-6"><Info className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><p className="text-muted"><span className="font-medium text-foreground">Envio ainda indisponível.</span> Os campos ficam apenas na memória desta página. Revisar não cria cadastro, convite ou autorização de entrada.</p></div>
          {hasInvitation ? (
            <div role="status" className="py-5">
              <LockKeyhole className="mb-5 h-9 w-9 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-semibold">Convite não validado</h2>
              <p className="mb-6 mt-3 text-sm leading-7 text-muted">A validação de convites ainda não está disponível. Não é possível confirmar a validade ou aceitar este código. Procure a recepção ou a organização antes de continuar.</p>
              <Link to="/" className="link-button">Voltar ao portal</Link>
            </div>
          ) : reviewing ? (
            <div className="animate-arrive">
              <ClipboardCheck className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />
              <h2 ref={heading} tabIndex={-1} className="text-2xl font-semibold">Confira sua identificação</h2>
              <p className="mb-6 mt-2 text-sm text-muted">Revisão local. Nada foi enviado.</p>
              <dl className="divide-y divide-border">
                {[
                  ['Nome completo', draft.fullName], ['Tipo de visitante', draft.visitorType],
                  ['Pessoa ou setor', draft.host || 'Não informado'], ['Motivo da visita', draft.reason || 'Não informado'],
                  ['Empresa', 'Seleção disponível após configuração'], ['Situação', 'Rascunho não enviado'],
                ].map(([label, value]) => <div key={label} className="py-4"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">{value}</dd></div>)}
              </dl>
              <Button className="mt-6 w-full" disabled aria-describedby="send-unavailable"><LockKeyhole size={16} aria-hidden="true" /> Confirmar cadastro</Button>
              <p id="send-unavailable" className="mt-3 text-xs leading-5 text-muted">A confirmação será habilitada quando o serviço seguro de credenciamento estiver configurado.</p>
              <div className="mt-5 flex flex-wrap gap-2"><Button variant="secondary" onClick={() => { setReviewing(false); requestAnimationFrame(() => heading.current?.focus()); }}>Editar informações</Button><Button variant="ghost" onClick={clear}>Descartar rascunho</Button></div>
            </div>
          ) : (
            <form noValidate onSubmit={review}>
              <h2 ref={heading} tabIndex={-1} className="text-2xl font-semibold">Sua identificação</h2>
              <p className="mb-7 mt-2 text-sm text-muted">Campos com * são necessários para a revisão.</p>
              <div className="space-y-5">
                <div><label htmlFor="fullName" className="field-label">Nome completo *</label><input id="fullName" className="field" autoComplete="name" maxLength={120} required value={draft.fullName} onChange={(e) => change('fullName', e.target.value)} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? 'fullName-error' : undefined} placeholder="Como você se chama?" />{error('fullName')}</div>
                <div><label htmlFor="visitorType" className="field-label">Tipo de visitante *</label><select id="visitorType" className="field" required value={draft.visitorType} onChange={(e) => change('visitorType', e.target.value)} aria-invalid={!!errors.visitorType} aria-describedby={errors.visitorType ? 'visitorType-error' : undefined}><option value="">Selecione uma opção</option>{visitorTypes.map((type) => <option key={type}>{type}</option>)}</select>{error('visitorType')}</div>
                <div><label htmlFor="company" className="field-label">Empresa vinculada</label><select id="company" className="field" disabled aria-describedby="company-help"><option>Lista de empresas ainda indisponível</option></select><p id="company-help" className="mt-2 text-xs leading-5 text-muted">As empresas e a opção de visita sem vínculo dependem da política definida pela organização.</p></div>
                <div><label htmlFor="host" className="field-label">Pessoa ou setor que receberá você <span className="text-xs text-muted">· opcional</span></label><input id="host" className="field" maxLength={120} value={draft.host} onChange={(e) => change('host', e.target.value)} aria-invalid={!!errors.host} aria-describedby={errors.host ? 'host-error' : undefined} placeholder="Pessoa ou setor" />{error('host')}</div>
                <div><label htmlFor="reason" className="field-label">Motivo da visita <span className="text-xs text-muted">· opcional</span></label><textarea id="reason" className="field min-h-24 resize-y" maxLength={300} value={draft.reason} onChange={(e) => change('reason', e.target.value)} aria-invalid={!!errors.reason} aria-describedby={errors.reason ? 'reason-error' : undefined} placeholder="Descreva brevemente, sem documentos pessoais" />{error('reason')}</div>
                <div className="border-t border-border pt-5">
                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-6"><input id="confirmed" type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-primary" checked={draft.confirmed} onChange={(e) => change('confirmed', e.target.checked)} aria-invalid={!!errors.confirmed} aria-describedby={errors.confirmed ? 'confirmed-error' : undefined} />Conferi as informações preenchidas.</label>{error('confirmed')}
                  <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-6"><input id="privacyAcknowledged" type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-primary" checked={draft.privacyAcknowledged} onChange={(e) => change('privacyAcknowledged', e.target.checked)} aria-invalid={!!errors.privacyAcknowledged} aria-describedby={errors.privacyAcknowledged ? 'privacyAcknowledged-error' : undefined} /><span>Li o <Link to="/privacidade" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">aviso de privacidade (abre em nova aba)</Link> e entendi que esta etapa não envia o cadastro.</span></label>{error('privacyAcknowledged')}
                </div>
              </div>
              <Button type="submit" className="mt-7 w-full">Revisar informações <ArrowRight size={16} aria-hidden="true" /></Button>
              <Button variant="ghost" className="mt-2 w-full" onClick={clear}>Limpar campos</Button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
