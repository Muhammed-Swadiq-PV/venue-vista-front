import { X } from "lucide-react";

interface MenuProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const SideMenu: React.FC<MenuProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-red-100 text-red-500 transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 md:relative mt-16 mb-2 rounded-tr-lg rounded-br-lg shadow-lg`}
    >
      {/* Close Button for Mobile */}
      <button
        className="absolute top-4 right-4 md:hidden text-white"
        onClick={() => setIsSidebarOpen(false)}
      >
        <X size={24} />
      </button>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Menu</h2>
        <nav className="flex flex-col space-y-4">
          {["bookings", "graphs", "cancellations", "refunds"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md text-left ${
                selectedTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => {
                setSelectedTab(tab);
                setIsSidebarOpen(false);
              }}
            >
              {tab === "bookings"
                ? "Booking Details"
                : tab === "graphs"
                ? "Graphs"
                : tab === "cancellations"
                ? "Cancellation Requests"
                : "Refund Details"}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideMenu;
