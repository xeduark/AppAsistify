import React from 'react';
import ReactApexChart from 'react-apexcharts';
import style from './graficos.module.css';

const BarCiudades = ({ data }) => {
  if (!data || !data.series || !data.categories) {
    return <p>No data for Ciudades Chart</p>;
  }

  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data.categories,
    },
    yaxis: {
      title: {
        text: 'Cantidad',
      },
    },
    title: {
      text: 'Ciudades de residencia de empleados',
      align: 'center',
    },
  };

  return (
    <div>
      <div className={style.barChart}>
        <ReactApexChart options={options} series={data.series} type="bar" height={350} />
      </div>
    </div>
  );
};

export default BarCiudades;
