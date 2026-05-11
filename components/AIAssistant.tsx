import type { AIReport } from "../types/consultflow";
import type { Translation } from "../i18n/translations";

import {
  cell,
  input,
  primaryButton,
  table,
} from "../styles/commonStyles";

type AIAssistantProps = {
  question: string;
  setQuestion: (value: string) => void;

  aiResponse: string;
  setAiResponse: (value: string) => void;

  aiReports: AIReport[];

  askAI: () => void;

  exportPDF: () => void;

  t: Translation;
};

export default function AIAssistant({
  question,
  setQuestion,
  aiResponse,
  setAiResponse,
  aiReports,
  askAI,
  exportPDF,
  t,
}: AIAssistantProps) {
  return (
    <>
      <h1>{t.aiTitle}</h1>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.questionPlaceholder}
          style={{
            ...input,
            flex: 1,
          }}
        />

        <button onClick={askAI} style={primaryButton}>
          {t.ask}
        </button>

        <button onClick={exportPDF} style={primaryButton}>
          {t.exportPDF}
        </button>
      </div>

      <div
        style={{
          whiteSpace: "pre-wrap",
          background: "#f3f4f6",
          padding: 20,
          borderRadius: 8,
          marginBottom: 30,
        }}
      >
        {aiResponse}
      </div>

      <h2>{t.aiHistory}</h2>

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>{t.date}</th>
            <th style={cell}>{t.questionPlaceholder}</th>
            <th style={cell}>{t.action}</th>
          </tr>
        </thead>

        <tbody>
          {aiReports.map((report) => (
            <tr key={report.id}>
              <td style={cell}>
                {new Date(report.created_at).toLocaleString()}
              </td>

              <td style={cell}>{report.question}</td>

              <td style={cell}>
                <button
                  onClick={() =>
                    setAiResponse(report.response)
                  }
                  style={primaryButton}
                >
                  {t.open}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}