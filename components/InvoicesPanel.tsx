import type { Invoice, Project, PurchaseOrder } from "../types/consultflow";
import type { Translation } from "../i18n/translations";

import {
  cell,
  formBox,
  input,
  primaryButton,
  table,
} from "../styles/commonStyles";

type InvoicesPanelProps = {
  invoices: Invoice[];
  projects: Project[];
  purchaseOrders: PurchaseOrder[];

  invoiceNumber: string;
  setInvoiceNumber: (value: string) => void;

  invoiceProjectId: string;
  setInvoiceProjectId: (value: string) => void;

  invoicePOId: string;
  setInvoicePOId: (value: string) => void;

  invoiceAmount: string;
  setInvoiceAmount: (value: string) => void;

  invoiceTaxAmount: string;
  setInvoiceTaxAmount: (value: string) => void;

  invoiceDueDate: string;
  setInvoiceDueDate: (value: string) => void;

  invoiceStatus: string;
  setInvoiceStatus: (value: string) => void;

  createInvoice: () => void;
  updateInvoiceStatus: (invoiceId: string, newStatus: string) => void;

  invoiceMessage: string;
  formatCurrency: (value: number) => string;

  t: Translation;
};

export default function InvoicesPanel({
  invoices,
  projects,
  purchaseOrders,
  invoiceNumber,
  setInvoiceNumber,
  invoiceProjectId,
  setInvoiceProjectId,
  invoicePOId,
  setInvoicePOId,
  invoiceAmount,
  setInvoiceAmount,
  invoiceTaxAmount,
  setInvoiceTaxAmount,
  invoiceDueDate,
  setInvoiceDueDate,
  invoiceStatus,
  setInvoiceStatus,
  createInvoice,
  updateInvoiceStatus,
  invoiceMessage,
  formatCurrency,
  t,
}: InvoicesPanelProps) {
  return (
    <>
      <h1>{t.invoices}</h1>

      <div style={formBox}>
        <h3>{t.createNewInvoice}</h3>

        <input
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          placeholder={t.invoiceNumber}
          style={input}
        />

        <select
          value={invoiceProjectId}
          onChange={(e) => setInvoiceProjectId(e.target.value)}
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
          value={invoicePOId}
          onChange={(e) => setInvoicePOId(e.target.value)}
          style={input}
        >
          <option value="">{t.withoutPO}</option>
          {purchaseOrders.map((po) => (
            <option key={po.id} value={po.id}>
              {po.po_number}
            </option>
          ))}
        </select>

        <input
          value={invoiceAmount}
          onChange={(e) => setInvoiceAmount(e.target.value)}
          placeholder={t.taxableBase}
          type="number"
          style={input}
        />

        <input
          value={invoiceTaxAmount}
          onChange={(e) => setInvoiceTaxAmount(e.target.value)}
          placeholder={t.vat}
          type="number"
          style={input}
        />

        <input
          type="date"
          value={invoiceDueDate}
          onChange={(e) => setInvoiceDueDate(e.target.value)}
          style={input}
        />

        <select
          value={invoiceStatus}
          onChange={(e) => setInvoiceStatus(e.target.value)}
          style={input}
        >
          <option value="draft">draft</option>
          <option value="pending">pending</option>
          <option value="overdue">overdue</option>
          <option value="paid">paid</option>
        </select>

        <button onClick={createInvoice} style={primaryButton}>
          {t.createInvoice}
        </button>
      </div>

      {invoiceMessage && <p style={{ marginBottom: 20 }}>{invoiceMessage}</p>}

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>{t.client}</th>
            <th style={cell}>{t.invoice}</th>
            <th style={cell}>{t.taxableBase}</th>
            <th style={cell}>{t.vat}</th>
            <th style={cell}>{t.total}</th>
            <th style={cell}>{t.dueDate}</th>
            <th style={cell}>{t.status}</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((i) => (
            <tr key={i.id}>
              <td style={cell}>{i.clients?.name || "-"}</td>
              <td style={cell}>{i.invoice_number}</td>
              <td style={cell}>{formatCurrency(i.amount || 0)}</td>
              <td style={cell}>{formatCurrency(i.tax_amount || 0)}</td>
              <td style={cell}>{formatCurrency(i.total_amount || 0)}</td>
              <td style={cell}>{i.due_date || "-"}</td>
              <td style={cell}>
                <select
                  value={i.status}
                  onChange={(e) => updateInvoiceStatus(i.id, e.target.value)}
                  style={{
                    padding: 6,
                    fontWeight: "bold",
                    color:
                      i.status === "overdue"
                        ? "red"
                        : i.status === "paid"
                        ? "green"
                        : i.status === "pending"
                        ? "orange"
                        : "black",
                  }}
                >
                  <option value="draft">draft</option>
                  <option value="pending">pending</option>
                  <option value="overdue">overdue</option>
                  <option value="paid">paid</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}