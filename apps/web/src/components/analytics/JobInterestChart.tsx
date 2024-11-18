'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

// Dynamically import react-apexcharts without SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const JobInterestdChart = () => {
  const [chartData, setChartData] = useState({
    options: {},
      series: [],
      labels: []
  });

  const fetchData = () => {
    try {
      fetch('http://localhost:8000/api/analytics/job-interests')
        .then((response) => response.json())
        .then((data) => {
          setChartData((prev) => ({
            ...prev,
            series: data.series,
            options: {
              ...prev.options,
              labels: data.labels,
            },
          }));
        })
        .catch((error) => {
          console.error('Error fetching chart data:', error);
        });
      
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Chart
      options={chartData.options}
      series={chartData.series}
      type="donut"
      width="320"
    />
  );
};

export default JobInterestdChart;
