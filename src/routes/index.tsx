import { createRoute, Link } from '@tanstack/react-router';
import { ArrowDown, ArrowRight, Fingerprint, LockKeyhole, QrCode, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { Route as rootRoute } from './__root';
import { Brand } from '@/components/brand';

export const Route = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="relative z-10 border-b border-white/10 bg-background/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-10">
          <Link to="/" aria-label="Casa das Caldeiras, início"><Brand /></Link>
          <nav aria-label="Navegação principal" className="flex items-center gap-4 sm:gap-7">
            <a href="#como-funciona" className="hidden text-sm text-muted transition hover:text-foreground sm:block">Como funciona</a>
            <Link to="/admin" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-xs font-medium text-foreground transition hover:border-primary">
              <LockKeyhole size={14} aria-hidden="true" /> Área administrativa
            </Link>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <section className="relative isolate overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-20 bg-secondary">
            <img src="https://images.unsplash.com/photo-1513828583688-c52646f42da7?auto=format&fit=crop&w=2200&q=85" alt="" referrerPolicy="no-referrer" fetchPriority="high" className="h-full w-full object-cover object-center opacity-45 grayscale" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background/20" />
          <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24 lg:grid-cols-[1.4fr_0.7fr] lg:items-end">
            <div className="animate-arrive max-w-3xl">
              <p className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-background/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Patrimônio · Experiência · Tecnologia
              </p>
              <h1 className="font-display text-5xl font-bold uppercase leading-[0.98] tracking-tight sm:text-7xl lg:text-[88px]">Casa das<br /><span className="text-primary">Caldeiras.</span></h1>
              <div className="my-8 h-1 w-16 bg-primary" />
              <h2 className="text-xl font-medium sm:text-2xl">Sua experiência começa na chegada.</h2>
              <p className="mt-4 max-w-md text-base leading-7 text-muted">Tradição industrial, patrimônio histórico e experiências únicas.</p>
              <p className="mt-2 text-sm text-muted">Controle de acesso de visitantes.</p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link to="/credenciamento" search={{ token: undefined, convite: undefined }} className="link-button uppercase tracking-wide">Iniciar credenciamento <ArrowRight size={18} aria-hidden="true" /></Link>
                <span className="flex items-center gap-2 text-xs text-muted"><ShieldCheck size={16} className="text-primary" aria-hidden="true" /> Identificação com responsabilidade</span>
              </div>
              <p className="mt-5 max-w-lg text-xs leading-5 text-muted">Portal em preparação. O envio de cadastros ainda não está disponível; a próxima etapa permite revisar os campos, sem transmitir os dados.</p>
            </div>

            <aside className="panel relative max-w-md overflow-hidden bg-background/80 p-7 shadow-industrial backdrop-blur-sm">
              <div className="absolute left-0 top-0 h-1 w-20 bg-primary" />
              <QrCode className="mb-6 h-9 w-9 text-primary" strokeWidth={1.4} aria-hidden="true" />
              <p className="eyebrow">Uma chegada mais simples</p>
              <h2 className="mb-3 mt-3 text-xl font-semibold">Recebeu um convite?</h2>
              <p className="text-sm leading-6 text-muted">Quando o credenciamento estiver habilitado, utilize o QR Code fornecido pela organização. Seu convite será validado antes do cadastro.</p>
              <div className="mt-6 border-t border-border pt-5 text-xs leading-5 text-muted">A leitura de um QR Code não autoriza a entrada física. Aguarde sempre a orientação da recepção.</div>
            </aside>
          </div>
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 pb-6 text-[10px] uppercase tracking-[0.14em] text-muted md:px-10">
            <a href="#como-funciona" className="inline-flex min-h-11 items-center gap-2 hover:text-foreground"><ArrowDown size={14} aria-hidden="true" /> Conheça o processo</a>
            <span>Imagem de referência industrial · não documental</span>
          </div>
        </section>

        <section id="como-funciona" className="industrial-grid border-b border-border">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
              <div><p className="eyebrow">Do convite à recepção</p><h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Cada etapa, no seu tempo.</h2></div>
              <p className="max-w-sm text-sm leading-6 text-muted">Cadastro e presença são informações distintas. Sua entrada depende da confirmação da equipe autorizada.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { number: '01', icon: QrCode, title: 'Acesse o portal', description: 'Utilize o endereço oficial ou o convite enviado pela organização.' },
                { number: '02', icon: Fingerprint, title: 'Informe o necessário', description: 'Confira sua identificação e a finalidade do tratamento dos dados antes de enviar.' },
                { number: '03', icon: UserRoundCheck, title: 'Apresente-se à recepção', description: 'A equipe verifica o credenciamento e confirma a entrada no local.' },
              ].map(({ number, icon: Icon, title, description }) => (
                <article key={number} className="panel p-7 transition hover:border-primary/40">
                  <div className="mb-8 flex items-center justify-between"><Icon className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden="true" /><span className="font-display text-3xl text-muted/40">{number}</span></div>
                  <h3 className="mb-3 text-lg font-semibold">{title}</h3><p className="text-sm leading-6 text-muted">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto flex max-w-7xl flex-col justify-between gap-7 px-5 py-12 md:flex-row md:items-center md:px-10">
          <div className="flex max-w-xl items-start gap-4"><ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-primary" aria-hidden="true" /><div><h2 className="text-lg font-semibold">Privacidade desde o primeiro contato.</h2><p className="mt-2 text-sm leading-6 text-muted">Documentos pessoais não são solicitados nesta etapa. Não envie RG, CPF ou senhas em campos de texto livre.</p></div></div>
          <Link to="/privacidade" className="inline-flex min-h-11 items-center gap-3 text-sm font-medium hover:text-primary">Sobre seus dados <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      </main>
      <footer className="border-t border-border px-5 py-7 md:px-10"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5"><Brand compact /><p className="text-xs text-muted">Portal do visitante · Casa das Caldeiras</p></div></footer>
    </div>
  );
}
