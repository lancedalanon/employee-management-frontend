// ApexChart Component as Functional Component
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the ReactApexChart to avoid issues with SSR in Next.js
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ApexChart = () => {
  // Set up series and options using useState
  const [series] = useState([
    {
      name: "Current Attendance Streak",
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
    },
    {
      name: "Completed Tasks",
      data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
    },
    {
      name: "Projects Delivered",
      data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
    }
  ]);

  const [options] = useState({
    chart: {
      height: 350,
      type: 'line',
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      width: [5, 7, 5],
      curve: 'straight',
      dashArray: [0, 8, 5]
    },
    title: {
      text: 'Employee Stats',
      align: 'left'
    },
    legend: {
      tooltipHoverFormatter: function (val, opts) {
        return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>';
      }
    },
    markers: {
      size: 0,
      hover: { sizeOffset: 6 }
    },
    xaxis: {
      categories: [
        '01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan',
        '07 Jan', '08 Jan', '09 Jan', '10 Jan', '11 Jan', '12 Jan'
      ]
    },
    tooltip: {
      y: [
        { title: { formatter: val => `${val} (mins)` } },
        { title: { formatter: val => `${val} per session` } },
        { title: { formatter: val => val } }
      ]
    },
    grid: { borderColor: '#f1f1f1' }
  });

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default ApexChart;