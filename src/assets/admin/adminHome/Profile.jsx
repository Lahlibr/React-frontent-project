import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminToken = JSON.parse(sessionStorage.getItem("adminToken"));
        if (!adminToken) {
          navigate("/admin-login");
          return;
        }

        const response = await fetch(`http://localhost:3001/admin/${adminToken.id}`);
        if (!response.ok) throw new Error('Failed to fetch admin data');
        
        const data = await response.json();
        setAdminData(data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminProducts");
    sessionStorage.removeItem("adminOrders");
    navigate("/admin-login");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Fixed width and always visible on desktop */}
      <div className={`fixed inset-y-0 z-50 w-64 bg-gray-800 text-white transition-all duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Profile</h1>
                    <p className="mt-1 text-gray-600">Manage your account details</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 self-start md:self-auto"
                  >
                    Logout
                  </button>
                </div>

                {/* Profile Information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-900">{adminData.username}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-900 capitalize">{adminData.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-gray-900">{adminData.email}</p>
                    </div>
                  </div>

                  {/* Account Security Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Account Security</h2>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => navigate('/admin-change-password')}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
                      >
                        Change Password
                      </button>
                      <button 
                        onClick={() => navigate('/admin-settings')}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-200"
                      >
                        Account Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;