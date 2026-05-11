import type {
  Client,
  Consultant,
  Project,
} from "../types/consultflow";

import type { Translation } from "../i18n/translations";

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
  getProjectCost: (projectId: string) => number;
  getMargin: (projectId: string) => number;
  getMarginPct: (project: Project) => number;

  t: Translation;
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
  t,
}: ProjectsPanelProps) {
  return (
    <>
      <h1>{t.projects}</h1>

      <div style={formBox}>
        <h3>{t.createNewProject}</h3>

        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder={t.projectName}
          style={input}
        />

        <select
          value={projectClientId}
          onChange={(e) => setProjectClientId(e.target.value)}
          style={input}
        >
          <option value="">{t.selectClient}</option>

          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <select
          value={projectConsultantId}
          onChange={(e) => setProjectConsultantId(e.target.value)}
          style={input}
        >
          <option value="">{t.selectConsultant}</option>

          {consultants.map((consultant) => (
            <option key={consultant.id} value={consultant.id}>
              {consultant.full_name}
            </option>
          ))}
        </select>

        <input
          value={projectSellRate}
          onChange={(e) => setProjectSellRate(e.target.value)}
          placeholder={t.sellDayRate}
          type="number"
          style={input}
        />

        <input
          value={projectCostRate}
          onChange={(e) => setProjectCostRate(e.target.value)}
          placeholder={t.costDayRate}
          type="number"
          style={input}
        />

        <button onClick={createProject} style={primaryButton}>
          {t.createProject}
        </button>
      </div>

      {projectMessage && (
        <p style={{ marginBottom: 20 }}>{projectMessage}</p>
      )}

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>{t.project}</th>
            <th style={cell}>{t.client}</th>
            <th style={cell}>{t.consultants}</th>
            <th style={cell}>{t.revenue}</th>
            <th style={cell}>{t.cost}</th>
            <th style={cell}>{t.margin}</th>
            <th style={cell}>{t.marginPct}</th>
            <th style={cell}>{t.status}</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td style={cell}>{project.name}</td>

              <td style={cell}>
                {project.clients?.name || "-"}
              </td>

              <td style={cell}>
                {project.consultants?.full_name || "-"}
              </td>

              <td style={cell}>
                {formatCurrency(getProjectRevenue(project.id))}
              </td>

              <td style={cell}>
                {formatCurrency(getProjectCost(project.id))}
              </td>

              <td style={cell}>
                {formatCurrency(getMargin(project.id))}
              </td>

              <td style={cell}>
                {getMarginPct(project).toFixed(2)}%
              </td>

              <td style={cell}>{project.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}