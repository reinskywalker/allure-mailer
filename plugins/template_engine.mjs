export function getContent({
  contentTitle: setTitle,
  reportUrl: reportUrl,
  imageCID: imageCID,
  localDate: localDate,
  getSummary: summaryStatistics,
  individualData: individualData,
}) {

  let individualDataRows = '';
  for (let key in individualData) {
    const data = individualData[key];
    individualDataRows += `
      <tr>
        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ccc;"><b>${key}</b></td>
        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ccc;">${data.total}</td>
        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ccc; color: #28a745;">${data.passed}</td>
        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ccc; color: #dc3545;">${data.failed}</td>
        <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ccc; color: #ffc107;">${data.skipped}</td>
      </tr>
    `;
  }

  return `
  <div style="max-width: 600px; margin: auto; padding: 20px; background-color: white; border: 1px solid #ccc; font-family: Arial, sans-serif;">
    <h1 style="font-size: 24px; color: #333; margin-top: 0">${setTitle}</h1>
    <p style="font-size: 16px; color: #666">Allure Docker Service</p>
    <hr style="border: 0; height: 1px; background-color: #ccc; margin: 20px 0" />
    <div style="margin-bottom: 20px">
      <h5 style="margin: 5px 0; font-size: 14px; color: #333">Test Type:
        <span style="background-color: #6c757d; color: white; padding: 3px 7px; font-size: 12px; border-radius: 10px;">UI Automated Test</span>
      </h5>
      <h5 style="margin: 5px 0; font-size: 14px; color: #333">Environment:
        <span style="background-color: #6c757d; color: white; padding: 3px 7px; font-size: 12px; border-radius: 10px;">DEV</span>
      </h5>
      <h5 style="margin: 5px 0; font-size: 14px; color: #333">Runtime Date: ${localDate}</h5>
      <h5 style="margin: 5px 0; font-size: 14px; color: #333">Server Link:
        <a href="${reportUrl}" style="color: blue; text-decoration: none" target="_blank">View Report</a>
      </h5>
    </div>
    <div style="overflow-x: auto">
      <table style="width: 100%; border-collapse: collapse">
        <thead>
          <tr style="background-color: #343a40; color: white">
            <th style="padding: 8px; text-align: left">Total</th>
            <th style="padding: 8px; text-align: left">Passed</th>
            <th style="padding: 8px; text-align: left">Failed</th>
            <th style="padding: 8px; text-align: left">Skipped</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ccc;"><b>${(summaryStatistics.total)}</b></td>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ccc; color: #28a745;"><b>${(summaryStatistics.passed)}</b></td>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ccc; color: #dc3545;"><b>${summaryStatistics.failed}</b></td>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ccc; color: #ffc107;"><b>${summaryStatistics.skipped}</b></td>
          </tr>
        </tbody>
      </table>
      <h3 style="font-size: 20px; color: #333; margin-top: 20px">Individual Data</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px">
        <thead>
          <tr style="background-color: #343a40; color: white">
            <th style="padding: 8px; text-align: left">ID</th>
            <th style="padding: 8px; text-align: left">Total</th>
            <th style="padding: 8px; text-align: left">Passed</th>
            <th style="padding: 8px; text-align: left">Failed</th>
            <th style="padding: 8px; text-align: left">Skipped</th>
          </tr>
        </thead>
        <tbody>
          ${individualDataRows}
        </tbody>
      </table>
    </div>
  </div>
  `;
}
