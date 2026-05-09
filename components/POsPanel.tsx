import type { Project, PurchaseOrder } from "../types/consultflow";

import {
  cell,
  formBox,
  input,
  primaryButton,
  table,
} from "../styles/commonStyles";

type POsPanelProps = {
  purchaseOrders: PurchaseOrder[];
  projects: Project[];

  poNumber: string;
  setPoNumber: (value: string) => void;

  poProjectId: string;
  setPoProjectId: (value: string) => void;

  poTotalAmount: string;
  setPoTotalAmount: (value: string) => void;

  poStartDate: string;
  setPoStartDate: (value: string) => void;

  poEndDate: string;
  setPoEndDate: (value: string) => void;

  poStatus: string;
  setPoStatus: (value: string) => void;

  createPurchaseOrder: () => void;
  poMessage: string;

  formatCurrency: (value: number) => string;
  getConsumedAmount: (poId: string) => number;
  getRemainingAmount: (po: PurchaseOrder) => number;
};

export default function POsPanel({
  purchaseOrders,
  projects,
  poNumber,
  setPoNumber,
  poProjectId,
  setPoProjectId,
  poTotalAmount,
  setPoTotalAmount,
  poStartDate,
  setPoStartDate,
  poEndDate,
  setPoEndDate,
  poStatus,
  setPoStatus,
  createPurchaseOrder,
  poMessage,
  formatCurrency,
  getConsumedAmount,
  getRemainingAmount,
}: POsPanelProps) {
  return (
    <>
      <h1>POs</h1>

      <div style={formBox}>
        <h3>Crear nueva PO</h3>

        <input
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          placeholder="Número PO"
          style={input}
        />

        <select
          value={poProjectId}
          onChange={(e) => setPoProjectId(e.target.value)}
          style={input}
        >
          <option value="">Selecciona proyecto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <input
          value={poTotalAmount}
          onChange={(e) => setPoTotalAmount(e.target.value)}
          placeholder="Importe total PO"
          style={input}
        />

        <input
          type="date"
          value={poStartDate}
          onChange={(e) => setPoStartDate(e.target.value)}
          style={input}
        />

        <input
          type="date"
          value={poEndDate}
          onChange={(e) => setPoEndDate(e.target.value)}
          style={input}
        />

        <select
          value={poStatus}
          onChange={(e) => setPoStatus(e.target.value)}
          style={input}
        >
          <option value="active">active</option>
          <option value="pending">pending</option>
          <option value="almost_used">almost_used</option>
          <option value="closed">closed</option>
        </select>

        <button onClick={createPurchaseOrder} style={primaryButton}>
          Crear PO
        </button>

        <p>{poMessage}</p>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>Cliente</th>
            <th style={cell}>Proyecto</th>
            <th style={cell}>PO</th>
            <th style={cell}>Total</th>
            <th style={cell}>Consumido</th>
            <th style={cell}>Restante</th>
            <th style={cell}>Inicio</th>
            <th style={cell}>Fin</th>
            <th style={cell}>Estado</th>
          </tr>
        </thead>

        <tbody>
          {purchaseOrders.map((po) => (
            <tr key={po.id}>
              <td style={cell}>{po.clients?.name || "Sin cliente"}</td>
              <td style={cell}>{po.projects?.name || "Sin proyecto"}</td>
              <td style={cell}>{po.po_number}</td>
              <td style={cell}>{formatCurrency(po.total_amount)}</td>
              <td style={cell}>{formatCurrency(getConsumedAmount(po.id))}</td>
              <td style={cell}>{formatCurrency(getRemainingAmount(po))}</td>
              <td style={cell}>{po.start_date || "-"}</td>
              <td style={cell}>{po.end_date || "-"}</td>
              <td style={cell}>{po.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}