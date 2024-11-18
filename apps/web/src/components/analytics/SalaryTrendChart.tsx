'use client';

import { use } from 'chai';
import React, { useEffect, useState } from 'react';

import Chart from 'react-apexcharts';

const SalaryTrendChart = () => {
  const [chartData, setChartData] = useState({
    options: {},
      series: [],
      labels: []
  });

  const fetchData = () => {
    try {
      fetch('http://localhost:8000/api/analytics/salary-trends')
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
      width="500"
    />
  );
};

export default SalaryTrendChart;
