import { Link } from "react-router-dom";
import { useThemeStore } from "../../store/useThemeStore";
import { File, MessageSquare, Star, Home, Settings } from "lucide-react";

const sidebarStyles = {
  container: `
    flex flex-col text-base-content space-y-2 w-full bg-base-200 px-2 rounded-lg shadow-md
  `,
  sectionTitle: `
    text-xs font-bold uppercase tracking-wider
    px-3 py-2 animate-fadeInRight
  `,
  navItem: `
    group flex items-center space-x-3 px-3 py-3 rounded-xl
    font-medium transition-all duration-300 ease-out
    hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
    hover:text-indigo-600 hover:shadow-md hover:scale-[1.02]
    hover:translate-x-1 active:scale-[0.98]
    cursor-pointer relative overflow-hidden
    before:absolute before:inset-0 before:bg-gradient-to-r 
    before:from-blue-400 before:to-indigo-500 before:opacity-0
    before:transition-opacity before:duration-300
    hover:before:opacity-10 before:rounded-xl
  `,
  navIcon: `
    w-5 h-5 transition-all duration-300 group-hover:scale-110
    group-hover:rotate-3 drop-shadow-sm
  `,
  navText: `
    transition-all duration-300 group-hover:font-semibold
  `,
  activeDot: `
    absolute right-3 w-2 h-2 bg-indigo-500 rounded-full
    opacity-0 group-hover:opacity-100 transition-all duration-300
    animate-pulse
  `,
};

const navigationItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: File, label: "Files", path: "/files" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Star, label: "My collection", path: "/mycollection" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const isActive = (path) => location.pathname === path;

function Sidebar() {
  // const { theme } = useThemeStore();

  return (
    <nav className={sidebarStyles.container}>
      <div className={sidebarStyles.sectionTitle}>Navigation</div>

      <div className="space-y-1">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              to={item.path}
              key={item.path}
              className={`${sidebarStyles.navItem} animate-fadeInRight`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon className={sidebarStyles.navIcon} />
              <span className={sidebarStyles.navText}>{item.label}</span>
              {isActive(item.path) && (
                <div className={sidebarStyles.activeDot}></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Sidebar;
