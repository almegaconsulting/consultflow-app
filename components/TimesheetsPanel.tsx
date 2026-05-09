import type { Consultant, Project, Timesheet } from "../types/consultflow";

import {
  cell,
  formBox,
  input,
  primaryButton,
  table,
} from "../styles/commonStyles";

type TimesheetsPanelProps = {
  timesheets: Timesheet[];
  projects: Project[];
  consultants: Consultant[];

  timesheetProjectId: string;
  setTimesheetProjectId: (value: string) => void;

  timesheetConsultantId: string;
  setTimesheetConsultantId: (value: string) => void;

  timesheetDate: string;
  setTimesheetDate: (value: string) => void;

  timesheetHours: string;
  setTimesheetHours: (value: string) => void;

  timesheetDays: string;
  setTimesheetDays: (value: string) => void;

  timesheetStatus: string;
  setTimesheetStatus: (value: string) => void;

  createTimesheet: () => void;
  updateTimesheetStatus: (timesheetId: string, newStatus: string) => void;

  timesheetMessage: string;
};

export default function TimesheetsPanel({
  timesheets,
  projects,
  consultants,
  timesheetProjectId,
  setTimesheetProjectId,
  timesheetConsultantId,
  setTimesheetConsultantId,
  timesheetDate,
  setTimesheetDate,
  timesheetHours,
  setTimesheetHours,
  timesheetDays,
  setTimesheetDays,
  timesheetStatus,
  setTimesheetStatus,
  createTimesheet,
  updateTimesheetStatus,
  timesheetMessage,
}: TimesheetsPanelProps) {
  return (
    <>
      <h1>Timesheets</h1>

      <div style={formBox}>
        <h3>Crear nuevo timesheet</h3>

        <select
          value={timesheetProjectId}
          onChange={(e) => {
            const projectId = e.target.value;
            setTimesheetProjectId(projectId);

            const selectedProject = projects.find((p) => p.id === projectId);

            if (selectedProject?.consultant_id) {
              setTimesheetConsultantId(selectedProject.consultant_id);
            }
          }}
          style={input}
        >
          <option value="">Selecciona proyecto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <select
          value={timesheetConsultantId}
          onChange={(e) => setTimesheetConsultantId(e.target.value)}
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
          type="date"
          value={timesheetDate}
          onChange={(e) => setTimesheetDate(e.target.value)}
          style={input}
        />

        <input
          value={timesheetHours}
          onChange={(e) => setTimesheetHours(e.target.value)}
          placeholder="Horas"
          style={input}
        />

        <input
          value={timesheetDays}
          onChange={(e) => setTimesheetDays(e.target.value)}
          placeholder="Días facturables"
          style={input}
        />

        <select
          value={timesheetStatus}
          onChange={(e) => setTimesheetStatus(e.target.value)}
          style={input}
        >
          <option value="draft">draft</option>
          <option value="submitted">submitted</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="invoiced">invoiced</option>
        </select>

        <button onClick={createTimesheet} style={primaryButton}>
          Crear timesheet
        </button>

        <p>{timesheetMessage}</p>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>Fecha</th>
            <th style={cell}>Cliente</th>
            <th style={cell}>Proyecto</th>
            <th style={cell}>Consultor</th>
            <th style={cell}>Horas</th>
            <th style={cell}>Días</th>
            <th style={cell}>Estado</th>
          </tr>
        </thead>

        <tbody>
          {timesheets.map((t) => (
            <tr key={t.id}>
              <td style={cell}>{t.work_date}</td>
              <td style={cell}>{t.clients?.name || "Sin cliente"}</td>
              <td style={cell}>{t.projects?.name || "Sin proyecto"}</td>
              <td style={cell}>{t.consultants?.full_name || "Sin consultor"}</td>
              <td style={cell}>{t.hours}</td>
              <td style={cell}>{t.billable_days}</td>
              <td style={cell}>
                <select
                  value={t.status}
                  onChange={(e) =>
                    updateTimesheetStatus(t.id, e.target.value)
                  }
                  style={{
                    padding: 6,
                    fontWeight: "bold",
                    color:
                      t.status === "approved"
                        ? "green"
                        : t.status === "submitted"
                        ? "orange"
                        : t.status === "rejected"
                        ? "red"
                        : "black",
                  }}
                >
                  <option value="draft">draft</option>
                  <option value="submitted">submitted</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                  <option value="invoiced">invoiced</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}