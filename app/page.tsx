"use client";
import InvoicesPanel from "../components/InvoicesPanel";
import ConsultantsPanel from "../components/ConsultantsPanel";
import ClientsPanel from "../components/ClientsPanel";
import Dashboard from "../components/Dashboard";
import {
  card,
  formBox,
  input,
  primaryButton,
  table,
  cell,
  alertBox,
} from "../styles/commonStyles";
import type {
  Client,
  Consultant,
  Invoice,
  PurchaseOrder,
  Project,
  Timesheet,
} from "../types/consultflow";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import { supabase } from "../lib/supabaseClient";

const currency = "EUR";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(value);
}


export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const [newClientName, setNewClientName] = useState("");
  const [clientMessage, setClientMessage] = useState("");

  const [consultantName, setConsultantName] = useState("");
  const [consultantEmail, setConsultantEmail] = useState("");
  const [consultantProfile, setConsultantProfile] = useState("");
  const [consultantRate, setConsultantRate] = useState("");
  const [consultantMessage, setConsultantMessage] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectClientId, setProjectClientId] = useState("");
  const [projectConsultantId, setProjectConsultantId] = useState("");
  const [projectSellRate, setProjectSellRate] = useState("");
  const [projectCostRate, setProjectCostRate] = useState("");
  const [projectMessage, setProjectMessage] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceProjectId, setInvoiceProjectId] = useState("");
  const [invoicePOId, setInvoicePOId] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceTaxAmount, setInvoiceTaxAmount] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("pending");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [invoiceMessage, setInvoiceMessage] = useState("");

  const [poNumber, setPoNumber] = useState("");
  const [poProjectId, setPoProjectId] = useState("");
  const [poTotalAmount, setPoTotalAmount] = useState("");
  const [poStatus, setPoStatus] = useState("active");
  const [poStartDate, setPoStartDate] = useState("");
  const [poEndDate, setPoEndDate] = useState("");
  const [poMessage, setPoMessage] = useState("");

  const [timesheetProjectId, setTimesheetProjectId] = useState("");
  const [timesheetConsultantId, setTimesheetConsultantId] = useState("");
  const [timesheetDate, setTimesheetDate] = useState("");
  const [timesheetHours, setTimesheetHours] = useState("8");
  const [timesheetDays, setTimesheetDays] = useState("1");
  const [timesheetStatus, setTimesheetStatus] = useState("approved");
  const [timesheetMessage, setTimesheetMessage] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const { data: clientsData } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: consultantsData } = await supabase
      .from("consultants")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: inv } = await supabase
      .from("invoices")
      .select("*, clients(name)")
      .order("issue_date", { ascending: false });

    const { data: po } = await supabase
      .from("purchase_orders")
      .select("*, clients(name), projects(name)")
      .order("created_at", { ascending: false });

    const { data: proj } = await supabase
      .from("projects")
      .select("*, clients(name), consultants(full_name)")
      .order("created_at", { ascending: false });

    const { data: ts } = await supabase
      .from("timesheets")
      .select("*, clients(name), projects(name), consultants(full_name)")
      .order("work_date", { ascending: false });

    setClients((clientsData || []) as Client[]);
    setConsultants((consultantsData || []) as Consultant[]);
    setInvoices((inv || []) as Invoice[]);
    setPurchaseOrders((po || []) as PurchaseOrder[]);
    setProjects((proj || []) as Project[]);
    setTimesheets((ts || []) as Timesheet[]);
  }

  async function getFirstCompanyId() {
    const { data } = await supabase
      .from("companies")
      .select("id")
      .limit(1)
      .single();

    return data?.id;
  }

  async function createClient() {
    setClientMessage("");

    const companyId = await getFirstCompanyId();

    const { error } = await supabase.from("clients").insert({
      company_id: companyId,
      name: newClientName,
      status: "active",
    });

    if (error) {
      setClientMessage(error.message);
      return;
    }

    setClientMessage("Cliente creado correctamente.");
    setNewClientName("");
    loadAll();
  }

  async function createConsultant() {
    setConsultantMessage("");

    const companyId = await getFirstCompanyId();

    const { error } = await supabase.from("consultants").insert({
      company_id: companyId,
      full_name: consultantName,
      email: consultantEmail,
      profile: consultantProfile,
      cost_day_rate: Number(consultantRate),
      status: "active",
    });

    if (error) {
      setConsultantMessage(error.message);
      return;
    }

    setConsultantMessage("Consultor creado correctamente.");
    setConsultantName("");
    setConsultantEmail("");
    setConsultantProfile("");
    setConsultantRate("");
    loadAll();
  }

  async function createProject() {
    setProjectMessage("");

    if (!projectName.trim()) {
      setProjectMessage("El nombre del proyecto es obligatorio.");
      return;
    }

    if (!projectClientId) {
      setProjectMessage("Debes seleccionar un cliente.");
      return;
    }

    if (!projectConsultantId) {
      setProjectMessage("Debes seleccionar un consultor.");
      return;
    }

    const companyId = await getFirstCompanyId();

    const selectedClient = clients.find((c) => c.id === projectClientId);
    const selectedConsultant = consultants.find(
      (c) => c.id === projectConsultantId
    );

    const { error } = await supabase.from("projects").insert({
      company_id: companyId,
      client_id: projectClientId,
      consultant_id: projectConsultantId,
      name: projectName.trim(),
      status: "active",
      sell_day_rate: Number(projectSellRate),
      cost_day_rate:
        Number(projectCostRate) ||
        Number(selectedConsultant?.cost_day_rate || 0),
      start_date: new Date().toISOString().slice(0, 10),
    });

    if (error) {
      setProjectMessage(error.message);
      return;
    }

    setProjectMessage(
      `Proyecto creado correctamente para ${selectedClient?.name || "cliente"}.`
    );

    setProjectName("");
    setProjectClientId("");
    setProjectConsultantId("");
    setProjectSellRate("");
    setProjectCostRate("");
    loadAll();
  }

  async function createPurchaseOrder() {
    setPoMessage("");

    if (!poNumber.trim()) {
      setPoMessage("El número de PO es obligatorio.");
      return;
    }

    if (!poProjectId) {
      setPoMessage("Debes seleccionar un proyecto.");
      return;
    }

    if (!poTotalAmount) {
      setPoMessage("Debes introducir el importe total de la PO.");
      return;
    }

    const companyId = await getFirstCompanyId();
    const selectedProject = projects.find((p) => p.id === poProjectId);

    if (!selectedProject) {
      setPoMessage("No se encontró el proyecto seleccionado.");
      return;
    }

    const { error } = await supabase.from("purchase_orders").insert({
      company_id: companyId,
      client_id: selectedProject.client_id,
      project_id: poProjectId,
      po_number: poNumber.trim(),
      total_amount: Number(poTotalAmount),
      status: poStatus,
      start_date: poStartDate || null,
      end_date: poEndDate || null,
    });

    if (error) {
      setPoMessage(error.message);
      return;
    }

    setPoMessage("PO creada correctamente.");
    setPoNumber("");
    setPoProjectId("");
    setPoTotalAmount("");
    setPoStatus("active");
    setPoStartDate("");
    setPoEndDate("");
    loadAll();
  }

  async function createInvoice() {
    setInvoiceMessage("");

    if (!invoiceNumber.trim()) {
      setInvoiceMessage("El número de factura es obligatorio.");
      return;
    }

    if (!invoiceProjectId) {
      setInvoiceMessage("Debes seleccionar un proyecto.");
      return;
    }

    if (!invoiceAmount) {
      setInvoiceMessage("Debes introducir el importe.");
      return;
    }

    const companyId = await getFirstCompanyId();
    const selectedProject = projects.find((p) => p.id === invoiceProjectId);

    if (!selectedProject) {
      setInvoiceMessage("No se encontró el proyecto seleccionado.");
      return;
    }

    const { error } = await supabase.from("invoices").insert({
      company_id: companyId,
      client_id: selectedProject.client_id,
      project_id: invoiceProjectId,
      purchase_order_id: invoicePOId || null,
      invoice_number: invoiceNumber.trim(),
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: invoiceDueDate || null,
      amount: Number(invoiceAmount),
      tax_amount: Number(invoiceTaxAmount || 0),
      status: invoiceStatus,
    });

    if (error) {
      setInvoiceMessage(error.message);
      return;
    }

    setInvoiceMessage("Factura creada correctamente.");
    setInvoiceNumber("");
    setInvoiceProjectId("");
    setInvoicePOId("");
    setInvoiceAmount("");
    setInvoiceTaxAmount("");
    setInvoiceStatus("pending");
    setInvoiceDueDate("");
    loadAll();
  }

  async function updateInvoiceStatus(invoiceId: string, newStatus: string) {
    const { error } = await supabase
      .from("invoices")
      .update({ status: newStatus })
      .eq("id", invoiceId);

    if (error) {
      alert(error.message);
      return;
    }

    loadAll();
  }
