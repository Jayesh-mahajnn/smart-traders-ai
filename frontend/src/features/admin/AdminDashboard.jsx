import Navbar from "../../components/Navbar";

function AdminDashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>
      </div>
    </div>
  );
}

export default AdminDashboard;