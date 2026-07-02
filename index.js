const fs = require('fs');
const path = require('path');

function getInput(inputName, fallback = '') {
  return process.env[`INPUT_${String(inputName).toUpperCase()}`] ?? fallback;
}

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

function appendSection(lines, heading, value) {
  const content = value.trim();
  if (!content) {
    return;
  }

  lines.push(`## ${heading}`, content, '');
}

function setOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  const delimiter = `EOF_${name}_${Date.now()}`;
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<${delimiter}\n${value}\n${delimiter}\n`);
}

try {
  const defaultUtcDate = new Date().toISOString().slice(0, 10);
  const reportDate = getInput('REPORT_DATE') || defaultUtcDate;
  const title = getInput('TITLE') || 'Daily EB Report';
  const lines = [`# ${title}`, '', `**Date:** ${reportDate}`, ''];

  appendSection(lines, 'Summary', getInput('SUMMARY'));
  appendSection(lines, 'Highlights', getInput('HIGHLIGHTS'));
  appendSection(lines, 'Blockers', getInput('BLOCKERS'));
  appendSection(lines, 'Next Steps', getInput('NEXT_STEPS'));

  const report = `${lines.join('\n').trimEnd()}\n`;
  const defaultDirectory = process.env.RUNNER_TEMP || process.cwd();
  const requestedOutputPath = getInput('OUTPUT_PATH').trim();
  const reportPath = path.resolve(defaultDirectory, requestedOutputPath || 'daily-eb-report.md');

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report, 'utf8');

  if (isTruthy(getInput('WRITE_STEP_SUMMARY', 'true')) && process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);
  }

  setOutput('report', report);
  setOutput('report_path', reportPath);
  process.stdout.write(`Generated report at ${reportPath}\n`);
} catch (error) {
  process.stderr.write(`Error generating report: ${error.message}\n`);
  process.exit(1);
}
