"use client";
import React, { ChangeEvent, useEffect } from 'react';
import { format } from 'date-fns';

// Define props interface for DataTable
interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T; 
    label: string; 
    render?: (item: T) => React.ReactNode; 
  }[];
  fetchData: (params: { page: number; perPage: number; sort: string; order: string; searchTerm: string }) => Promise<{ data: T[]; last_page: number; next_page_url: string | null }>;
  currentPage: number;
  itemsPerPage: number;
  sort: string;
  order: string;
  searchTerm: string;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (perPage: number) => void;
  setSort: (sort: string) => void;
  setOrder: (order: string) => void;
  setSearchTerm: (term: string) => void;
}

// DataTable component
const DataTable = <T,>({
  data,
  columns,
  fetchData,
  currentPage,
  itemsPerPage,
  sort,
  order,
  searchTerm,
  setCurrentPage,
  setItemsPerPage,
  setSort,
  setOrder,
  setSearchTerm
}: DataTableProps<T>) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lastPage, setLastPage] = React.useState<number>(1);
  const [nextPageAvailable, setNextPageAvailable] = React.useState<boolean>(true);

  // Function to format date using date-fns
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy hh:mm a'); // e.g., August 26, 2024 12:30 PM
  };

  // Load data when dependencies change
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchData({ page: currentPage, perPage: itemsPerPage, sort, order, searchTerm });
      setLastPage(response.last_page);
      setNextPageAvailable(response.next_page_url !== null);
    } catch (err) {
      setError(err as string || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, itemsPerPage, sort, order, searchTerm]);

  // Handle search input change
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate pagination buttons based on the current state
  const createPaginationButtons = () => {
    const buttons: (number | string)[] = [];
    const totalPages = lastPage;

    // Always include the first page
    if (totalPages > 0) buttons.push(1);

    // Add ellipses and surrounding pages
    if (totalPages > 2) {
      if (currentPage > 3) buttons.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        buttons.push(i);
      }
      if (currentPage < totalPages - 2) buttons.push('...');
    }

    // Always include the last page if not already included
    if (totalPages > 1) buttons.push(totalPages);

    return buttons;
  };

  return (
    <div className="overflow-hidden">
      {/* Filter/Search */}
      <div className="mb-4 flex items-center justify-between flex-wrap">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded w-full mb-4 md:mb-0 md:w-1/3"
        />
        <div className="flex space-x-4 mb-4 md:mb-0">
          <label className="text-gray-700">
            Items per page:
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="ml-2 p-1 border rounded">
              {[5, 10, 25, 50].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="text-gray-700">
            Sort by:
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="ml-2 p-1 border rounded">
              {columns.map(column => (
                <option key={String(column.key)} value={String(column.key)}>{column.label}</option>
              ))}
            </select>
          </label>
          <label className="text-gray-700">
            Order:
            <select value={order} onChange={(e) => setOrder(e.target.value)} className="ml-2 p-1 border rounded">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              {columns.map(column => (
                <th key={column.label} className="py-2 px-4 border-b font-semibold text-center">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-2 text-center text-gray-500 break-all">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="py-2 text-center text-red-500 break-all">{error}</td>
              </tr>
            ) : data.length > 0 ? (
                data.map((entry, index) => (
                    <tr key={String(entry[columns[0].key])} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      {columns.map(column => (
                        <td key={String(column.key)} className="py-2 px-4 border-b text-gray-800 text-center break-all">
                          {column.render ? column.render(entry) : 
                            // Check if the entry is a date string and format it
                            typeof entry[column.key] === 'string' && !isNaN(Date.parse(entry[column.key] as string)) 
                              ? formatDate(entry[column.key] as string) 
                              : entry[column.key] !== undefined && entry[column.key] !== null 
                                ? String(entry[column.key]) // Convert to string for rendering
                                : 'N/A' // Fallback if the property does not exist
                          }
                        </td>
                      ))}
                    </tr>
                  ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-2 text-center text-gray-500">No entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-l bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        {/* Pagination buttons */}
        {createPaginationButtons().map((button, index) => {
          if (button === '...') {
            return (
              <span key={index} className="px-3 py-1 border-t border-b border-gray-300">{button}</span>
            );
          }
          return (
            <button
              key={index}
              onClick={() => handlePageChange(button as number)}
              className={`px-3 py-1 border border-gray-300 rounded ${button === currentPage ? 'bg-gray-300 font-bold' : ''}`}
              disabled={button === currentPage}
            >
              {button}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!nextPageAvailable}
          className="px-3 py-1 border border-gray-300 rounded-r bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
