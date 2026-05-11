import type { Consultant } from "../types/consultflow";

import type { Translation } from "../i18n/translations";

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

  t: Translation;
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
  t,
}: ConsultantsPanelProps) {
  return (
    <>
      <h1>{t.consultants}</h1>

      <div style={formBox}>
        <input
          value={consultantName}
          onChange={(e) => setConsultantName(e.target.value)}
          placeholder={t.consultantName}
          style={input}
        />

        <input
          value={consultantEmail}
          onChange={(e) => setConsultantEmail(e.target.value)}
          placeholder={t.consultantEmail}
          style={input}
        />

        <input
          value={consultantProfile}
          onChange={(e) => setConsultantProfile(e.target.value)}
          placeholder={t.consultantProfile}
          style={input}
        />

        <input
          value={consultantRate}
          onChange={(e) => setConsultantRate(e.target.value)}
          placeholder={t.consultantRate}
          type="number"
          style={input}
        />

        <button onClick={createConsultant} style={primaryButton}>
          {t.createConsultant}
        </button>
      </div>

      {consultantMessage && (
        <p style={{ marginBottom: 20 }}>{consultantMessage}</p>
      )}

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>{t.name}</th>
            <th style={cell}>{t.consultantEmail}</th>
            <th style={cell}>{t.profile}</th>
            <th style={cell}>{t.dayCost}</th>
            <th style={cell}>{t.status}</th>
          </tr>
        </thead>

        <tbody>
          {consultants.map((consultant) => (
            <tr key={consultant.id}>
              <td style={cell}>{consultant.full_name}</td>

              <td style={cell}>{consultant.email}</td>

              <td style={cell}>{consultant.profile}</td>

              <td style={cell}>
                {formatCurrency(consultant.cost_day_rate)}
              </td>

              <td style={cell}>{consultant.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}