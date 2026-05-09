import type { Client } from "../types/consultflow";

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
};

export default function ClientsPanel({
  clients,
  newClientName,
  setNewClientName,
  createClient,
  clientMessage,
}: ClientsPanelProps) {
  return (
    <>
      <h1>Clientes</h1>

      <div style={formBox}>
        <input
          value={newClientName}
          onChange={(e) => setNewClientName(e.target.value)}
          placeholder="Nombre cliente"
          style={input}
        />

        <button onClick={createClient} style={primaryButton}>
          Crear cliente
        </button>

        <p>{clientMessage}</p>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>Nombre</th>
            <th style={cell}>Estado</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td style={cell}>{c.name}</td>
              <td style={cell}>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}