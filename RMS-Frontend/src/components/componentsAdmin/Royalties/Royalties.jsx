import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiService from "../../../service/ApiService";
import { format } from "date-fns";

// Pagination utilities
const paginate = (items, currentPage, pageSize) => {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};

const getPageNumbers = (totalItems, currentPage, pageSize) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  return { startPage, endPage, totalPages };
};

const Royalties = () => {
  const [royalties, setRoyalties] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Adjust the number of items per page as needed

  useEffect(() => {
    fetchRoyalties();
  }, []);

  const fetchRoyalties = async () => {
    try {
      const response = await ApiService.getRoyalties();
      setRoyalties(response);
    } catch (error) {
      console.error("Error fetching royalties:", error);
      setError("Failed to fetch royalties.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (royalty) => {
    if (!window.confirm(`Process payment of ₹${royalty.royaltyAmount}?`)) return;

    setLoadingId(royalty.royaltyId);

    try {
      const adminId = ApiService.getUserId();
      const response = await ApiService.payRoyalty(royalty.royaltyId, adminId);

      if (response.error) {
        throw new Error(response.error);
      }

      toast.success(`Royalty of ₹${royalty.royaltyAmount} paid successfully!`, {
        position: "top-right",
        autoClose: 2000,
      });

      // Update the UI to mark the payment as PAID
      setRoyalties((prev) =>
        prev.map((r) =>
          r.royaltyId === royalty.royaltyId ? { ...r, status: "PAID" } : r
        )
      );
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error(`Payment failed: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleCalculate = async () => {
    try {
      await ApiService.calculateRoyalties();
      toast.success("Royalties calculated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      fetchRoyalties();
    } catch (error) {
      console.error("Calculation failed:", error);
      toast.error("Failed to calculate royalties.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="text-gray-300">Loading royalties...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Calculate paginated data and pagination numbers
  const paginatedRoyalties = paginate(royalties, currentPage, pageSize);
  const { totalPages } = getPageNumbers(royalties.length, currentPage, pageSize);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 text-center mb-6">Royalties</h2>
      <ToastContainer />
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCalculate}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Calculate Royalties
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Royalty ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Song ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Artist ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Total Streams</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Royalty Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Calculated Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedRoyalties.map((r) => (
              <motion.tr key={r.royaltyId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 text-sm text-gray-300">{r.royaltyId}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{r.songId}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{r.artistId}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{r.totalStreams}</td>
                <td className="px-6 py-4 text-sm text-gray-300">₹{r.royaltyAmount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{format(new Date(r.calculatedDate), "yyyy-MM-dd")}</td>
                <td className={`px-6 py-4 text-sm font-bold ${r.status === "PAID" ? "text-green-400" : "text-red-400"}`}>
                  {r.status}
                </td>
                <td className="px-6 py-4">
                  {r.status !== "PAID" && (
                    <button
                      onClick={() => handlePayment(r)}
                      disabled={loadingId === r.royaltyId}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingId === r.royaltyId ? <Loader size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                      {loadingId === r.royaltyId ? "Processing..." : "Pay"}
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            aria-label="previous page"
            data-testid="prev-page"
            className="mx-1 px-3 py-1 rounded-lg bg-gray-700 text-gray-300"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`mx-1 px-3 py-1 rounded-lg ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            aria-label="next page"
            data-testid="next-page"
            className="mx-1 px-3 py-1 rounded-lg bg-gray-700 text-gray-300"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Royalties;
