'use client';

import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { title } from 'process';
import React, { useEffect, useState } from 'react';

// Dynamically import react-apexcharts without SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const UserAgeChart = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: 'donut',
      },
      title: {
        text: 'User Age Distribution', // Add your chart title here
        align: 'center', // Align the title (left, center, right)
        style: {
          fontSize: '18px', // Title font size
          fontWeight: 'bold', // Title font weight
          color: '#333', // Title color
        },
      },
    },
    series: [],
    labels: [],
  });

  const fetchData = () => {
    try {
      fetch('http://localhost:8000/api/analytics/age-distribution')
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
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Chart
      options={chartData.options as ApexOptions}
      series={chartData.series}
      type="donut"
      width="320"
    />
  );
};

export default UserAgeChart;
