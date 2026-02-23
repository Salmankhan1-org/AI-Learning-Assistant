import { useSelector } from "react-redux";
import {SIDEBAR_ITEMS, SidebarItem} from './SIdebarItems.jsx'

const Sidebar = ({ isOpen, onClose }) => {
  const  user  = useSelector(state => state?.auth?.user)

  const filteredItems = SIDEBAR_ITEMS.filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-60 md:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          border-r border-slate-200 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:h-full
        `}
      >
        <div className="flex flex-col h-full">

          <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
            {filteredItems.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
                onClick={onClose}
              />
            ))}
          </nav>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
