# Meu Treino — PWA

Aplicativo web instalável para acompanhar o plano de retorno à musculação, checklist de séries, cargas/repetições, cronômetro, histórico e medidas. A interface está em português e os registros são guardados no `localStorage` do navegador deste aparelho.

## Como usar agora no computador

Para testar localmente, rode um servidor estático na pasta do projeto (não abra apenas o arquivo `index.html`, porque service workers precisam de localhost ou HTTPS).

Com Python instalado:
```bash
python -m http.server 8080
```
Acesse `http://localhost:8080`.

## Como instalar no Android

Uma PWA precisa ser publicada em um endereço HTTPS para instalar e funcionar offline de forma confiável no Android.

1. Publique o conteúdo desta pasta em um serviço de hospedagem estática com HTTPS (por exemplo, GitHub Pages, Netlify ou Cloudflare Pages).
2. Abra a URL publicada no Chrome do Android.
3. Toque em **Instalar** se o botão aparecer, ou abra o menu do Chrome e escolha **Instalar app** / **Adicionar à tela inicial**.
4. Abra o app pelo ícone. Os dados ficam no armazenamento local desse navegador/aparelho.

## Funcionalidades

- Navegação entre semanas 1–52.
- Fase de readaptação (semanas 1–2), consolidação (3–4) e progressão (5+).
- Quatro treinos principais por semana; sábado opcional a partir da semana 3.
- Registro de carga e repetições por série.
- Checklist de séries e conclusão do treino.
- Cronômetro de descanso com predefinições.
- Histórico de treinos, peso e cintura.
- Exportação de backup JSON.
- Cache offline via service worker.

## Limitações e segurança

- Os dados ficam no navegador local. Limpar os dados do navegador pode apagar o histórico. Exporte backups regularmente.
- O cronômetro simples não garante contagem precisa se o navegador ficar suspenso em segundo plano.
- O app não sincroniza entre dispositivos e não substitui avaliação médica ou acompanhamento de profissional de educação física.
- O plano usa adaptações conservadoras devido ao relato de desconforto no joelho e na lombar. Não é diagnóstico. Suspenda movimentos que agravem sintomas e procure avaliação profissional antes de progredir para cargas altas, sobretudo se os sintomas persistirem.
- Sintomas neurológicos progressivos, alterações de controle da bexiga/intestino, dormência na região genital ou dor intensa exigem atendimento médico urgente.
- O uso de minoxidil oral deve ser acompanhado pelo profissional que o prescreveu; procure atendimento se tiver dor no peito, desmaio, falta de ar incomum, palpitações persistentes ou inchaço importante.

## Personalização futura

O projeto é vanilla HTML/CSS/JS, sem dependências. Edite `app.js` para mudar exercícios, séries, repetições e descrições.
