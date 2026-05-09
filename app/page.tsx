"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";

import { supabase } from "../lib/supabaseClient";

import type {
  AIReport,
  Client,
  Consultant,
  Invoice,
  Project,
  PurchaseOrder,
  Timesheet,
} from "../types/consultflow";

import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import ClientsPanel from "../components/ClientsPanel";
import ConsultantsPanel from "../components/ConsultantsPanel";
import InvoicesPanel from "../components/InvoicesPanel";
import ProjectsPanel from "../components/ProjectsPanel";
import TimesheetsPanel from "../components/TimesheetsPanel";
import POsPanel from "../components/POsPanel";
import AIAssistant from "../components/AIAssistant";

const currency = "EUR";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(value || 0);
}

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
const [aiReports, setAiReports] = useState<AIReport[]>([]);

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

    const { data: invoicesData } = await supabase
      .from("invoices")
      .select("*, clients(name)")
      .order("issue_date", { ascending: false });

    const { data: purchaseOrdersData } = await supabase
      .from("purchase_orders")
      .select("*, clients(name), projects(name)")
      .order("created_at", { ascending: false });

    const { data: projectsData } = await supabase
      .from("projects")
      .select("*, clients(name), consultants(full_name)")
      .order("created_at", { ascending: false });

    const { data: timesheetsData } = await supabase
      .from("timesheets")
      .select("*, clients(name), projects(name), consultants(full_name)")
      .order("work_date", { ascending: false });
const { data: aiReportsData } = await supabase
  .from("ai_reports")
  .select("*")
  .order("created_at", { ascending: false });

    setClients((clientsData || []) as Client[]);
    setConsultants((consultantsData || []) as Consultant[]);
    setInvoices((invoicesData || []) as Invoice[]);
    setPurchaseOrders((purchaseOrdersData || []) as PurchaseOrder[]);
    setProjects((projectsData || []) as Project[]);
    setTimesheets((timesheetsData || []) as Timesheet[]);
