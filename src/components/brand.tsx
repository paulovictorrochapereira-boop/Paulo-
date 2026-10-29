import { Factory } from 'lucide-react';

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3 text-foreground">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
        <Factory className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="text-left">
        <span className="block font-display text-sm font-bold uppercase tracking-[0.12em]">Casa das Caldeiras</span>
        {!compact && <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-muted">Controle de acesso</span>}
      </span>
    </span>
  );
}
