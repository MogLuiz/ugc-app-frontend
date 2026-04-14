/**
 * Responde ao GET que o Chrome DevTools faz em dev (evita "No route matches" no servidor).
 * Conteúdo vazio em JSON é suficiente para o cliente ignorar.
 */
export default function WellKnownChromeDevtoolsRoute() {
  return null;
}
