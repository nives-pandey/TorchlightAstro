// audit-design-system.mjs
import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATTERNS = [
    /#[a-fA-F0-9]{0,2}(5a|6a|7a|8a|9a|aa|ab|ac|ad|ae|af|b|c|d|e|f)[0-9a-fA-F]{0,2}[a-fA-F0-9]{2}/i,
    /hsl\(\s*(2[4-9][0-9]|3[0-5][0-9])\s*,/i,
    /hsl\(\s*(1[8-9][0-9]|2[0-3][0-9])\s*,/i,
    /'(Cinzel|Philosopher|Celtic|Gothic)'/i,
];
const ALLOWED_FILES = ['.tsx', '.ts', '.css'];
const DIRECTORY_TO_SCAN = './client/src';
let errorCount = 0;

function auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        FORBIDDEN_PATTERNS.forEach(pattern => {
            if (pattern.test(line)) {
                console.error(`❌ Design System Violation Found!
   - File: ${filePath}
   - Line: ${index + 1}
   - Issue: Forbidden color or font detected.
   - Code: "${line.trim()}"\n`);
                errorCount++;
            }
        });
    });
}

function scanDirectory(dir) {
    if (!fs.existsSync(dir)) {
        console.warn(`Warning: Directory not found: ${dir}. Skipping audit for this path.`);
        return;
    }
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (ALLOWED_FILES.includes(path.extname(fullPath))) {
            auditFile(fullPath);
        }
    });
}

console.log('--- Starting Torchlight Design System Audit ---');
scanDirectory(DIRECTORY_TO_SCAN);
console.log('--- Audit Complete ---');

if (errorCount > 0) {
    console.error(`\n🚨 Audit Failed: Found ${errorCount} design system violation(s).`);
    process.exit(1);
} else {
    console.log('\n✅ Audit Passed: No design system violations found.');
}