#!/usr/bin/env node
/**
 * Extract a map of all events from data/events.js for review.
 * Run: node scripts/extract-events-map.js
 * Output: events-map.md (and optionally events-map.json)
 * 
 * Uses vm to load events.js with a mock gameState (functions are not executed).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.join(__dirname, '..');
const eventsPath = path.join(repoRoot, 'data', 'events.js');
const outMdPath = path.join(repoRoot, 'events-map.md');
const outJsonPath = path.join(repoRoot, 'events-map.json');

// Mock gameState so condition/getChoices functions don't throw when we read static props
const sandbox = { gameState: {} };
let code = fs.readFileSync(eventsPath, 'utf8');
// Use var so events is assigned to sandbox (const/let may not expose to context)
code = code.replace(/\bconst events\s*=/, 'var events =');
let events;
try {
  vm.runInNewContext(code, sandbox);
  events = sandbox.events;
} catch (e) {
  console.error('Failed to load events.js:', e.message);
  process.exit(1);
}

if (!Array.isArray(events)) {
  console.error('events is not an array');
  process.exit(1);
}

function extractEventMap(e) {
  const desc = typeof e.description === 'string' ? e.description.substring(0, 80) + (e.description.length > 80 ? '...' : '') : '(dynamic)';
  const choices = (e.choices || []).map(c => ({
    text: (c.text || '').substring(0, 60),
    effects: c.effects || {},
    flags: c.flags ? Object.keys(c.flags) : [],
    action: c.action || null,
  }));
  return {
    id: e.id,
    title: e.title,
    type: e.type || '—',
    monthRange: e.monthRange ? `[${e.monthRange[0]}, ${e.monthRange[1]}]` : '—',
    mandatory: !!e.mandatory,
    unique: !!e.unique,
    priority: e.priority ?? '—',
    special: e.special || null,
    dynamicChoices: !!e.dynamicChoices,
    choicesCount: choices.length,
    description: desc,
    choices,
  };
}

const map = events.map(extractEventMap);

// JSON output
fs.writeFileSync(outJsonPath, JSON.stringify(map, null, 2), 'utf8');
console.log(`Wrote ${outJsonPath}`);

// Markdown output
const md = [];
md.push('# Chez Julien — All Events Map');
md.push('');
md.push(`> Extracted ${map.length} events — for review and planning changes`);
md.push('');
md.push('## Summary Table');
md.push('');
md.push('| # | ID | Title | Type | Months | Mand. | Unique | Prior. | Choices |');
md.push('|---|-----|-------|------|--------|-------|--------|--------|---------|');

map.forEach((m, i) => {
  const mand = m.mandatory ? '✓' : '';
  const uniq = m.unique ? '✓' : '';
  const prior = m.priority !== '—' ? m.priority : '';
  md.push(`| ${i + 1} | \`${m.id}\` | ${m.title} | ${m.type} | ${m.monthRange} | ${mand} | ${uniq} | ${prior} | ${m.choicesCount} |`);
});

md.push('');
md.push('## Full Event Details');
md.push('');

map.forEach((m, i) => {
  md.push(`### ${i + 1}. ${m.title} (\`${m.id}\`)`);
  md.push('');
  md.push(`- **Type:** ${m.type} | **Month range:** ${m.monthRange}`);
  if (m.mandatory) md.push('- **Mandatory**');
  if (m.unique) md.push('- **Unique**');
  if (m.priority !== '—') md.push(`- **Priority:** ${m.priority}`);
  if (m.special) md.push(`- **Special:** ${m.special}`);
  if (m.dynamicChoices) md.push('- **Dynamic choices**');
  md.push(`- **Description:** ${m.description}`);
  md.push('- **Choices:**');
  m.choices.forEach((c, j) => {
    const eff = Object.keys(c.effects).length ? ` effects: ${JSON.stringify(c.effects)}` : '';
    const fl = c.flags.length ? ` flags: [${c.flags.join(', ')}]` : '';
    const act = c.action ? ` action: ${c.action}` : '';
    md.push(`  ${j + 1}. "${c.text}"${eff}${fl}${act}`);
  });
  md.push('');
});

fs.writeFileSync(outMdPath, md.join('\n'), 'utf8');
console.log(`Wrote ${outMdPath}`);
console.log(`\nDone. ${map.length} events extracted.`);
