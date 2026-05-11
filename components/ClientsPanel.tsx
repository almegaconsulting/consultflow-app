import type { Client } from "../types/consultflow";

import type { Translation } from "../i18n/translations";

import {
  cell,
  formBox,
  input,
  primaryButton,
  table,
} from "../styles/commonStyles";

type ClientsPanelProps = {
  clients: Client[];

  newClientName: string;
  setNewClientName: (value: string) => void;

  createClient: () => void;

  clientMessage: string;

  t: Translation;
};

export default function ClientsPanel({
  clients,
  newClientName,
  setNewClientName,
  createClient,
  clientMessage,
  t,
}: ClientsPanelProps) {
  return (
    <>
      <h1>{t.clients}</h1>

      <div style={formBox}>
        <input
          value={newClientName}
          onChange={(e) => setNewClientName(e.target.value)}
          placeholder={t.clientName}
          style={input}
        />

        <button onClick={createClient} style={primaryButton}>
          {t.createClient}
        </button>
      </div>

      {clientMessage && (
        <p style={{ marginBottom: 20 }}>{clientMessage}</p>
      )}

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>{t.name}</th>
            <th style={cell}>{t.status}</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td style={cell}>{client.name}</td>
              <td style={cell}>{client.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}