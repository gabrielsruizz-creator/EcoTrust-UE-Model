/**
 * Baixa as taxas de IVA oficiais da base TEDB (Comissão Europeia, "Taxes in Europe Database") e grava
 * uma cópia em fontes/tedb/, para conferência e para os testes compararem com src/data/paises.
 *
 * Os dados da TEDB são enviados pelos próprios Estados-Membros. Serviço usado: VatRetrievalService
 * (https://ec.europa.eu/taxation_customs/tedb/ws/VatRetrievalService.wsdl).
 *
 * Uso (PowerShell ou terminal):
 *   node scripts/baixar-iva-tedb.mjs PT,MT,IT            → situação de hoje
 *   node scripts/baixar-iva-tedb.mjs PT,MT,IT 2026-11-13 → situação numa data
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENDERECO = 'https://ec.europa.eu/taxation_customs/tedb/ws/';
const NS_TIPOS = 'urn:ec.europa.eu:taxud:tedb:services:v1:IVatRetrievalService:types';

const [paisesArg, dataArg] = process.argv.slice(2);
if (!paisesArg) {
  console.error('Informe os países, por exemplo: node scripts/baixar-iva-tedb.mjs PT,MT,IT');
  process.exit(1);
}
const paises = paisesArg.split(',').map((p) => p.trim().toUpperCase());
const data = dataArg ?? new Date().toISOString().slice(0, 10);

const pedido = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:tedb:services:v1:IVatRetrievalService" xmlns:urn1="${NS_TIPOS}">
 <soapenv:Header/>
 <soapenv:Body>
  <urn:retrieveVatRatesReqMsg>
   <urn1:memberStates>${paises.map((p) => `<urn1:isoCode>${p}</urn1:isoCode>`).join('')}</urn1:memberStates>
   <urn1:situationOn>${data}</urn1:situationOn>
  </urn:retrieveVatRatesReqMsg>
 </soapenv:Body>
</soapenv:Envelope>`;

const resposta = await fetch(ENDERECO, {
  method: 'POST',
  headers: {
    'Content-Type': 'text/xml;charset=UTF-8',
    SOAPAction: '"urn:ec.europa.eu:taxud:tedb:services:v1:VatRetrievalService/RetrieveVatRates"',
  },
  body: pedido,
});
const xml = await resposta.text();
if (!resposta.ok) {
  console.error(`A TEDB respondeu ${resposta.status}:\n${xml.slice(0, 500)}`);
  process.exit(1);
}

const decodificar = (texto) =>
  texto
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

/** Primeiro valor de uma tag dentro de um trecho do XML (sem prefixo de namespace). */
const campo = (trecho, tag) => {
  const m = new RegExp(`<(?:\\w+:)?${tag}>([\\s\\S]*?)</(?:\\w+:)?${tag}>`).exec(trecho);
  return m ? decodificar(m[1].trim()) : null;
};

const registros = [...xml.matchAll(/<(?:\w+:)?vatRateResults>([\s\S]*?)<\/(?:\w+:)?vatRateResults>/g)].map(([, r]) => {
  const taxa = campo(r, 'rate') ?? '';
  const categoria = campo(r, 'category');
  return {
    pais: campo(r, 'memberState'),
    tipo: campo(r, 'type'),
    tipoTaxa: campo(taxa, 'type'),
    percentual: campo(taxa, 'value') === null ? null : Number(campo(taxa, 'value')),
    // Data da versão do registro na TEDB (não é a data em que a taxa começou a valer).
    versaoEm: (campo(r, 'situationOn') ?? '').slice(0, 10),
    categoria: categoria ? campo(categoria, 'identifier') : null,
    // O comentário oficial pode ser longo; guardamos o começo, que identifica a regra.
    comentario: (campo(r, 'comment') ?? '').replace(/\s+/g, ' ').slice(0, 400) || null,
  };
});

registros.sort((a, b) =>
  `${a.pais}${a.categoria ?? ''}${a.percentual}${a.comentario ?? ''}`.localeCompare(
    `${b.pais}${b.categoria ?? ''}${b.percentual}${b.comentario ?? ''}`,
  ),
);

const pasta = join(dirname(fileURLToPath(import.meta.url)), '..', 'fontes', 'tedb');
mkdirSync(pasta, { recursive: true });
const arquivo = join(pasta, `iva-${paises.join('-')}.json`);
writeFileSync(
  arquivo,
  `${JSON.stringify({ fonte: ENDERECO, consultadoEm: new Date().toISOString().slice(0, 10), situacaoEm: data, paises, registros }, null, 1)}\n`,
);
console.log(`${registros.length} registros gravados em ${arquivo}`);
