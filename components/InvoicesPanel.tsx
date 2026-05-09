import type { Invoice, Project, PurchaseOrder } from "../types/consultflow";

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
}: InvoicesPanelProps) {
  return (
    <>
      <h1>Facturas</h1>

      <div style={formBox}>
        <h3>Crear nueva factura</h3>

        <input
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          placeholder="Número factura"
          style={input}
        />

        <select
          value={invoiceProjectId}
          onChange={(e) => setInvoiceProjectId(e.target.value)}
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
          value={invoicePOId}
          onChange={(e) => setInvoicePOId(e.target.value)}
          style={input}
        >
          <option value="">Sin PO</option>
          {purchaseOrders.map((po) => (
            <option key={po.id} value={po.id}>
              {po.po_number}
            </option>
          ))}
        </select>

        <input
          value={invoiceAmount}
          onChange={(e) => setInvoiceAmount(e.target.value)}
          placeholder="Base imponible"
          style={input}
        />

        <input
          value={invoiceTaxAmount}
          onChange={(e) => setInvoiceTaxAmount(e.target.value)}
          placeholder="IVA"
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
          Crear factura
        </button>

        <p>{invoiceMessage}</p>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={cell}>Cliente</th>
            <th style={cell}>Factura</th>
            <th style={cell}>Base</th>
            <th style={cell}>IVA</th>
            <th style={cell}>Total</th>
            <th style={cell}>Vencimiento</th>
            <th style={cell}>Estado</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((i) => (
            <tr key={i.id}>
              <td style={cell}>{i.clients?.name || "Sin cliente"}</td>
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