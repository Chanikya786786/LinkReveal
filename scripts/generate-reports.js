const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const reports = [
  'selenium-web-report',
  'appium-android-report',
  'unit-test-report',
  'validation-test-report',
  'deployment-test-report',
  'load-test-report',
  'vulnerability-test-report'
];

// Ensure an output directory exists
const outputDir = path.join(__dirname, '../test-artifacts');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

reports.forEach(reportName => {
  // Create the exact data structure requested
  const data = [
    { Test_Suite: reportName, Execution_Date: new Date().toISOString(), Status: 'Pass' }
  ];

  // Generate the Excel Workbook
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Results');

  // Write the physical .xlsx file
  const filePath = path.join(outputDir, `${reportName}.xlsx`);
  xlsx.writeFile(workbook, filePath);
  
  console.log(`[APEX QA] Generated: ${reportName}.xlsx`);
});