setAiReports((aiReportsData || []) as AIReport[]);
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

    if (!newClientName.trim()) {
      setClientMessage("El nombre del cliente es obligatorio.");
      return;
    }

    const companyId = await getFirstCompanyId();

    const { error } = await supabase.from("clients").insert({
      company_id: companyId,
      name: newClientName.trim(),
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

    if (!consultantName.trim()) {
      setConsultantMessage("El nombre del consultor es obligatorio.");
      return;
    }

    if (!consultantEmail.trim()) {
      setConsultantMessage("El email es obligatorio.");
      return;
    }

    const companyId = await getFirstCompanyId();

    const { error } = await supabase.from("consultants").insert({
      company_id: companyId,
      full_name: consultantName.trim(),
      email: consultantEmail.trim(),
      profile: consultantProfile.trim(),
      cost_day_rate: Number(consultantRate || 0),
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

    const selectedConsultant = consultants.find(
      (c) => c.id === projectConsultantId
    );

    const { error } = await supabase.from("projects").insert({
      company_id: companyId,
      client_id: projectClientId,
      consultant_id: projectConsultantId,
      name: projectName.trim(),
      status: "active",
      sell_day_rate: Number(projectSellRate || 0),
      cost_day_rate:
        Number(projectCostRate) ||
        Number(selectedConsultant?.cost_day_rate || 0),
      start_date: new Date().toISOString().slice(0, 10),
    });

    if (error) {
      setProjectMessage(error.message);
      return;
    }

    setProjectMessage("Proyecto creado correctamente.");
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

  function getConsumedAmount(poId: string) {
    return invoices
      .filter((i) => i.purchase_order_id === poId)
      .reduce((a, b) => a + b.total_amount, 0);
  }

  function getRemainingAmount(po: PurchaseOrder) {
    return po.total_amount - getConsumedAmount(po.id);
  }

  function getProjectRevenue(projectId: string) {
    return invoices
      .filter((i) => i.project_id === projectId)
      .reduce((a, b) => a + b.total_amount, 0);
  }

  function getProjectDays(projectId: string) {
    return timesheets
      .filter((t) => t.project_id === projectId)
      .reduce((a, b) => a + b.billable_days, 0);
  }

  function getProjectCost(project: Project) {
    return getProjectDays(project.id) * project.cost_day_rate;
  }

  function getMargin(project: Project) {
    return getProjectRevenue(project.id) - getProjectCost(project);
  }

  function getMarginPct(project: Project) {
    const revenue = getProjectRevenue(project.id);

    if (revenue === 0) return 0;

    return (getMargin(project) / revenue) * 100;
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

    const aiData = await res.json();
    const answer = aiData.answer || aiData.error || "Sin respuesta de IA";

    setAiResponse(answer);

    const companyId = await getFirstCompanyId();

    await supabase.from("ai_reports").insert({
      company_id: companyId,
      question,
      answer,
    });
  }

  function exportPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("ConsultFlow - Informe IA", 15, 20);

    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 15, 30);

    doc.setFontSize(12);

    const text = aiResponse || "No hay informe generado todavía.";
    const lines = doc.splitTextToSize(text, 180);

    let y = 45;

    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(line, 15, y);
      y += 7;
    });

    doc.save("consultflow-informe-ia.pdf");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

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
          <POsPanel
            purchaseOrders={purchaseOrders}
            projects={projects}
            poNumber={poNumber}
            setPoNumber={setPoNumber}
            poProjectId={poProjectId}
            setPoProjectId={setPoProjectId}
            poTotalAmount={poTotalAmount}
            setPoTotalAmount={setPoTotalAmount}
            poStartDate={poStartDate}
            setPoStartDate={setPoStartDate}
            poEndDate={poEndDate}
            setPoEndDate={setPoEndDate}
            poStatus={poStatus}
            setPoStatus={setPoStatus}
            createPurchaseOrder={createPurchaseOrder}
            poMessage={poMessage}
            formatCurrency={formatCurrency}
            getConsumedAmount={getConsumedAmount}
            getRemainingAmount={getRemainingAmount}
          />
        )}

        {activeMenu === "proyectos" && (
          <ProjectsPanel
            clients={clients}
            consultants={consultants}
            projects={projects}
            projectName={projectName}
            setProjectName={setProjectName}
            projectClientId={projectClientId}
            setProjectClientId={setProjectClientId}
            projectConsultantId={projectConsultantId}
            setProjectConsultantId={setProjectConsultantId}
            projectSellRate={projectSellRate}
            setProjectSellRate={setProjectSellRate}
            projectCostRate={projectCostRate}
            setProjectCostRate={setProjectCostRate}
            createProject={createProject}
            projectMessage={projectMessage}
            formatCurrency={formatCurrency}
            getProjectRevenue={getProjectRevenue}
            getProjectCost={getProjectCost}
            getMargin={getMargin}
            getMarginPct={getMarginPct}
          />
        )}

        {activeMenu === "timesheets" && (
          <TimesheetsPanel
            timesheets={timesheets}
            projects={projects}
            consultants={consultants}
            timesheetProjectId={timesheetProjectId}
            setTimesheetProjectId={setTimesheetProjectId}
            timesheetConsultantId={timesheetConsultantId}
            setTimesheetConsultantId={setTimesheetConsultantId}
            timesheetDate={timesheetDate}
            setTimesheetDate={setTimesheetDate}
            timesheetHours={timesheetHours}
            setTimesheetHours={setTimesheetHours}
            timesheetDays={timesheetDays}
            setTimesheetDays={setTimesheetDays}
            timesheetStatus={timesheetStatus}
            setTimesheetStatus={setTimesheetStatus}
            createTimesheet={createTimesheet}
            updateTimesheetStatus={updateTimesheetStatus}
            timesheetMessage={timesheetMessage}
          />
        )}

        {activeMenu === "ia" && (
          <AIAssistant
  question={question}
  setQuestion={setQuestion}
  aiResponse={aiResponse}
  setAiResponse={setAiResponse}
  aiReports={aiReports}
  askAI={askAI}
  exportPDF={exportPDF}
/>
        )}
      </main>
    </div>
  );
}