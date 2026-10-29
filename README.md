# Casa das Caldeiras — controle de acesso

## Estado da entrega: parte 1 de 3

Base React + TypeScript + Vite + TanStack Router + Tailwind. Não é uma implantação operacional completa. Não há registros fictícios, painel acessível por senha universal, captura de RG nem confirmação simulada de presença.

### Implementado

- Portal público responsivo com identidade industrial e imagem de referência não documental.
- Formulário local de identificação, validação, revisão, edição e descarte em memória.
- Bloqueio do fluxo com convite enquanto a validação segura de tokens não existir.
- Login, recuperação, alteração de senha no fluxo de recuperação e logout utilizando os métodos reais do Supabase, quando configurado.
- Bloqueio integral do painel operacional: uma sessão autenticada não é tratada como autorização administrativa.
- Aviso de privacidade específico desta etapa.
- Testes unitários de validação.

### Não implementado nesta etapa

Persistência de visitantes, autorização por função, MFA na interface, geração/validação de QR Codes, cadastros administrativos, movimentações, importações, auditoria, relatórios, indicadores, atualização em tempo real e conteúdo histórico verificado. Nenhuma tabela, consulta ou migração foi definida sem a estrutura real do serviço conectado.

Parte 2 prevista: conexão e estrutura real de dados, autorização no servidor, políticas de acesso, credenciamento persistente, convites e movimentações transacionais.

Parte 3 prevista: módulos complementares, importações, relatórios, publicação institucional e validação de segurança ponta a ponta.

## Desenvolvimento

Requer Node.js 22.12 ou superior e npm compatível.

```sh
npm install
npm run dev
npm run test
npm run build
npm run preview
```

A instalação gera o lockfile; mantenha-o versionado para builds reproduzíveis. Os testes foram incluídos no código, mas sua execução e os testes de navegador devem integrar a validação da implantação.

O roteamento é baseado em código. As páginas estão em `src/routes`, combinadas em `src/router.tsx`. Não é necessário gerar `routeTree.gen.ts`.

## Autenticação opcional

Sem configuração, o portal funciona e o formulário de login permanece desabilitado. Não há login local alternativo.

1. Copie `.env.example` para `.env`.
2. Preencha `VITE_SUPABASE_URL` com o endereço HTTPS do projeto.
3. Preencha `VITE_SUPABASE_PUBLISHABLE_KEY` somente com a chave publicável `sb_publishable_...`.
4. Configure no serviço de autenticação os endereços de redirecionamento exatos, incluindo `https://SEU-DOMINIO/admin` e o endereço local de desenvolvimento quando necessário.
5. Configure SMTP, política de senha, limites de tentativas, tempo de sessão e proteção contra abuso no serviço. Não confie em limites apenas no navegador.
6. Desative cadastro público de contas administrativas. Contas de equipe precisam de provisionamento controlado e, em etapa posterior, atribuição de funções pelo servidor.
7. Reinicie o desenvolvimento ou gere um novo build após mudar variáveis.

Nunca use `service_role`, chaves secretas ou credenciais de banco em variáveis `VITE_*`. Todas elas são incorporadas ao código entregue ao navegador.

A recuperação usa PKCE: abra o e-mail no mesmo navegador que iniciou a solicitação. O evento `PASSWORD_RECOVERY` habilita a troca da senha. Valide entrega de e-mail, expiração, redirecionamentos e recuperação completa antes da operação.

O login não libera informações administrativas. O painel só poderá ser implementado com verificação real de autorização na API e políticas de acesso correspondentes. Não derive privilégios de campos editáveis pelo usuário.

## Dados e privacidade

O rascunho do visitante existe apenas no estado React. Nenhum documento é solicitado. Revisar não transmite nem salva dados. O botão final está desabilitado de propósito: não existe uma confirmação de sucesso falsa.

Os parâmetros `token` e `convite` são tratados como não confiáveis. Sua presença bloqueia o formulário até existir validação no servidor. Não são exibidos nem registrados em logs pelo aplicativo. Na implantação, configure o proxy e o monitoramento para não registrar tokens de URL.

O aviso de privacidade não é uma política jurídica final. Definir controlador, contato, fundamento legal, retenção, descarte e fornecedores antes de habilitar coleta.

A fotografia externa é uma referência estética, não uma fotografia documental confirmada da Casa das Caldeiras. Não foram publicados fatos históricos sem fonte. Para a página institucional, revisar fontes oficiais e direitos de uso de fotografias antes da publicação.

## Implantação da base

- Execute `npm run test` e `npm run build`.
- Publique `dist` em hospedagem HTTPS com fallback de rotas para `index.html`.
- Aplique `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, proteção contra enquadramento e HSTS no servidor, conforme o domínio.
- Defina e teste uma Content Security Policy que permita somente os recursos necessários, inclusive o endpoint HTTPS de autenticação e a imagem externa se mantida.
- Não habilite analytics ou gravação de sessão nos formulários sem uma avaliação de privacidade.
- Atualmente as áreas são `/` e `/admin` em uma aplicação. A publicação em dois subdomínios independentes e a API compartilhada pertencem às etapas seguintes. Não trate redirecionamento ou ocultação de menus como controle de acesso.
- O servidor de `vite preview` serve para inspeção do build, não para hospedar a operação.

## Validação obrigatória antes da operação

Os testes unitários atuais cobrem somente validação local. Ainda são necessários testes reais de autenticação e recuperação, RLS/autorização direta na API, isolamento entre perfis, MFA, expiração e revogação de convites, validação no servidor, criptografia de documentos, idempotência, concorrência de entradas/saídas, horários de servidor, atualização em tempo real, exportações autorizadas, auditoria, backups e restauração.

Verificar também teclado, leitores de tela, contraste, dispositivos móveis, links diretos, falhas de rede e limpeza de sessão em dispositivo compartilhado. Não liberar a base atual como sistema operacional de controle de acesso.
