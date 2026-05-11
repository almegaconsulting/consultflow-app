import type { Project, PurchaseOrder } from "../types/consultflow";

import type { Translation } from "../i18n/translations";

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

  t: Translation;
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
  t,
}: POsPanelProps) {
  return (
    <>
      <h1>{t.purchaseOrders}</h1>

      <div style={formBox}>
        <h3>{t.createNewPO}</h3>

        <input
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          placeholder={t.poNumber}
          style={input}
        />

        <select
          value={poProjectId}
          onChange={(e) => setPoProjectId(e.target.value)}
          style={input}
        >
          <option value="">{t.selectProject}</option>

          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <input
          value={poTotalAmount}
          onChange={(e) => setPoTotalAmount(e.target.value)}
          placeholder={t.totalPOAmount}
          type="number"
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
          <option value="closed">closed</option>
        </select>

        <button onClick={createPurchaseOrder} style={primaryButton}>
          {t.createPO}
        </button>
      </div>

      {poMessage && <p style={{ marginBottom: 20 }}>{poMessage}</p>}

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>{t.poNumber}</th>
            <th style={cell}>{t.project}</th>
            <th style={cell}>{t.total}</th>
            <th style={cell}>{t.consumed}</th>
            <th style={cell}>{t.remaining}</th>
            <th style={cell}>{t.startDate}</th>
            <th style={cell}>{t.endDate}</th>
            <th style={cell}>{t.status}</th>
          </tr>
        </thead>

        <tbody>
          {purchaseOrders.map((po) => (
            <tr key={po.id}>
              <td style={cell}>{po.po_number}</td>

              <td style={cell}>{po.projects?.name || "-"}</td>

              <td style={cell}>
                {formatCurrency(po.total_amount || 0)}
              </td>

              <td style={cell}>
                {formatCurrency(getConsumedAmount(po.id))}
              </td>

              <td style={cell}>
                {formatCurrency(getRemainingAmount(po))}
              </td>

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