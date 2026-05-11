import type {
  Consultant,
  Project,
  Timesheet,
} from "../types/consultflow";

import type { Translation } from "../i18n/translations";

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

  updateTimesheetStatus: (
    timesheetId: string,
    newStatus: string
  ) => void;

  timesheetMessage: string;

  t: Translation;
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
  t,
}: TimesheetsPanelProps) {
  return (
    <>
      <h1>{t.timesheets}</h1>

      <div style={formBox}>
        <h3>{t.createNewTimesheet}</h3>

        <select
          value={timesheetProjectId}
          onChange={(e) => setTimesheetProjectId(e.target.value)}
          style={input}
        >
          <option value="">{t.selectProject}</option>

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
          <option value="">
            {t.selectConsultantShort}
          </option>

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
          placeholder={t.workedHours}
          type="number"
          style={input}
        />

        <input
          value={timesheetDays}
          onChange={(e) => setTimesheetDays(e.target.value)}
          placeholder={t.billableDays}
          type="number"
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
        </select>

        <button onClick={createTimesheet} style={primaryButton}>
          {t.createTimesheet}
        </button>
      </div>

      {timesheetMessage && (
        <p style={{ marginBottom: 20 }}>
          {timesheetMessage}
        </p>
      )}

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>{t.project}</th>
            <th style={cell}>{t.consultant}</th>
            <th style={cell}>{t.date}</th>
            <th style={cell}>{t.workedHours}</th>
            <th style={cell}>{t.billableDays}</th>
            <th style={cell}>{t.status}</th>
          </tr>
        </thead>

        <tbody>
          {timesheets.map((timesheet) => (
            <tr key={timesheet.id}>
              <td style={cell}>
                {timesheet.projects?.name || "-"}
              </td>

              <td style={cell}>
                {timesheet.consultants?.full_name || "-"}
              </td>

              <td style={cell}>
                {timesheet.work_date}
              </td>

              <td style={cell}>
                {timesheet.hours}
              </td>

              <td style={cell}>
                {timesheet.billable_days}
              </td>

              <td style={cell}>
                <select
                  value={timesheet.status}
                  onChange={(e) =>
                    updateTimesheetStatus(
                      timesheet.id,
                      e.target.value
                    )
                  }
                  style={input}
                >
                  <option value="draft">draft</option>
                  <option value="submitted">
                    submitted
                  </option>
                  <option value="approved">
                    approved
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}