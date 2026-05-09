import ReactMarkdown from "react-markdown";

import type { AIReport } from "../types/consultflow";

import {
  cell,
  formBox,
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
};

export default function AIAssistant({
  question,
  setQuestion,
  aiResponse,
  setAiResponse,
  aiReports,
  askAI,
  exportPDF,
}: AIAssistantProps) {
  return (
    <>
      <h1>ConsultFlow AI</h1>

      <div style={formBox}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pregunta..."
          style={{
            ...input,
            width: "60%",
          }}
        />

        <button onClick={askAI} style={primaryButton}>
          Preguntar
        </button>
      </div>

      {aiResponse && (
        <>
          <button
            onClick={exportPDF}
            style={{
              marginBottom: 20,
              padding: "10px 15px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Exportar PDF
          </button>

          <div
            style={{
              padding: 20,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: 8,
              lineHeight: 1.6,
              marginBottom: 40,
            }}
          >
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </div>
        </>
      )}

      <h2>Histórico IA</h2>

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>Fecha</th>
            <th style={cell}>Pregunta</th>
            <th style={cell}>Acción</th>
          </tr>
        </thead>

        <tbody>
          {aiReports.map((report) => (
            <tr key={report.id}>
              <td style={cell}>
                {new Date(report.created_at).toLocaleString("es-ES")}
              </td>

              <td style={cell}>{report.question}</td>

              <td style={cell}>
                <button
                  onClick={() => setAiResponse(report.answer)}
                  style={primaryButton}
                >
                  Abrir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}