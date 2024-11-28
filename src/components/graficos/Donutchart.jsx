import React from 'react';
import ReactApexChart from 'react-apexcharts';
import style from "./graficos.module.css"

const DonutChart = ({ data }) => {
    if (!data || !data.series || !data.labels) {
        return <p>No data for DonutChart</p>;
    }
    const options = {
        chart: {
          type: 'donut',
        },
        labels: data.labels,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
        title: {
          text: 'Estado de Asistencias',
          align: 'center'
        },
        legend: {
            position: 'bottom'
        },
        colors: [
          'var(--donut-color-1)',
          'var(--donut-color-3)',
          'var(--donut-color-2)'
        ],
      };
    return (
        <div>
          <div className={style.donutChart}>
            <ReactApexChart options={options} series={data.series} type="donut" />
          </div>
        </div>
    );
};

export default DonutChart;