async function updateTimesheetStatus(timesheetId: string, newStatus: string) {
  const { error } = await supabase
    .from("timesheets")
    .update({ status: newStatus })
    .eq("id", timesheetId);

  if (error) {
    alert(error.message);
    return;
  }

  loadAll();
}
  async function createTimesheet() {
    setTimesheetMessage("");

    if (!timesheetProjectId) {
      setTimesheetMessage("Debes seleccionar un proyecto.");
      return;
    }

    if (!timesheetConsultantId) {
      setTimesheetMessage("Debes seleccionar un consultor.");
      return;
    }

    if (!timesheetDate) {
      setTimesheetMessage("Debes seleccionar una fecha.");
      return;
    }

    const companyId = await getFirstCompanyId();
    const selectedProject = projects.find((p) => p.id === timesheetProjectId);

    if (!selectedProject) {
      setTimesheetMessage("No se encontró el proyecto seleccionado.");
      return;
    }

    const { error } = await supabase.from("timesheets").insert({
      company_id: companyId,
      client_id: selectedProject.client_id,
      project_id: timesheetProjectId,
      consultant_id: timesheetConsultantId,
      work_date: timesheetDate,
      hours: Number(timesheetHours),
      billable_days: Number(timesheetDays),
      status: timesheetStatus,
    });

    if (error) {
      setTimesheetMessage(error.message);
      return;
    }

    setTimesheetMessage("Timesheet creado correctamente.");
    setTimesheetProjectId("");
    setTimesheetConsultantId("");
    setTimesheetDate("");
    setTimesheetHours("8");
    setTimesheetDays("1");
    setTimesheetStatus("approved");
    loadAll();
  }

  function getConsumedAmount(poId: string) {
    return invoices
      .filter((i) => i.purchase_order_id === poId)
      .reduce((a, b) => a + b.total_amount, 0);
  }

  function getRemainingAmount(po: PurchaseOrder) {
    return po.total_amount - getConsumedAmount(po.id);
  }

  function getProjectRevenue(id: string) {
    return invoices
      .filter((i) => i.project_id === id)
      .reduce((a, b) => a + b.total_amount, 0);
  }

  function getProjectDays(id: string) {
    return timesheets
      .filter((t) => t.project_id === id)
      .reduce((a, b) => a + b.billable_days, 0);
  }

  function getProjectCost(p: Project) {
    return getProjectDays(p.id) * p.cost_day_rate;
  }

  function getMargin(p: Project) {
    return getProjectRevenue(p.id) - getProjectCost(p);
  }

  function getMarginPct(p: Project) {
    const rev = getProjectRevenue(p.id);
    if (rev === 0) return 0;
    return (getMargin(p) / rev) * 100;
  }

  async function askAI() {
    const res = await fetch("/api/ask-ai", {
      method: "POST",
      body: JSON.stringify({
        question,
        currency,
        invoices,
        purchaseOrders,
        projects,
        timesheets,
      }),
    });

    const data = await res.json();
    setAiResponse(data.answer || data.error);
  }

  function exportPDF() {
    const doc = new jsPDF();
    doc.text("ConsultFlow AI Report", 20, 20);
    const lines = doc.splitTextToSize(aiResponse, 170);
    doc.text(lines, 20, 40);
    doc.save("consultflow-report.pdf");
  }

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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
  activeMenu={activeMenu}
  setActiveMenu={setActiveMenu}
