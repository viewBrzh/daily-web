import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the datalabels plugin
import { DashboardData } from '../types';

interface DashboardProps {
  data: DashboardData;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels); // Register the plugin

const DashboardCharts: React.FC<DashboardProps> = ({ data }) => {
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (data && data.taskStatus && data.sprintProgress && data.members) {
      setIsDataReady(true);
    }
  }, [data]);

  if (!isDataReady) {
    return <div>Loading...</div>; // Or a custom loading spinner
  }

  // Data for Task Status Pie Chart
  const taskStatusData = {
    labels: Object.keys(data.taskStatus), // Get the keys of taskStatus object as labels
    datasets: [
      {
        label: 'Task Status Count',
        data: Object.values(data.taskStatus).map(status => Number(status)), // Convert to number
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
        ],
        borderColor: '#fff',
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
  };

  // Data for Sprint Progress Stacked Bar Chart
  const sprintProgressData = {
    labels: Array.isArray(data.sprintProgress) ? data.sprintProgress.map(sprint => sprint.sprintName) : [],
    datasets: [
      {
        label: 'Done',
        data: Array.isArray(data.sprintProgress) ? data.sprintProgress.map(sprint => sprint.statusCount?.Done || 0) : [],
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'In-Progress',
        data: Array.isArray(data.sprintProgress) ? data.sprintProgress.map(sprint => sprint.statusCount?.['In-Progress'] || 0) : [],
        backgroundColor: 'rgb(54, 162, 235)',
      },
      {
        label: 'Pending',
        data: Array.isArray(data.sprintProgress) ? data.sprintProgress.map(sprint => sprint.statusCount?.Pending || 0) : [],
        backgroundColor: 'rgb(255, 206, 86)',
      },
      {
        label: 'New',
        data: Array.isArray(data.sprintProgress) ? data.sprintProgress.map(sprint => sprint.statusCount?.New || 0) : [],
        backgroundColor: 'rgb(75, 192, 192)',
      }
    ]
  };

  // Data for Project Members Pie Chart
  const memberData = {
    labels: Object.keys(data.members), // Get the keys of members object as labels
    datasets: [
      {
        label: 'Members by Role',
        data: Object.values(data.members), // Get the values of members object as data
        backgroundColor: ['#FF5733', '#36A2EB', '#FFEB3B'],
        borderColor: '#fff',
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
  };

  return (
    <div className="container">
      <div className="chart-card">
        <div className="header">
          <h1 className="title">Task Status</h1>
        </div>
        <div className='chart-container'>
          <Pie
            data={taskStatusData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const value = tooltipItem.raw as number;
                      return `${tooltipItem.label}: ${value} tasks (${((value / Object.values(data.taskStatus).reduce((sum, item) => sum + Number(item), 0)) * 100).toFixed(2)}%)`;
                    }
                  }
                },
                datalabels: {
                  color: '#fff',
                  font: {
                    weight: 'bold',
                  },
                  formatter: (value) => `${value}`,
                }
              }
            }}
          />
        </div>
      </div>

      <div className="chart-card">
        <div className="header">
          <h1 className="title">Sprint Progress</h1>
        </div>
        <div className='chart-container'>
          <Bar
            data={sprintProgressData}
            options={{
              responsive: true,
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    callback: function (value) {
                      return value;
                    }
                  }
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Sprint Task Status'
                },
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      return `${tooltipItem.dataset.label}: ${tooltipItem.raw} tasks`;
                    }
                  }
                },
                datalabels: {
                  color: '#fff',
                  font: {
                    weight: 'bold',
                  },
                  formatter: (value) => { return value > 0 ? `${value}` : ''; },
                }
              }
            }}
            style={{ height: '300px' }} 
          />
        </div>
      </div>

      <div className="chart-card">
        <div className="header">
          <h1 className="title">Project Members</h1>
        </div>
        <div className='chart-container'>
          <Pie
            data={memberData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      return `${tooltipItem.label}: ${tooltipItem.raw} member(s)`;
                    }
                  }
                },
                datalabels: {
                  color: '#fff',
                  font: {
                    weight: 'bold',
                  },
                  formatter: (value) => `${value}`,
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
