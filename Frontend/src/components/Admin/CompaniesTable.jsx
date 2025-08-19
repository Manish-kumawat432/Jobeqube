import React, { useEffect, useState } from 'react';
import { FiTable } from 'react-icons/fi';
import { Pencil, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PORT } from '../../config/Apiconfig';

const CompaniesTable = () => {
  const { companies = [], searchCompanyByText } = useSelector(store => store.company);
  const [filterCompany, setFilterCompany] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = companies.filter(company =>
      !searchCompanyByText || company.name.toLowerCase().includes(searchCompanyByText.toLowerCase())
    );
    setFilterCompany(filtered);
    setCurrentPage(1);
  }, [companies, searchCompanyByText]);

  const totalPages = Math.ceil(filterCompany.length / itemsPerPage);
  const paginatedCompanies = filterCompany.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (companyId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${PORT}company/${companyId}`, { withCredentials: true });
      setFilterCompany(prev => prev.filter(c => c._id !== companyId));
      toast.success("Company deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FiTable /> A List of your recent registered companies
        </h2>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Logo</th>
            <th className="py-2 px-4 text-left">Company</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCompanies.length > 0 ? (
            paginatedCompanies.map((company, index) => (
              <tr key={company._id || index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">
                  <img
                    src={company.logo || '/default.png'}
                    alt="logo"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => (e.target.src = '/default.png')}
                  />
                </td>
                <td className="py-2 px-4 border">{company.name}</td>
                <td className="py-2 px-4 border">{company.createdAt?.split("T")[0] || "N/A"}</td>
                <td className="py-2 px-4 border text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => navigate(`/admin/companies/${company._id}`)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5 text-blue-900" />
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No companies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
        <div className="text-sm">
          Show:&nbsp;
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          &nbsp;entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompaniesTable;
