import fs from 'fs';
import {getContent} from './template_engine.mjs';
import {createChart} from './generate_chart.mjs'
import {
  readAllureFiles,
  filterResultFiles,
  parseAllureResults,
  getUniquePQAIdentifiers,
  calculateSummaryStatistics,
  createSummaryJsonData,
  calculatePQASummaryStatistics,
  createPQAJsonData,
} from './generate_allure.mjs';
import nodemailer from 'nodemailer';
import {createMailOptions} from '../generate_report.mjs'
import dotenv from 'dotenv';
dotenv.config();
const sendEmail = async mailOptions => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_KEY,
      },
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const main = async (contentConfig, isDebug) => {
  const allureDir = contentConfig.allurePath;
  const allureFiles = readAllureFiles(allureDir);
  const resultFiles = filterResultFiles(allureFiles);
  const allureResults = parseAllureResults(allureDir, resultFiles);
  const uniquePQAIdentifiers = getUniquePQAIdentifiers(allureResults);
  const summaryStatistics = calculateSummaryStatistics(allureResults);
  const pqaSummaryStatistics = calculatePQASummaryStatistics(uniquePQAIdentifiers, allureResults);

  const summaryJsonData = createSummaryJsonData(summaryStatistics);
  const pqaJsonData = createPQAJsonData(pqaSummaryStatistics);
  const chartData = [
    summaryJsonData.find((item) => item.field === 'total').value,
    summaryJsonData.find((item) => item.field === 'passed').value,
    summaryJsonData.find((item) => item.field === 'failed').value,
    summaryJsonData.find((item) => item.field === 'skipped').value,
  ];

  const formedData = {};

  pqaJsonData.forEach((item) => {
    const uid = item.tags.uid;
    if (!formedData[uid]) {
      formedData[uid] = {total: 0, passed: 0, failed: 0, skipped: 0};
    }

    if (item.field === 'total') {
      formedData[uid].total = item.value;
    } else if (item.field === 'passed') {
      formedData[uid].passed = item.value;
    } else if (item.field === 'failed') {
      formedData[uid].failed = item.value;
    } else if (item.field === 'skipped') {
      formedData[uid].skipped = item.value;
    }
  });

  console.info(formedData);
  console.info(summaryStatistics);
  await createChart(chartData, contentConfig.chartAsAttachment);

  const mailOptions = createMailOptions(
      contentConfig.imageCID,
      summaryStatistics,
      formedData,
  );

  if(!isDebug) {  // takeout NOT operator to enable logger and not sending anything to mail transporter
    await sendEmail(mailOptions); 
  }

  fs.writeFileSync('./report.html', getContent({
    contentTitle: contentConfig.title,
    reportUrl: contentConfig.reportUrl,
    imageCID: contentConfig.chartAsAttachment,
    localDate: contentConfig.localDate,
    getSummary: summaryStatistics,
    individualData: formedData,
  },
  ));
  console.log('success');
};