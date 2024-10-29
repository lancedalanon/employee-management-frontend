"use client";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDtrs } from '@/store/dtrSlice';
import { AppDispatch } from '@/store/store';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import { Dtr, PaginatedDtrResponse } from '@/types/dtrTypes'; 
import SidebarLayout from '@/components/SidebarLayout';
import DataTable from '@/components/DataTable';

const DtrPage: React.FC = () => {
  // Check user authorization
  useAuthCheck(['employee', 'intern', 'company_admin']);

  const dispatch = useDispatch<AppDispatch>();

  // State variable for DTR data
  const [dtr, setDtr] = useState<Dtr[]>([]);

  // Fetch DTR data from API
  const fetchDtrData = async (params: Record<string, unknown>): Promise<PaginatedDtrResponse> => {
    // Fetch the DTR data and unwrap the response
    const response: PaginatedDtrResponse = await dispatch(fetchDtrs(params)).unwrap();
    // Set the DTR data in state
    setDtr(response.data);
    console.log(response);
    return response;
  };

  return (
    <SidebarLayout>
      <DataTable
        data={dtr}
        columns={[
          { key: 'dtr_id', label: 'DTR ID' },
          { key: 'dtr_time_in', label: 'Time In' },
          { key: 'dtr_time_out', label: 'Time Out' },
          { 
            key: 'dtr_end_of_the_day_report', 
            label: 'End of The Day Report',
            render: (item: Dtr) => (item.dtr_is_overtime ? item.dtr_end_of_the_day_report : 'N/A'),
          },
          { 
            key: 'dtr_is_overtime', 
            label: 'Overtime',
            render: (item: Dtr) => (item.dtr_is_overtime ? 'Yes' : 'No'),
          },
        ]}
        fetchData={fetchDtrData} 
      />
    </SidebarLayout>
  );
};

export default DtrPage;
