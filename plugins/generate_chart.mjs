import fs from 'fs';
import {ChartJSNodeCanvas} from 'chartjs-node-canvas';
import dotenv from 'dotenv';
dotenv.config();

export const createChart = async (data, extPath) => {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({width: 400, height: 400, backgroundColour: 'white'});

  const configuration = {
    type: 'bar', /* https://www.chartjs.org/docs/latest/developers/charts.html */
    data: {
      labels: ['Passed', 'Failed', 'Skipped'], // metrics
      datasets: [{
        label: 'Test Results',
        data, /* data params */
        backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(255, 206, 86, 0.7)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 5,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {color: 'black', boxWidth: 20, font: {size: 14}},
        },
        title: {
          display: true,
          text: 'Test Results',
          color: 'black',
          font: {size: 16},
        },
      },
    },
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(extPath, imageBuffer);
};