/>
      <main style={{ flex: 1, padding: 30 }}>
        {activeMenu === "dashboard" && (
  <Dashboard
    clients={clients}
    consultants={consultants}
    invoices={invoices}
    purchaseOrders={purchaseOrders}
    projects={projects}
    timesheets={timesheets}
    formatCurrency={formatCurrency}
    getConsumedAmount={getConsumedAmount}
    getProjectRevenue={getProjectRevenue}
    getMarginPct={getMarginPct}
  />
)}

        {activeMenu === "clientes" && (
  <ClientsPanel
    clients={clients}
    newClientName={newClientName}
    setNewClientName={setNewClientName}
    createClient={createClient}
    clientMessage={clientMessage}
  />
)}

        {activeMenu === "consultores" && (
  <ConsultantsPanel
    consultants={consultants}
    consultantName={consultantName}
    setConsultantName={setConsultantName}
    consultantEmail={consultantEmail}
    setConsultantEmail={setConsultantEmail}
    consultantProfile={consultantProfile}
    setConsultantProfile={setConsultantProfile}
    consultantRate={consultantRate}
    setConsultantRate={setConsultantRate}
    createConsultant={createConsultant}
    consultantMessage={consultantMessage}
    formatCurrency={formatCurrency}
  />
)}

        {activeMenu === "facturas" && (
  <InvoicesPanel
    invoices={invoices}
    projects={projects}
    purchaseOrders={purchaseOrders}
    invoiceNumber={invoiceNumber}
    setInvoiceNumber={setInvoiceNumber}
    invoiceProjectId={invoiceProjectId}
    setInvoiceProjectId={setInvoiceProjectId}
    invoicePOId={invoicePOId}
    setInvoicePOId={setInvoicePOId}
    invoiceAmount={invoiceAmount}
    setInvoiceAmount={setInvoiceAmount}
    invoiceTaxAmount={invoiceTaxAmount}
    setInvoiceTaxAmount={setInvoiceTaxAmount}
    invoiceDueDate={invoiceDueDate}
    setInvoiceDueDate={setInvoiceDueDate}
    invoiceStatus={invoiceStatus}
    setInvoiceStatus={setInvoiceStatus}
    createInvoice={createInvoice}
    updateInvoiceStatus={updateInvoiceStatus}
    invoiceMessage={invoiceMessage}
    formatCurrency={formatCurrency}
  />
)}

        {activeMenu === "pos" && (
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
        )}

        {activeMenu === "proyectos" && (
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

                  const selected = consultants.find(
                    (c) => c.id === consultantId
                  );

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
        )}

        {activeMenu === "timesheets" && (
          <>
            <h1>Timesheets</h1>

            <div style={formBox}>
              <h3>Crear nuevo timesheet</h3>

              <select
                value={timesheetProjectId}
                onChange={(e) => {
                  const projectId = e.target.value;
                  setTimesheetProjectId(projectId);

                  const selectedProject = projects.find(
                    (p) => p.id === projectId
                  );

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
                    <td style={cell}>
                      {t.consultants?.full_name || "Sin consultor"}
                    </td>
                    <td style={cell}>{t.hours}</td>
                    <td style={cell}>{t.billable_days}</td>
                    <td style={cell}>
  <select
    value={t.status}
    onChange={(e) => updateTimesheetStatus(t.id, e.target.value)}
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
        )}

        {activeMenu === "ia" && (
          <>
            <h1>ConsultFlow AI</h1>

            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Pregunta..."
              style={{ width: "60%", padding: 10 }}
            />

            <button
              onClick={askAI}
              style={{ marginLeft: 10, padding: "10px 15px" }}
            >
              Preguntar
            </button>

            {aiResponse && (
              <>
                <button
                  onClick={exportPDF}
                  style={{
                    marginTop: 20,
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
                    marginTop: 20,
                    padding: 20,
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                  }}
                >
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

