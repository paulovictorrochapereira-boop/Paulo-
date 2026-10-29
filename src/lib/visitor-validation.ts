export const visitorTypes = ['Visitante', 'Convidado', 'Prestador de serviços'] as const;
export type VisitorType = (typeof visitorTypes)[number];
export type VisitorDraft = {
  fullName: string;
  visitorType: string;
  host: string;
  reason: string;
  confirmed: boolean;
  privacyAcknowledged: boolean;
};
export type DraftErrors = Partial<Record<keyof VisitorDraft, string>>;

export function emptyDraft(): VisitorDraft {
  return { fullName: '', visitorType: '', host: '', reason: '', confirmed: false, privacyAcknowledged: false };
}

export function normalizeDraft(draft: VisitorDraft): VisitorDraft {
  return {
    ...draft,
    fullName: draft.fullName.trim().replace(/\s+/g, ' '),
    host: draft.host.trim(),
    reason: draft.reason.trim(),
  };
}

export function validateDraft(input: VisitorDraft): DraftErrors {
  const draft = normalizeDraft(input);
  const errors: DraftErrors = {};
  const words = draft.fullName.split(' ').filter(Boolean);
  if (words.length < 2 || words.some((word) => !/\p{L}/u.test(word)) || !/^[\p{L}\p{M} '\u2019.\-]+$/u.test(draft.fullName)) {
    errors.fullName = 'Informe seu nome completo, sem números ou símbolos inválidos.';
  } else if (draft.fullName.length > 120) {
    errors.fullName = 'O nome deve ter no máximo 120 caracteres.';
  }
  if (!visitorTypes.includes(draft.visitorType as VisitorType)) errors.visitorType = 'Selecione um tipo de visitante.';
  if (draft.host.length > 120) errors.host = 'Informe no máximo 120 caracteres.';
  if (draft.reason.length > 300) errors.reason = 'Informe no máximo 300 caracteres.';
  if (!draft.confirmed) errors.confirmed = 'Confirme a conferência das informações.';
  if (!draft.privacyAcknowledged) errors.privacyAcknowledged = 'Leia o aviso de privacidade antes de continuar.';
  return errors;
}
