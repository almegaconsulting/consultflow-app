type SidebarProps = {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
};

export default function Sidebar({
  activeMenu,
  setActiveMenu,
}: SidebarProps) {
  const menus = [
    "dashboard",
    "clientes",
    "consultores",
    "facturas",
    "pos",
    "proyectos",
    "timesheets",
    "ia",
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

      {menus.map((m) => (
        <div
          key={m}
          onClick={() => setActiveMenu(m)}
          style={{
            marginTop: 15,
            cursor: "pointer",
            background: activeMenu === m ? "#2563eb" : "transparent",
            padding: 10,
            borderRadius: 6,
          }}
        >
          {m.toUpperCase()}
        </div>
      ))}
    </aside>
  );
}