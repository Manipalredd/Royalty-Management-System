import { BarChart2, CirclePlus, DollarSign, List, LogOut, Menu, UserPen, UserPlus, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApiService from "../../../service/ApiService";
 
const SIDEBAR_ITEMS = {
    Admin: [
        { name: "Overview", icon: BarChart2, color: "#6366f1", path: "/admin-dashboard" },
        { name: "Users", icon: Users, color: "#EC4899", path: "/all-users" },
        { name: "Transaction History", icon: DollarSign, color: "#10B981", path: "/all-transactions" },
        { name: "Add Users", icon: Users, color: "#10B981", path: "/add-user" },
        { name: "All Songs", icon: List, color: "#10B981", path: "/all-songs" },
        { name: "Royalties", icon: DollarSign, color: "#10B981", path: "/royalties" },
        { name: "Contact Requests", icon: UserPen, color: "#6EE7B7", path: "/contact-requests" },
        { name: "Admin Profile", icon: UserPen, color: "#6EE7B7", path: "/my-info" },
 
    ],
    Manager: [
        { name: "Overview", icon: BarChart2, color: "#6366f1", path: "/manager-dashboard" },
        { name: "List of all songs", icon: List, color: "#EC4899", path: "/all-msongs" },
        { name: "Artists Under Manager", icon: Users, color: "#EC4899", path: "/manager-artists" },
        { name: "Artist's Transactions", icon: DollarSign, color: "#10B981", path: "/man-artist-trans" },
        { name: "My Transactions", icon: DollarSign, color: "#10B981", path: "/manager-transactions" },
        { name: "Partnership Requests", icon: Users, color: "#6EE7B7", path: "/manager-requests" },
        { name: "Manager Profile", icon: UserPen, color: "#6EE7B7", path: "/my-info" },
    ],
    Artist: [
        { name: "Overview", icon: BarChart2, color: "#6366f1", path: "/artist-dashboard" },
        { name: "Artist's Songs", icon: List, color: "#10B981", path: "/artist-songs" },
        { name: "List of all songs", icon: List, color: "#10B981", path: "/all-artist-songs" },
        { name: "Add Song", icon: CirclePlus, color: "#10B981", path: "/add-song" },
        { name: "Transaction History", icon: DollarSign, color: "#10B981", path: "/transaction-history" },
        { name: "Partnerships", icon: UserPlus, color: "#6EE7B7", path: "/artist-requests" },
        { name: "Manager's Profile", icon: Users, color: "#6EE7B7", path: "/my-manager-details" },
        { name: "Artist's Profile", icon: UserPen, color: "#6EE7B7", path: "/my-info" },
    ],
};
 
const LOGOUT_ITEM = {
    name: "Logout",
    icon: LogOut,
    color: "#6EE7B7",
    path: "/",
};
 
const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [role, setRole] = useState("");
    const [fullName, setFullName] = useState("");
 
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (ApiService.isAuthenticated()) {
                    const userData = await ApiService.getLoggedInUsesInfo();
                    const userRole = ApiService.getRole();
                   
                    setRole(userRole);
                    if (userData && userData.firstName && userData.lastName) {
                        setFullName(`${userData.firstName} ${userData.lastName}`);
                    } else {
                        setFullName("User");
                    }
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                setFullName("User");
            }
        };
 
        fetchUserDetails();
    }, []);
 
    const renderRoleBadge = () => {
        if (role === "Admin") {
            return <span className="text-yellow-400 text-2xl ml-3">👑</span>;
        } else if (role === "Artist") {
            return (
                <span className="w-10 h-8 flex items-center justify-center rounded-full bg-red-500 text-white text-lg font-bold">
                    A
                </span>
            );
        } else if (role === "Manager") {
            return (
                <span className="ml-3 w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white text-lg font-bold">
                    M
                </span>
            );
        }
        return null;
    };
 
   
 
    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`}
            animate={{ width: isSidebarOpen ? 256 : 80 }}
        >
            <div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
                <div className='flex items-center justify-between'>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
                    >
                        <Menu size={24} />
                    </motion.button>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                className='flex items-center text-gray-300 font-medium ml-3'
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                Hello, {fullName} {renderRoleBadge()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
 
                <nav className='mt-8 flex-grow'>
                    {/* Sidebar items */}
                    {(SIDEBAR_ITEMS[role] || []).map((item) => (
                        <Link key={item.path} to={item.path}>
                            <motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
                                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className='ml-4 whitespace-nowrap'
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
 
                    {/* Logout */}
                    <div onClick={ApiService.clearAuth}>
                        <Link to={LOGOUT_ITEM.path}>
                            <motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
                                <LOGOUT_ITEM.icon size={20} style={{ color: LOGOUT_ITEM.color, minWidth: "20px" }} />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className='ml-4 whitespace-nowrap'
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
                                        >
                                            Logout
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    </div>
                </nav>
            </div>
        </motion.div>
    );
};
 
export default Sidebar;