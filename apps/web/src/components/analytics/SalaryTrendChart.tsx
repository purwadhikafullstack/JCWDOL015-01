'use client';

import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

// Dynamically import react-apexcharts without SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SalaryTrendChart = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: 'line',
        height: 350
      },
      xaxis: {
        categories: [],
      },
      stroke: {
        curve: 'smooth'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      }
    },
    series: [{
      name: 'Jumlah Pelamar',
      data: []
    }]
  });

  const fetchData = () => {
    try {
      fetch('http://localhost:8000/api/analytics/salary-trends')
        .then((response) => response.json())
        .then((data) => {
          const maxValue = Math.max(...data.series);
          const yAxisMax = Math.ceil(maxValue) + 1;
          // const maxLabel = Math.max(...data.labels);
          // const xAxisMax = Math.ceil(maxLabel) + 1000000;

          setChartData((prev) => ({
            ...prev,
            series: [{
              name: 'Jumlah Pelamar',
              data: data.series
            }],
            options: {
              ...prev.options,
              yaxis: {
                min: 0, // Start from 0
                max: yAxisMax // Dynamically calculated maximum
              },
              xaxis: {
                categories: data.labels,
                // min: 0,
                // max: xAxisMax
              }
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
      options={chartData.options as ApexOptions}
      series={chartData.series}
      type="line"
      height={350}
    />
  );
};

export default SalaryTrendChart;
