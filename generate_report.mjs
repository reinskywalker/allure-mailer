
import {getContent} from './plugins/template_engine.mjs';
import {main} from './plugins/mail_composer.mjs';
import dotenv from 'dotenv';
import {getArguments} from './plugins/argument_config.mjs'
dotenv.config();

const { debug, env } = getArguments();
console.log(getArguments())

const contentConfig = {
  /* content configuration */
  dateObject: new Date(),
  get localDate() {return new Date(this.dateObject.getTime() + (7 * 60 * 60 * 1000))},
  env: env || 'dev',
  title: 'TITLE_FOR_REPORTER',
  get reportUrl() { return `https://YOUR_REPORT_LINK${this.env}`},
  /* mail configuration*/
  imageCID: 'unique@cid.image',
  allurePath: './reports/webdriverio/',
  envAbbr: 'dev',
  chartImgName: 'testcase_summary.jpeg',
  chartImgPath: 'data/image',
  get chartAsAttachment() {
    return `${this.chartImgPath}/${this.chartImgName}`;
  },
};

export const createMailOptions = (cid, stats, individualStats) => ({
  from: 'NAME_MASK <SENDER_MAIL>',
  to: 'DESTINATION_MAIL_ADDRESS',
  subject: `MAIL_SUbJECT - ${contentConfig.localDate}`,
  html: getContent({
    contentTitle: contentConfig.title,
    reportUrl: contentConfig.reportUrl,
    imageCID: cid,
    localDate: contentConfig.localDate,
    getSummary: stats,
    individualData: individualStats,
  },
  ),
  attachments: [{filename: contentConfig.chartImgName, path: contentConfig.chartAsAttachment, cid}],
});

main(contentConfig, debug || false);


