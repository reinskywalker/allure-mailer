import fs from 'fs'; 

// read directory
export const readAllureFiles = dir => fs.readdirSync(dir);

// get result data
export const filterResultFiles = files => files.filter(fileName => fileName.includes('result'));

// parse each test run
export const parseAllureResults = (dir, files) => 
  files.map(fileName => JSON.parse(fs.readFileSync(`${dir}/${fileName}`, 'utf-8')));

// get id from tag_id
export const getUniquePQAIdentifiers = results => 
  [...new Set(results.flatMap(result => {
    const pqaIdentifier = result.name.split(' ').find(part => part.includes('TAG_IDENTIFIER') && !part.includes('@EXCLUDEE_TAG')); // adjust this based on identifier
    return pqaIdentifier ? [pqaIdentifier] : [];
  }).filter(Boolean))];

// calculate summary statistic
export const calculateSummaryStatistics = results => ({
  total: results.length,
  passed: results.filter(result => result.status === 'passed').length,
  failed: results.filter(result => result.status === 'failed').length,
  skipped: results.filter(result => result.status === 'skipped').length,
});

// calculate each individual data
export const calculatePQASummaryStatistics = (identifiers, results) => 
  identifiers.map(uid => {
    const pqaResults = results.filter(result => result.name.includes(uid));
    return {
      uid,
      total: pqaResults.length,
      passed: pqaResults.filter(result => result.status === 'passed').length,
      failed: pqaResults.filter(result => result.status === 'failed').length,
      skipped: pqaResults.filter(result => result.status === 'skipped').length,
    };
  });

// wrap up data
export const createSummaryJsonData = stats => [
  { measurement: 'summary', field: 'total', value: stats.total },
  { measurement: 'summary', field: 'passed', value: stats.passed },
  { measurement: 'summary', field: 'failed', value: stats.failed },
  { measurement: 'summary', field: 'skipped', value: stats.skipped },
];

// each individual wrap up data
export const createPQAJsonData = pqaStats => pqaStats.flatMap(stat => [
  { measurement: 'pqa-summary', tags: { uid: stat.uid }, field: 'total', value: stat.total },
  { measurement: 'pqa-summary', tags: { uid: stat.uid }, field: 'passed', value: stat.passed },
  { measurement: 'pqa-summary', tags: { uid: stat.uid }, field: 'failed', value: stat.failed },
  { measurement: 'pqa-summary', tags: { uid: stat.uid }, field: 'skipped', value: stat.skipped },
]);
