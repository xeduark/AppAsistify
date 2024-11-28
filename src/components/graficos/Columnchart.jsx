import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ColumnChart = ({ data }) => {
    if (!data || !data.series || !data.categories) {
        return <p>No data for ColumnChart</p>;
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
            text: 'Empleados',
            align: 'center'
        },
    };
    return (
        <div>
            <ReactApexChart options={options} series={data.series} type="bar" height={350} />
        </div>
    );
};
export default ColumnChart;