import type { Client, Consultant, Project } from "../types/consultflow";

import {
  cell,
  formBox,
  input,
  primaryButton,
  table,
} from "../styles/commonStyles";

type ProjectsPanelProps = {
  clients: Client[];
  consultants: Consultant[];
  projects: Project[];

  projectName: string;
  setProjectName: (value: string) => void;

  projectClientId: string;
  setProjectClientId: (value: string) => void;

  projectConsultantId: string;
  setProjectConsultantId: (value: string) => void;

  projectSellRate: string;
  setProjectSellRate: (value: string) => void;

  projectCostRate: string;
  setProjectCostRate: (value: string) => void;

  createProject: () => void;
  projectMessage: string;

  formatCurrency: (value: number) => string;
  getProjectRevenue: (projectId: string) => number;
  getProjectCost: (project: Project) => number;
  getMargin: (project: Project) => number;
  getMarginPct: (project: Project) => number;
};

export default function ProjectsPanel({
  clients,
  consultants,
  projects,
  projectName,
  setProjectName,
  projectClientId,
  setProjectClientId,
  projectConsultantId,
  setProjectConsultantId,
  projectSellRate,
  setProjectSellRate,
  projectCostRate,
  setProjectCostRate,
  createProject,
  projectMessage,
  formatCurrency,
  getProjectRevenue,
  getProjectCost,
  getMargin,
  getMarginPct,
}: ProjectsPanelProps) {
  return (
    <>
      <h1>Proyectos</h1>

      <div style={formBox}>
        <h3>Crear nuevo proyecto</h3>

        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Nombre del proyecto"
          style={input}
        />

        <select
          value={projectClientId}
          onChange={(e) => setProjectClientId(e.target.value)}
          style={input}
        >
          <option value="">Selecciona cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <select
          value={projectConsultantId}
          onChange={(e) => {
            const consultantId = e.target.value;

            setProjectConsultantId(consultantId);

            const selected = consultants.find((c) => c.id === consultantId);

            if (selected?.cost_day_rate) {
              setProjectCostRate(String(selected.cost_day_rate));
            }
          }}
          style={input}
        >
          <option value="">Selecciona consultor</option>
          {consultants.map((consultant) => (
            <option key={consultant.id} value={consultant.id}>
              {consultant.full_name}
            </option>
          ))}
        </select>

        <input
          value={projectSellRate}
          onChange={(e) => setProjectSellRate(e.target.value)}
          placeholder="Tarifa venta día"
          style={input}
        />

        <input
          value={projectCostRate}
          onChange={(e) => setProjectCostRate(e.target.value)}
          placeholder="Tarifa coste día"
          style={input}
        />

        <button onClick={createProject} style={primaryButton}>
          Crear proyecto
        </button>

        <p>{projectMessage}</p>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>Cliente</th>
            <th style={cell}>Proyecto</th>
            <th style={cell}>Consultor</th>
            <th style={cell}>Venta día</th>
            <th style={cell}>Coste día</th>
            <th style={cell}>Ingresos</th>
            <th style={cell}>Coste</th>
            <th style={cell}>Margen</th>
            <th style={cell}>Margen %</th>
            <th style={cell}>Estado</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td style={cell}>{p.clients?.name || "Sin cliente"}</td>
              <td style={cell}>{p.name}</td>
              <td style={cell}>
                {p.consultants?.full_name || "Sin consultor"}
              </td>
              <td style={cell}>{formatCurrency(p.sell_day_rate || 0)}</td>
              <td style={cell}>{formatCurrency(p.cost_day_rate || 0)}</td>
              <td style={cell}>{formatCurrency(getProjectRevenue(p.id))}</td>
              <td style={cell}>{formatCurrency(getProjectCost(p))}</td>
              <td style={cell}>{formatCurrency(getMargin(p))}</td>
              <td style={cell}>{getMarginPct(p).toFixed(2)}%</td>
              <td style={cell}>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}