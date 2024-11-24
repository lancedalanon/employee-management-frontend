"use client";
import React, { useEffect, useState } from 'react';
import { fetchLeaveRequests, storeLeaveRequest } from '@/store/leaveRequestSlice';
import { LeaveRequest, PaginatedLeaveRequestResponse } from '@/types/leaveRequestTypes';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import SidebarLayout from '@/components/SidebarLayout';
import DataTable from '@/components/DataTable';
import Button from '@/components/Button';
import { useForm, Controller, Resolver } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from '@/components/Dialog';
import InputField from '@/components/InputField';
import TextAreaField from '@/components/TextAreaField';

// Form data interface
interface LeaveRequestFormData {
  dtr_absence_date: Date;
  dtr_absence_reason: string;
  refreshData?: () => Promise<void>;
}

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  dtr_absence_date: Yup.date()
    .required('Date is required')
    .min(new Date(), 'Date cannot be in the past'), 
  dtr_absence_reason: Yup.string()
    .required('Reason is required')
    .max(255, 'Reason cannot exceed 255 characters'),
});

// LeaveRequestFormDialog component
interface LeaveRequestFormDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  refreshData: () => Promise<void>;
}

// Exclude `refreshData` from the type passed to useForm
type ValidatedLeaveRequestFormData = Omit<LeaveRequestFormData, 'refreshData'>;

const LeaveRequestFormDialog: React.FC<LeaveRequestFormDialogProps> = ({ isDialogOpen, closeDialog, refreshData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { control, handleSubmit, formState: { errors } } = useForm<ValidatedLeaveRequestFormData>({
    resolver: yupResolver(validationSchema) as Resolver<ValidatedLeaveRequestFormData>,
  });

  // Update the onSubmit function to dispatch the storeLeaveRequest action
  const onSubmit = async (data: LeaveRequestFormData) => {
    try {
      // Format the date for the API to accept the ISO 8601 format (YYYY-MM-DD)
      const formattedData = {
        ...data,
        dtr_absence_date: new Date(data.dtr_absence_date).toISOString().slice(0, 19).replace('T', ' '),
      }

      await dispatch(storeLeaveRequest(formattedData)).unwrap();
      await refreshData();
      closeDialog();
    } catch (error) {
      console.error('Failed to submit leave request:', error);
    }
  };

  return (
    <Dialog isOpen={isDialogOpen} onClose={closeDialog} title="Request Leave" className="w-1/2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Absence Date Field */}
        <Controller
          name="dtr_absence_date"
          control={control}
          render={({ field }) => (
            <InputField
              label="Absence Date"
              type="date"
              id="dtr_absence_date"
              required
              error={errors.dtr_absence_date?.message}
              {...field}
              value={field.value ? field.value.toISOString().split('T')[0] : ''}
            />
          )}
        />

        {/* Reason for Absence Field */}
        <Controller
          name="dtr_absence_reason"
          control={control}
          render={({ field }) => (
            <TextAreaField
              label="Reason for Absence"
              id="dtr_absence_reason"
              placeholder="Brief reason for leave"
              maxLength={255}
              rows={4}
              required
              error={errors.dtr_absence_reason?.message}
              {...field} 
            />
          )}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-blue-500 py-2 text-white font-semibold hover:bg-blue-600"
        >
          Submit Request
        </button>
      </form>
    </Dialog>
  );
};

const LeaveRequestPage: React.FC = () => {
  useAuthCheck(['employee', 'intern', 'company_admin']);
  const dispatch = useDispatch<AppDispatch>();

  const [data, setData] = useState<LeaveRequest[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<string>('dtr_id');
  const [order, setOrder] = useState<string>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showLeaveRequestForm, setShowLeaveRequestForm] = useState<boolean>(false);

  // Function to close the dialog
  const closeDialog = () => setShowLeaveRequestForm(false);

  // Fetch data function
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

  // Define a wrapper function to match the expected signature
  const wrapperFetchData = async (): Promise<void> => {
    await fetchData({}); // Call fetchData with an empty object or with the appropriate parameters
  };

  return (<>
    <SidebarLayout>
      <div className="p-4 text-4xl font-bold mb-8 flex justify-between items-center flex-wrap">
        <h1>Leave Requests</h1>
        <Button 
          type="button" 
          label="Request Leave" 
          variant="primary" 
          size="lg" 
          onClick={() => setShowLeaveRequestForm(true)}
        />
      </div>

      {/* DataTable for Leave Requests */}
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
              render: (item: LeaveRequest) => item.dtr_absence_approved_at || 'Not Yet Approved',
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
    <LeaveRequestFormDialog
      isDialogOpen={showLeaveRequestForm}
      closeDialog={closeDialog}
      refreshData={wrapperFetchData}
    />
  </>);
};

export default LeaveRequestPage;
