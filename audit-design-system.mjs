// audit-design-system.mjs
import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATTERNS = [
    // Purple/cosmic colors that violate sanctuary palette
    /#[a-fA-F0-9]{0,2}(5a|6a|7a|8a|9a|aa|ab|ac|ad|ae|af|b|c|d|e|f)[0-9a-fA-F]{0,2}[a-fA-F0-9]{2}/i,
    // HSL values outside sanctuary range
    /hsl\(\s*(2[4-9][0-9]|3[0-5][0-9])\s*,/i,
    /hsl\(\s*(1[8-9][0-9]|2[0-3][0-9])\s*,/i,
    // Non-sanctuary fonts
    /'(Cinzel|Philosopher|Celtic|Gothic)'/i,
    // Hardcoded purple/cosmic colors
    /#8B5CF6|#A855F7|#9333EA|#7C3AED|#6D28D9|#5B21B6/i,
    // CSS purple variants
    /purple-[0-9]+/i,
    /violet-[0-9]+/i,
];

const ALLOWED_FILES = ['.tsx', '.ts', '.css'];
const DIRECTORIES_TO_SCAN = ['./client/src', './shared'];
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

console.log('🔍 Starting Torchlight Design System Audit...');
console.log('📋 Checking for sanctuary palette compliance...\n');

DIRECTORIES_TO_SCAN.forEach(dir => {
    console.log(`Scanning: ${dir}`);
    scanDirectory(dir);
});

console.log('\n--- Audit Complete ---');

if (errorCount > 0) {
    console.error(`\n🚨 Audit Failed: Found ${errorCount} design system violation(s).`);
    console.error('Please fix violations to maintain sanctuary palette consistency.');
    process.exit(1);
} else {
    console.log('\n✅ Audit Passed: No design system violations found.');
    console.log('🏛️ Sanctuary palette integrity maintained.');
}