import { describe, expect, it } from 'vitest';
import { emptyDraft, normalizeDraft, validateDraft, type VisitorDraft } from './visitor-validation';

const valid: VisitorDraft = {
  fullName: 'João da Silva', visitorType: 'Visitante', host: '', reason: '',
  confirmed: true, privacyAcknowledged: true,
};

describe('preparação da identificação', () => {
  it('aceita nome completo e campos opcionais vazios', () => {
    expect(validateDraft(valid)).toEqual({});
  });
  it('aceita caracteres internacionais e nomes compostos', () => {
    expect(validateDraft({ ...valid, fullName: 'Ana-María D’Ávila' })).toEqual({});
  });
  it('normaliza espaços sem alterar o nome', () => {
    expect(normalizeDraft({ ...valid, fullName: '  João   da Silva  ' }).fullName).toBe('João da Silva');
  });
  it('rejeita nome incompleto e conteúdo inválido', () => {
    for (const fullName of ['João', 'João 123', '<script> Silva', 'João --']) {
      expect(validateDraft({ ...valid, fullName }).fullName).toBeTruthy();
    }
  });
  it('não aceita tipos de visitante arbitrários', () => {
    expect(validateDraft({ ...valid, visitorType: 'Administrador' }).visitorType).toBeTruthy();
  });
  it('exige as duas confirmações', () => {
    const errors = validateDraft({ ...valid, confirmed: false, privacyAcknowledged: false });
    expect(errors.confirmed).toBeTruthy();
    expect(errors.privacyAcknowledged).toBeTruthy();
  });
  it('limita os campos de texto livre', () => {
    const errors = validateDraft({ ...valid, host: 'a'.repeat(121), reason: 'a'.repeat(301) });
    expect(errors.host).toBeTruthy();
    expect(errors.reason).toBeTruthy();
  });
  it('não cria rascunhos compartilhados entre visitantes', () => {
    const first = emptyDraft();
    first.fullName = 'Outra Pessoa';
    expect(emptyDraft().fullName).toBe('');
  });
});
