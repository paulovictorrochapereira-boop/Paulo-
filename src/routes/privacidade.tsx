import { createRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Route as rootRoute } from './__root';
import { Brand } from '@/components/brand';

export const Route = createRoute({ getParentRoute: () => rootRoute, path: '/privacidade', component: Privacy });

function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-5xl px-5 py-6 md:px-10"><Link to="/" aria-label="Casa das Caldeiras, início"><Brand /></Link></header>
      <main id="conteudo" className="mx-auto max-w-3xl px-5 py-10 md:py-16">
        <ShieldCheck className="mb-6 h-10 w-10 text-primary" strokeWidth={1.5} aria-hidden="true" />
        <p className="eyebrow">Transparência e responsabilidade</p>
        <h1 className="mb-6 mt-4 font-display text-4xl font-semibold">Aviso de privacidade</h1>
        <div className="mb-9 rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm leading-7 text-muted">Este aviso descreve apenas a etapa atual de preparação do portal. A política operacional definitiva deve ser aprovada e publicada pela organização antes da abertura do credenciamento.</div>
        <div className="space-y-8">
          {[
            ['Identificação do visitante', 'Os campos da página de credenciamento são mantidos somente na memória da página, para revisão local. Não são enviados a um serviço de cadastro nem gravados pelo aplicativo no armazenamento local. Ao sair da página ou recarregá-la, o rascunho é descartado. O navegador pode oferecer recursos próprios de preenchimento automático.'],
            ['Minimização de dados', 'Não há coleta de RG, CPF, endereço residencial ou imagem de documento nesta etapa. Não inclua esses dados nos campos de pessoa, setor ou motivo da visita. Revisar informações não significa concluir um credenciamento ou confirmar presença.'],
            ['Contas administrativas', 'Quando o serviço de autenticação estiver configurado, as credenciais serão transmitidas ao Supabase para autenticação. O aplicativo não cria uma tabela de senhas. O serviço mantém a sessão no navegador; utilize o encerramento de sessão ao terminar, especialmente em dispositivos compartilhados.'],
            ['Recursos externos', 'A fotografia de referência da página inicial é carregada do serviço de imagens Unsplash. Essa requisição transmite informações técnicas de conexão, como endereço IP. Antes da operação, a organização deve revisar os fornecedores envolvidos e os requisitos aplicáveis.'],
            ['Antes da abertura do serviço', 'Ainda precisam ser definidos e publicados: identificação do controlador, canal de atendimento ao titular, base legal, finalidade operacional, prazo de retenção, compartilhamentos, procedimento de correção e exclusão e responsáveis pela proteção dos dados. A confirmação de leitura deste aviso não substitui essa definição nem constitui uma autorização genérica para tratamento.'],
          ].map(([title, text]) => <section key={title} className="border-t border-border pt-6"><h2 className="mb-3 text-lg font-semibold">{title}</h2><p className="text-sm leading-7 text-muted">{text}</p></section>)}
        </div>
        <Link to="/" className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-xl border border-border px-5 text-sm hover:border-primary"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao portal</Link>
      </main>
    </div>
  );
}
