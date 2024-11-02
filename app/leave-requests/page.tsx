"use client";
import React, { useEffect, useState } from 'react';
import { fetchLeaveRequests } from '@/store/leaveRequestSlice';
import { LeaveRequest, PaginatedLeaveRequestResponse } from '@/types/leaveRequestTypes';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import SidebarLayout from '@/components/SidebarLayout';
import DataTable from '@/components/DataTable';

const ProfilePage: React.FC = () => {
  // Check if the user is authenticated and has the specified roles
  useAuthCheck(['employee', 'intern', 'company_admin']);

  const dispatch = useDispatch<AppDispatch>();

  // Pagination variables
  const [data, setData] = useState<PaginatedLeaveRequestResponse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<string>('dtr_id');
  const [order, setOrder] = useState<string>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchData = async (params: Record<string, unknown>): Promise<PaginatedLeaveRequestResponse> => {
    try {
      const response: PaginatedLeaveRequestResponse = await dispatch(fetchLeaveRequests(params)).unwrap();
      setData(response.data);
      return response;
    } catch (error) {
      console.error("Failed to fetch leave request data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData({ page: currentPage, perPage: itemsPerPage, sort, order, searchTerm });
      setData(result.data);
    };

    loadData();
  }, [currentPage, itemsPerPage, sort, order, searchTerm]);

  return (
    <SidebarLayout>
      <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
        <DataTable
          data={data}
          columns={[
            { key: 'dtr_id', label: 'Leave Request ID' },
            { key: 'dtr_absence_date', label: 'Absence Date' },
            { key: 'dtr_absence_reason', label: 'Reason' },
            {
              key: 'dtr_absence_approved_at',
              label: 'Approved At',
              render: (item: LeaveRequest) => (item.dtr_absence_approved_at ? item.dtr_absence_approved_at : 'Not Yet Approved'),
            },
          ]}
          fetchData={fetchData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          sort={sort}
          order={order}
          searchTerm={searchTerm}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          setSort={setSort}
          setOrder={setOrder}
          setSearchTerm={setSearchTerm}
        />
      </div>
    </SidebarLayout>
  );
};

export default ProfilePage;
