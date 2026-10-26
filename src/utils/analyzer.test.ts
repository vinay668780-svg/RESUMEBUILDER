import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeResumeAgainstJob,
  auditResumeStructure,
  computeScoresFromSkills,
  countTermOccurrences,
} from './analyzer';
import { parseReadableTextFromBuffer } from './fileExtractor';
import { ROLE_PRESETS } from './presets';

test('countTermOccurrences accurately detects technical terms including special characters', () => {
  const sample = 'Built microservices in TypeScript, Node.js, and C++ with PostgreSQL and React.';
  const tsCount = countTermOccurrences(sample, ['TypeScript', 'ts']);
  assert.equal(tsCount.count, 1);

  const cppCount = countTermOccurrences(sample, ['C++']);
  assert.equal(cppCount.count, 1);

  const missingCount = countTermOccurrences(sample, ['Kubernetes', 'k8s']);
  assert.equal(missingCount.count, 0);
});

test('analyzeResumeAgainstJob identifies matched, partial, and missing skills accurately', () => {
  const preset = ROLE_PRESETS[0]; // Senior Full-Stack Engineer
  const report = analyzeResumeAgainstJob(preset.resumeText, preset.jobDescriptionText);

  assert.equal(report.candidateName, 'Elena Rostova');
  assert.ok(report.overallScore > 40 && report.overallScore < 98, `Expected realistic score, got ${report.overallScore}`);

  const matchedSkills = report.skills.filter((s) => s.status === 'matched').map((s) => s.skill);
  assert.ok(matchedSkills.includes('TypeScript'), 'TypeScript should be matched');
  assert.ok(matchedSkills.includes('React'), 'React should be matched');
  assert.ok(matchedSkills.includes('Docker'), 'Docker should be matched');

  const nonMatchedSkills = report.skills.filter((s) => s.status !== 'matched').map((s) => s.skill);
  assert.ok(
    nonMatchedSkills.includes('Kubernetes') || nonMatchedSkills.includes('Terraform'),
    'Kubernetes or Terraform should be flagged as missing or partial'
  );

  assert.ok(report.improvements.length >= 2, 'Should generate actionable improvements');
});

test('computeScoresFromSkills increases overall score when missing skills are simulated', () => {
  const preset = ROLE_PRESETS[0];
  const report = analyzeResumeAgainstJob(preset.resumeText, preset.jobDescriptionText);

  const missingIds = report.skills.filter((s) => s.status !== 'matched').map((s) => s.id);
  assert.ok(missingIds.length > 0, 'Preset has missing/partial skills to simulate');

  const simulatedSet = new Set<string>(missingIds);
  const updated = computeScoresFromSkills(report.skills, report.atsScore, simulatedSet);

  assert.ok(
    updated.overallScore > report.overallScore,
    `Simulated score (${updated.overallScore}) should exceed initial score (${report.overallScore})`
  );
});

test('auditResumeStructure evaluates contact info, sections, and quantified bullets', () => {
  const preset = ROLE_PRESETS[0];
  const audit = auditResumeStructure(preset.resumeText);

  assert.equal(audit.summary.contactDetected, true);
  assert.equal(audit.summary.experienceDetected, true);
  assert.equal(audit.summary.skillsDetected, true);
  assert.equal(audit.summary.educationDetected, true);
  assert.ok(audit.summary.quantifiedBulletCount >= 2);
});

test('parseReadableTextFromBuffer extracts clean text from HTML and PDF streams', () => {
  const htmlResume = '<html><body><h1>Jane Doe</h1><p>Senior Engineer with TypeScript &amp; React</p></body></html>';
  const extractedHtml = parseReadableTextFromBuffer(htmlResume, 'resume.html');
  assert.ok(extractedHtml.includes('Jane Doe'));
  assert.ok(extractedHtml.includes('TypeScript & React'));

  const pdfStream = '%PDF-1.4 (Jane Doe) (Senior Full-Stack Engineer) (Experience with Python and Kubernetes) (Built scalable microservices) (Education B.S. Computer Science)';
  const extractedPdf = parseReadableTextFromBuffer(pdfStream, 'resume.pdf');
  assert.ok(extractedPdf.includes('Jane Doe'));
  assert.ok(extractedPdf.includes('Kubernetes'));
});

