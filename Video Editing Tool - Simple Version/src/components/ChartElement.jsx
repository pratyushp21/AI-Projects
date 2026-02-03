import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import './ChartElement.css';

Chart.register(...registerables);

function ChartElement({ element }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { chartType, data, width, height, color } = element;

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    
    const labels = data.map((_, i) => `Item ${i + 1}`);
    const colors = data.map((_, i) => `hsl(${(i * 360) / data.length}, 70%, 60%)`);

    chartRef.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels,
        datasets: [{
          label: 'Data',
          data,
          backgroundColor: chartType === 'pie' ? colors : color,
          borderColor: '#ffffff',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: chartType === 'pie',
            labels: { color: '#ffffff', font: { size: 14, weight: 'bold' } },
          },
        },
        scales: chartType !== 'pie' ? {
          y: {
            beginAtZero: true,
            ticks: { color: '#ffffff', font: { weight: 'bold' } },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
          x: {
            ticks: { color: '#ffffff', font: { weight: 'bold' } },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
        } : {},
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartType, data, color]);

  return (
    <div className="chart-element">
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}

export default ChartElement;
