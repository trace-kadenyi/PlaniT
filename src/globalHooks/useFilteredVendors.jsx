import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendors, fetchVendorStats } from "../redux/vendorsSlice";

export function useFilteredVendors() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 10;

  const {
    items: vendors,
    stats,
    status,
    error,
    statsStatus,
    archiveStatus,
  } = useSelector((state) => state.vendors);

  // fetch vendors
  useEffect(() => {
    const archived =
      filterMode === "archived"
        ? true
        : filterMode === "active"
        ? false
        : undefined;

    dispatch(fetchVendors({ archived }));
  }, [dispatch, filterMode]);

  // fetch vendor stats
  useEffect(() => {
    dispatch(fetchVendorStats());
  }, [dispatch]);

  // Filter vendors
  const filteredVendors = vendors
    .filter((vendor) => {
      if (!vendor) return false;
      if (filterMode === "active") return !vendor.isArchived;
      if (filterMode === "archived") return vendor.isArchived;
      return true;
    })
    .filter((vendor) => {
      if (!vendor) return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        vendor.name?.toLowerCase().includes(term) ||
        vendor.contact?.email?.toLowerCase().includes(term) ||
        vendor.contact?.phone?.toLowerCase().includes(term) ||
        vendor.services?.toLowerCase().includes(term)
      );
    });

  // Pagination logic
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterMode, searchTerm]);

  return {
    fetchVendors,
    fetchVendorStats,
    searchTerm,
    setSearchTerm,
    filterMode,
    setFilterMode,
    currentPage,
    setCurrentPage,
    vendorsPerPage,
    filteredVendors,
    currentVendors,
    totalPages,
    paginate,
    stats,
    status,
    error,
    statsStatus,
    archiveStatus,
  };
}
