import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = ({ data }) => {
  if (!data || !data.series || !data.categories) {
    return <p>No data for BarChart</p>;
  }

  const options = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: data.categories,
    },
    yaxis: {
      title: {
        text: 'Cantidad'
      }
    },
    title: {
      text: 'Gráfico de Barras',
      align: 'center'
    },
  };

  return (
    <div>
      <ReactApexChart options={options} series={data.series} type="bar" height={350} />
    </div>
  );
};

export default BarChart;