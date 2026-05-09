import type { Consultant } from "../types/consultflow";

import {
  cell,
  formBox,
  input,
  primaryButton,
  table,
} from "../styles/commonStyles";

type ConsultantsPanelProps = {
  consultants: Consultant[];
  consultantName: string;
  setConsultantName: (value: string) => void;
  consultantEmail: string;
  setConsultantEmail: (value: string) => void;
  consultantProfile: string;
  setConsultantProfile: (value: string) => void;
  consultantRate: string;
  setConsultantRate: (value: string) => void;
  createConsultant: () => void;
  consultantMessage: string;
  formatCurrency: (value: number) => string;
};

export default function ConsultantsPanel({
  consultants,
  consultantName,
  setConsultantName,
  consultantEmail,
  setConsultantEmail,
  consultantProfile,
  setConsultantProfile,
  consultantRate,
  setConsultantRate,
  createConsultant,
  consultantMessage,
  formatCurrency,
}: ConsultantsPanelProps) {
  return (
    <>
      <h1>Consultores</h1>

      <div style={formBox}>
        <input
          value={consultantName}
          onChange={(e) => setConsultantName(e.target.value)}
          placeholder="Nombre"
          style={input}
        />

        <input
          value={consultantEmail}
          onChange={(e) => setConsultantEmail(e.target.value)}
          placeholder="Email"
          style={input}
        />

        <input
          value={consultantProfile}
          onChange={(e) => setConsultantProfile(e.target.value)}
          placeholder="Perfil / Tecnología"
          style={input}
        />

        <input
          value={consultantRate}
          onChange={(e) => setConsultantRate(e.target.value)}
          placeholder="Coste día"
          style={input}
        />

        <button onClick={createConsultant} style={primaryButton}>
          Crear consultor
        </button>

        <p>{consultantMessage}</p>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>Nombre</th>
            <th style={cell}>Email</th>
            <th style={cell}>Perfil</th>
            <th style={cell}>Coste día</th>
          </tr>
        </thead>

        <tbody>
          {consultants.map((c) => (
            <tr key={c.id}>
              <td style={cell}>{c.full_name}</td>
              <td style={cell}>{c.email}</td>
              <td style={cell}>{c.profile}</td>
              <td style={cell}>{formatCurrency(c.cost_day_rate || 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}