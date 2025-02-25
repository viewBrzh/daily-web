import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the datalabels plugin
import { DashboardData } from '../types';

interface DashboardProps {
  data: DashboardData;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels); // Register the plugin

const DashboardCharts: React.FC<DashboardProps> = ({ data }) => {
  // Data for Task Status Pie Chart
  const taskStatusData = {
    labels: data.taskStatus.map(item => item.status),
    datasets: [
      {
        label: 'Task Status Count',
        data: data.taskStatus.map(item => item.count),
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
    labels: data.sprintProgress.map(sprint => sprint.sprintName),
    datasets: [
      {
        label: 'Done',
        data: data.sprintProgress.map(sprint => sprint.statusCount?.Done || 0), // Handle null safely
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'In-Progress',
        data: data.sprintProgress.map(sprint => sprint.statusCount?.['In-Progress'] || 0), // Handle null safely
        backgroundColor: 'rgb(54, 162, 235)',
      },
      {
        label: 'Pending',
        data: data.sprintProgress.map(sprint => sprint.statusCount?.Pending || 0), // Handle null safely
        backgroundColor: 'rgb(255, 206, 86)',
      },
      {
        label: 'New',
        data: data.sprintProgress.map(sprint => sprint.statusCount?.New || 0), // Handle null safely
        backgroundColor: 'rgb(75, 192, 192)',
      }
    ]
  };

  // Data for Project Members Pie Chart
  const memberData = {
    labels: data.members.map(member => member.role),
    datasets: [
      {
        label: 'Members by Role',
        data: data.members.map(member => member.count),
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
                      return `${tooltipItem.label}: ${value} tasks (${((value / data.taskStatus.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(2)}%)`;
                    }
                  }
                },
                datalabels: {
                  color: '#fff', // You can customize the color of the data labels
                  font: {
                    weight: 'bold',
                  },
                  formatter: (value) => `${value}`, // Display the number of tasks
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
                  formatter: (value) => { return value > 0 ? `${value}` : ''; }, // Display the number of tasks
                }
              }
            }}
            style={{ height: '300px' }} // Set fixed height for the bar chart
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
                  formatter: (value) => `${value}`, // Display the number of members
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
