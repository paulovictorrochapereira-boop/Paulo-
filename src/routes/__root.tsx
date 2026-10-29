import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
  errorComponent: ({ reset }) => (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <section className="panel w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-semibold">Não foi possível abrir esta página</h1>
        <p className="my-4 text-sm text-muted">Tente novamente. Nenhuma confirmação de acesso foi realizada.</p>
        <Button onClick={reset}>Tentar novamente</Button>
      </section>
    </main>
  ),
});

function Root() {
  return (
    <>
      <a href="#conteudo" className="sr-only z-50 rounded-lg bg-primary p-4 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Pular para o conteúdo</a>
      <Outlet />
    </>
  );
}

function NotFound() {
  return (
    <main id="conteudo" className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="panel max-w-lg p-10 text-center">
        <p className="eyebrow">Página não encontrada</p>
        <h1 className="my-4 text-3xl font-semibold">Vamos voltar à recepção?</h1>
        <p className="mb-6 text-muted">Este endereço não corresponde a uma página do portal.</p>
        <Link to="/" className="link-button">Voltar ao início</Link>
      </div>
    </main>
  );
}
