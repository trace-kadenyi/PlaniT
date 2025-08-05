import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchVendors, fetchVendorStats } from "../redux/vendorsSlice";
import { LoadingPage } from "../components/shared/LoadingStates";
import { FiPlus, FiArchive, FiEdit2, FiSearch } from "react-icons/fi";

export default function Vendors() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    service: "",
    archived: false,
  });

  const {
    items: vendors,
    stats,
    status,
    error,
    statsStatus,
  } = useSelector((state) => state.vendors);

  useEffect(() => {
    dispatch(fetchVendors(filter));
    dispatch(fetchVendorStats());
  }, [dispatch, filter]);

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const serviceCounts = stats?.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#9B2C62]">Vendors</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#E3CBC1] rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
              />
            </div>
            <button
              onClick={() => navigate("/vendors/new")}
              className="bg-[#9B2C62] hover:bg-[#801f4f] text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 justify-center"
            >
              <FiPlus /> New Vendor
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#F7F7FA] p-4 rounded-lg mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-[#9B2C62] mb-1">
              Service Type
            </label>
            <select
              value={filter.service}
              onChange={(e) => setFilter({ ...filter, service: e.target.value })}
              className="border border-[#E3CBC1] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
            >
              <option value="">All Services</option>
              <option value="venue">Venue</option>
              <option value="catering">Catering</option>
              <option value="decorations">Decorations</option>
              <option value="equipment">Equipment</option>
              <option value="staffing">Staffing</option>
              <option value="marketing">Marketing</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showArchived"
              checked={filter.archived}
              onChange={(e) => setFilter({ ...filter, archived: e.target.checked })}
              className="h-5 w-5 text-[#9B2C62] focus:ring-[#9B2C62] border-[#E3CBC1] rounded"
            />
            <label htmlFor="showArchived" className="text-sm text-[#9B2C62]">
              Show Archived
            </label>
          </div>
        </div>

         {/* Status Messages */}
        {status === "loading" && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62]"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Stats */}
        {statsStatus === "succeeded" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 mb-6">
            {stats?.map((stat) => (
              <div
                key={stat._id}
                className="bg-[#F7F7FA] p-3 rounded-lg text-center"
              >
                <div className="text-2xl font-bold text-[#9B2C62]">
                  {stat.count}
                </div>
                <div className="text-sm capitalize text-[#6B3B0F]">
                  {stat._id}
                </div>
                <div className="text-xs text-gray-500">
                  ({stat.archived} archived)
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vendors List */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-[#E3CBC1]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E3CBC1]">
              <thead className="bg-[#F7F7FA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9B2C62] uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9B2C62] uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9B2C62] uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#9B2C62] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E3CBC1]">
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <tr
                      key={vendor._id}
                      className={vendor.isArchived ? "bg-gray-50" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div
                              className={`text-sm font-medium ${
                                vendor.isArchived
                                  ? "text-gray-500"
                                  : "text-[#9B2C62]"
                              }`}
                            >
                              {vendor.name}
                              {vendor.isArchived && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                                  Archived
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {vendor.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#6B3B0F] capitalize">
                          {vendor.services}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#6B3B0F]">
                          {vendor.contact?.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vendor.contact?.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/vendors/${vendor._id}`)}
                            className="text-[#F59E0B] hover:text-[#D97706]"
                          >
                            <FiEdit2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <div className="text-gray-500">
                        {vendors.length === 0
                          ? "No vendors found"
                          : "No matching vendors found"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}