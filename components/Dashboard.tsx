import type {
  Client,
  Consultant,
  Invoice,
  Project,
  PurchaseOrder,
  Timesheet,
} from "../types/consultflow";

import { alertBox, card } from "../styles/commonStyles";

type DashboardProps = {
  clients: Client[];
  consultants: Consultant[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  projects: Project[];
  timesheets: Timesheet[];
  formatCurrency: (value: number) => string;
  getConsumedAmount: (poId: string) => number;
  getProjectRevenue: (projectId: string) => number;
  getMarginPct: (project: Project) => number;
};

export default function Dashboard({
  clients,
  consultants,
  invoices,
  purchaseOrders,
  projects,
  timesheets,
  formatCurrency,
  getConsumedAmount,
  getProjectRevenue,
  getMarginPct,
}: DashboardProps) {
  const totalFacturado = invoices.reduce((a, b) => a + b.total_amount, 0);
  const totalPOs = purchaseOrders.reduce((a, b) => a + b.total_amount, 0);
  const totalDias = timesheets.reduce((a, b) => a + b.billable_days, 0);

  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  const pendingTimesheets = timesheets.filter((t) => t.status === "submitted");

  const lowMarginProjects = projects.filter((p) => {
    const revenue = getProjectRevenue(p.id);
    if (revenue === 0) return false;
    return getMarginPct(p) < 20;
  });

  const almostConsumedPOs = purchaseOrders.filter((po) => {
    const consumed = getConsumedAmount(po.id);
    if (po.total_amount === 0) return false;
    return (consumed / po.total_amount) * 100 >= 80;
  });

  return (
    <>
      <h1>Dashboard</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {overdueInvoices.length > 0 && (
          <div style={alertBox}>
            ⚠ {overdueInvoices.length} factura(s) vencida(s)
          </div>
        )}

        {pendingTimesheets.length > 0 && (
          <div style={alertBox}>
            ⚠ {pendingTimesheets.length} timesheet(s) pendientes de aprobación
          </div>
        )}

        {lowMarginProjects.length > 0 && (
          <div style={alertBox}>
            ⚠ {lowMarginProjects.length} proyecto(s) con margen inferior al 20%
          </div>
        )}

        {almostConsumedPOs.length > 0 && (
          <div style={alertBox}>
            ⚠ {almostConsumedPOs.length} PO(s) consumidas por encima del 80%
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={card}>
          <strong>Clientes</strong>
          <p>{clients.length}</p>
        </div>

        <div style={card}>
          <strong>Consultores</strong>
          <p>{consultants.length}</p>
        </div>

        <div style={card}>
          <strong>Proyectos</strong>
          <p>{projects.length}</p>
        </div>

        <div style={card}>
          <strong>Total facturado</strong>
          <p>{formatCurrency(totalFacturado)}</p>
        </div>

        <div style={card}>
          <strong>Total POs</strong>
          <p>{formatCurrency(totalPOs)}</p>
        </div>

        <div style={card}>
          <strong>Días trabajados</strong>
          <p>{totalDias}</p>
        </div>
      </div>
    </>
  );
}