"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDtrs, storeTimeIn, storeTimeOut, storeBreak, storeResume } from '@/store/dtrSlice';
import { AppDispatch } from '@/store/store';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import { Dtr, PaginatedDtrResponse } from '@/types/dtrTypes';
import SidebarLayout from '@/components/SidebarLayout';
import DataTable from '@/components/DataTable';
import Button from '@/components/Button';
import Dialog from '@/components/Dialog';

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

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleString("en-US", DATE_OPTIONS));
    const intervalId = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(intervalId);
  }, []);
  return currentTime;
};

const CameraDialog = ({ isDialogOpen, closeDialog, currentAction, onCapture }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [textareaValue, setTextareaValue] = useState<string>(''); // State for textarea
  const [uploadedImages, setUploadedImages] = useState<File[]>([]); // State for uploaded images
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isDialogOpen) startCamera();
    else stopCamera();
  }, [isDialogOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) onCapture(blob, textareaValue, uploadedImages); // Pass uploadedImages to onCapture
      }, 'image/jpeg');
    }
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }
    setUploadedImages(files);
  };

  const isCaptureDisabled = currentAction === 'timeOut' && !textareaValue.trim(); // Check if capture should be disabled

  return (
    <Dialog isOpen={isDialogOpen} onClose={closeDialog} title={currentAction} className="w-1/2 h-full">
      <video ref={videoRef} autoPlay className="w-full h-full bg-gray-200" />
      <canvas ref={canvasRef} className="hidden" width={640} height={480} />
      
      {currentAction === 'timeOut' && (
        <>
          <textarea
            value={textareaValue}
            onChange={handleTextareaChange}
            placeholder="Please enter a reason for time out"
            className="w-full mt-4 p-2 border border-gray-300 rounded"
          />
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="imageUpload">
              Upload up to 4 images for end of the day report:
            </label>
            <input
              id="imageUpload" // Link the label to the input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
        </>
      )}

      <div className="mt-4 flex justify-center items-center">
        <Button onClick={captureImage} type="button" label="Capture Image" variant="primary" size="lg" disabled={isCaptureDisabled} />
      </div>
    </Dialog>
  );
};

const DtrPage: React.FC = () => {
  useAuthCheck(['employee', 'intern', 'company_admin']);
  const dispatch = useDispatch<AppDispatch>();
  const currentTime = useCurrentTime();

  // Pagination variables
  const [data, setData] = useState<PaginatedDtrResponse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<string>('dtr_id');
  const [order, setOrder] = useState<string>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Dialog variables
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const fetchData = async (params: Record<string, unknown>): Promise<PaginatedDtrResponse> => {
    try {
      const response: PaginatedDtrResponse = await dispatch(fetchDtrs(params)).unwrap();
      setData(response.data);
      return response;
    } catch (error) {
      console.error("Failed to fetch DTR data:", error);
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

  // Handle different DTR actions
  const handleAction = async(actionType: string) => {
    setCurrentAction(actionType);
    if (actionType === "timeIn" || actionType === "timeOut") {
      setDialogOpen(true); // Open camera for image capture
    } else if (actionType === "break") {
      dispatch(storeBreak());
    } else if (actionType === "resume") {
      dispatch(storeResume());
    }

    const result = await fetchData({ page: currentPage, perPage: itemsPerPage, sort, order, searchTerm });
    setData(result.data);
  };

  // Capture callback to handle the captured image blob
  const handleCapture = async(blob: Blob, textareaValue: string, uploadedImages: File[]) => { // Accept uploadedImages as a parameter
    const formData = new FormData();
    // Set the form field name based on the action type
    const imageField = currentAction === "timeIn" ? "dtr_time_in_image" : "dtr_time_out_image";
    formData.append(imageField, blob, 'captured_image.jpg');
    
    // Append the textarea value as dtr_end_of_the_day_report if the action is timeOut
    if (currentAction === "timeOut") {
      formData.append('dtr_end_of_the_day_report', textareaValue);

      // Append uploaded images to the FormData
      uploadedImages.forEach((file) => {
        formData.append('end_of_the_day_report_images[]', file); // Use the correct field name
      });
    }

    // Dispatch the appropriate thunk based on the action type
    if (currentAction === "timeIn") {
      await dispatch(storeTimeIn(formData));
    } else if (currentAction === "timeOut") {
      await dispatch(storeTimeOut(formData));
    }

    const result = await fetchData({ page: currentPage, perPage: itemsPerPage, sort, order, searchTerm });
    setData(result.data);
    closeDialog();
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentAction(null);
  };

  return (
    <>
      <SidebarLayout>
        <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
          <div className="flex flex-wrap justify-between items-center">
            <h2><span className="font-bold">Current Time:</span> {currentTime}</h2>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Button type="button" label="Time In" onClick={() => handleAction("timeIn")} variant="success" size="md" />
              <Button type="button" label="Break" onClick={() => handleAction("break")} variant="secondary" size="md" />
              <Button type="button" label="Resume" onClick={() => handleAction("resume")} variant="primary" size="md" />
              <Button type="button" label="Time Out" onClick={() => handleAction("timeOut")} variant="danger" size="md" />
            </div>
          </div>
        </div>
        <div className="w-full p-4 shadow-lg rounded-lg bg-surface border mb-8">
          <DataTable
            data={data}
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
      <CameraDialog
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
        currentAction={currentAction}
        onCapture={handleCapture}
      />
    </>
  );
};

export default DtrPage;
