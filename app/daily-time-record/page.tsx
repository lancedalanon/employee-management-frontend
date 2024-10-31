"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDtrs, storeTimeIn, storeTimeOut, storeBreak, storeResume } from '@/store/dtrSlice';
import { AppDispatch } from '@/store/store';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import { Dtr, PaginatedDtrResponse } from '@/types/dtrTypes';
import SidebarLayout from '@/components/SidebarLayout';
import DataTable from '@/components/DataTable';
import Button from '@/components/Button';
import { unwrapResult } from '@reduxjs/toolkit';
import Dialog from '@/components/Dialog';

// Define constant options for date formatting
const DATE_OPTIONS = {
  timeZone: "Asia/Manila",
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
} as const;

/**
 * Custom hook to manage current time updating every second in PHT timezone
 */
const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const time = new Date();
      setCurrentTime(time.toLocaleString("en-US", DATE_OPTIONS));
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(intervalId);
  }, []);

  return currentTime;
};

const DtrPage: React.FC = () => {
  // Check user authorization
  useAuthCheck(['employee', 'intern', 'company_admin']);

  const dispatch = useDispatch<AppDispatch>();
  const currentTime = useCurrentTime(); // Fetch current time using custom hook

  // State variable for DTR data
  const [dtr, setDtr] = useState<Dtr[]>([]);

  /**
   * Fetch DTR data from API and update state
   * @param {Record<string, unknown>} params - Parameters for the API request
   * @returns {Promise<PaginatedDtrResponse>} - The fetched data
   */
  const fetchDtrData = async (params: Record<string, unknown>): Promise<PaginatedDtrResponse> => {
    try {
      const response: PaginatedDtrResponse = await dispatch(fetchDtrs(params)).unwrap();
      setDtr(response.data);
      console.log(response);
      return response;
    } catch (error) {
      console.error("Failed to fetch DTR data:", error);
      throw error;
    }
  };

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null); // State to hold the current action type

  // Handler function for Button actions
  const handleAction = async (actionType: string) => {
    setCurrentAction(actionType); // Set the current action type
    setDialogOpen(true); // Open the dialog with the action type
  };

  // Function to close the dialog
  const closeDialog = () => {
    setDialogOpen(false); // Close the dialog
    setCurrentAction(null); // Reset action when closing the dialog
  };

  return (<>
    <SidebarLayout>
      <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
        <div className="flex flex-wrap justify-between items-center">
          {/* Display the Current Date and Time */}
          <h1>
            <span className="font-bold">Current Time:</span> {currentTime}
          </h1>
          
          {/* Action Buttons with Different Accent Colors */}
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Button 
              type="button" 
              label="Time In" 
              onClick={() => handleAction("timeIn")} 
              variant="success" 
              size="md" 
            />
            <Button 
              type="button" 
              label="Break" 
              onClick={() => handleAction("break")} 
              variant="secondary" 
              size="md" 
            />
            <Button 
              type="button" 
              label="Resume" 
              onClick={() => handleAction("resume")} 
              variant="primary" 
              size="md" 
            />
            <Button 
              type="button" 
              label="Time Out" 
              onClick={() => handleAction("timeOut")} 
              variant="danger" 
              size="md" 
            />
          </div>
        </div>
      </div>
      <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
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
      </div>
    </SidebarLayout>
    <Dialog 
      isOpen={isDialogOpen} 
      onClose={closeDialog} 
      title={currentAction}
      className="w-1/2 h-full"
    >
      <h2>{currentAction}</h2>
      <p>This is some dialog content.</p>
      <p>You can add any other content you want here.</p>
    </Dialog>
  </>);
};

export default DtrPage;
