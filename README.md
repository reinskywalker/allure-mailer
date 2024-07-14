# Documentation

## Overview

This script is designed to compose and send an email report using dynamic content and configuration settings. The script utilizes a template engine for generating the email's HTML content and dotenv for environment variable management.

## Prerequisites

- Node.js installed on your machine.
- Required dependencies installed via npm:
  - `dotenv`: For loading environment variables from a `.env` file.
  - `getContent` and `main` functions from `template_engine.mjs` and `mail_composer.mjs` respectively.
  - `getArguments` function from `argument_config.mjs`.

## Script Breakdown

### 1. Importing Required Modules

```javascript
import { getContent } from './plugins/template_engine.mjs';
import { main } from './plugins/mail_composer.mjs';
import dotenv from 'dotenv';
import { getArguments } from './plugins/argument_config.mjs';
dotenv.config();
```

- `getContent`: A function to generate HTML content for the email.
- `main`: A function to send the composed email.
- `dotenv`: Module to load environment variables from a `.env` file.
- `getArguments`: Function to retrieve command-line arguments.

### 2. Retrieve Arguments

```javascript
const { debug, env } = getArguments();
console.log(getArguments());
```

- Retrieves `debug` and `env` arguments using the `getArguments` function.
- Logs the arguments to the console for debugging purposes.

### 3. Content Configuration

```javascript
const contentConfig = {
  /* content configuration */
  dateObject: new Date(),
  get localDate() { return new Date(this.dateObject.getTime() + (7 * 60 * 60 * 1000)); },
  env: env || 'dev',
  title: 'TITLE_FOR_REPORTER',
  get reportUrl() { return `https://YOUR_REPORT_LINK${this.env}`; },
  /* mail configuration */
  imageCID: 'unique@cid.image',
  allurePath: './reports/webdriverio/',
  envAbbr: 'dev',
  chartImgName: 'testcase_summary.jpeg',
  chartImgPath: 'data/image',
  get chartAsAttachment() {
    return `${this.chartImgPath}/${this.chartImgName}`;
  },
};
```

- `dateObject`: Current date and time.
- `localDate`: Adjusted date and time for the local timezone (UTC+7).
- `env`: Environment setting, defaults to 'dev' if not provided.
- `title`: Title for the reporter.
- `reportUrl`: URL for the report, dynamically generated based on the environment.
- `imageCID`: Unique identifier for the inline image in the email.
- `allurePath`: Path to the Allure report.
- `envAbbr`: Environment abbreviation.
- `chartImgName`: Name of the chart image file.
- `chartImgPath`: Path to the directory containing the chart image.
- `chartAsAttachment`: Full path to the chart image file.

### 4. Create Mail Options

```javascript
export const createMailOptions = (cid, stats, individualStats) => ({
  from: 'NAME_MASK <SENDER_MAIL>',
  to: 'DESTINATION_MAIL_ADDRESS',
  subject: `MAIL_SUBJECT - ${contentConfig.localDate}`,
  html: getContent({
    contentTitle: contentConfig.title,
    reportUrl: contentConfig.reportUrl,
    imageCID: cid,
    localDate: contentConfig.localDate,
    getSummary: stats,
    individualData: individualStats,
  }),
  attachments: [{ filename: contentConfig.chartImgName, path: contentConfig.chartAsAttachment, cid }],
});
```

- `createMailOptions`: Function to create the mail options.
  - `from`: Sender's email address.
  - `to`: Recipient's email address.
  - `subject`: Email subject including the local date.
  - `html`: HTML content generated using the `getContent` function.
  - `attachments`: Attachments for the email, including the chart image.

### 5. Main Function Call

```javascript
main(contentConfig, debug || false);
```

- Calls the `main` function with the `contentConfig` and `debug` flag.

---

## How to Use

1. **Install Dependencies**:
   Ensure you have installed all the necessary dependencies using npm:
   ```bash
   npm install dotenv
   ```

2. **Set Up Environment Variables**:
   Create a `.env` file in the root of your project and add your environment variables:
   ```env
   SENDER_MAIL=your_sender_email@example.com
   DESTINATION_MAIL_ADDRESS=recipient_email@example.com
   ```

3. **Run the Script**:
   Execute the script using Node.js:
   ```bash
   node your_script.js
   ```
