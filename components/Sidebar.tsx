import type { Language } from "../i18n/translations";

type SidebarProps = {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;

  language: Language;
  setLanguage: (language: Language) => void;

  t: {
    dashboard: string;
    clients: string;
    consultants: string;
    invoices: string;
    purchaseOrders: string;
    projects: string;
    timesheets: string;
    ai: string;
    language: string;
  };
};

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  language,
  setLanguage,
  t,
}: SidebarProps) {
  const menus = [
    { key: "dashboard", label: t.dashboard },
    { key: "clientes", label: t.clients },
    { key: "consultores", label: t.consultants },
    { key: "facturas", label: t.invoices },
    { key: "pos", label: t.purchaseOrders },
    { key: "proyectos", label: t.projects },
    { key: "timesheets", label: t.timesheets },
    { key: "ia", label: t.ai },
  ];

  return (
    <aside
      style={{
        width: 240,
        background: "#111827",
        color: "white",
        padding: 20,
      }}
    >
      <h2>ConsultFlow</h2>

      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 12,
            marginBottom: 6,
            color: "#d1d5db",
          }}
        >
          {t.language}
        </label>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "none",
          }}
        >
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
      </div>

      {menus.map((m) => (
        <div
          key={m.key}
          onClick={() => setActiveMenu(m.key)}
          style={{
            marginTop: 15,
            cursor: "pointer",
            background: activeMenu === m.key ? "#2563eb" : "transparent",
            padding: 10,
            borderRadius: 6,
          }}
        >
          {m.label}
        </div>
      ))}
    </aside>
  );
}