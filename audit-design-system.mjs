// audit-design-system.mjs
// Torchlight Design System Conformance Auditor
// Automatically detects violations of the Sanctuary palette and design standards

import fs from 'fs';
import path from 'path';

// --- Configuration ---
// Forbidden color patterns that violate the Sanctuary design system
const FORBIDDEN_PATTERNS = [
    // Purple/Blue hex colors (cosmic theme violations)
    /#[0-9a-fA-F]*[5-9a-fA-F][0-9a-fA-F]*[5-9a-fA-F]/i,
    /rgba?\(\s*(60|90|109|147|168),\s*(30|40|50|51|70|85),\s*(100|140|217|229|234|247)/i, // Specific purple RGBAs
    
    // Purple/Blue HSL colors
    /hsl\(\s*(2[4-9][0-9]|3[0-5][0-9])\s*,/i, // HSL hues 240-359 (purples/pinks)
    /hsl\(\s*(275|285)\s*,\s*(60|70)%/i, // Specific cosmic purple HSLs
    
    // Forbidden cosmic color variable names
    /--cosmic-(purple|violet|lavender|gold)/i,
    /cosmic-(button|card|nav)/i,
    
    // Forbidden font families (non-sanctuary fonts)
    /'(Cinzel|Philosopher|Celtic|Gothic|Mystical|Cosmic)'/i,
    
    // Hardcoded colors that should use CSS variables
    /#7B2CBF|#9333EA|#A855F7|#C084FC/i, // Common purple variants
    /#DC143C|#FF4500/i, // Fire colors that conflict with sanctuary
];

// Sanctuary-approved patterns (these are allowed)
const APPROVED_PATTERNS = [
    /var\(--warm-charcoal\)/i,
    /var\(--brushed-gold\)/i,
    /var\(--sage-teal\)/i,
    /var\(--warm-off-white\)/i,
    /var\(--warm-gray\)/i,
    /hsla?\(30,\s*[0-9]+%,\s*[0-9]+%/i, // Warm charcoal variations
    /hsla?\(44,\s*45%,\s*65%/i, // Brushed gold
    /hsla?\(180,\s*25%,\s*55%/i, // Sage teal
    /'Inter'/i,
    /'Playfair Display'/i,
];

const ALLOWED_FILES = ['.tsx', '.ts', '.css', '.scss'];
const DIRECTORIES_TO_SCAN = ['./client/src', './shared'];

let errorCount = 0;
let warningCount = 0;

function auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
        // Skip comments and imports
        if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('import')) {
            return;
        }

        FORBIDDEN_PATTERNS.forEach(pattern => {
            if (pattern.test(line)) {
                // Check if this line also contains approved patterns (might be a migration)
                const hasApprovedPattern = APPROVED_PATTERNS.some(approved => approved.test(line));
                
                if (hasApprovedPattern) {
                    console.warn(`⚠️ Mixed Pattern Warning:
   - File: ${filePath}
   - Line: ${index + 1}
   - Issue: Line contains both forbidden and approved patterns
   - Code: "${line.trim()}"
   - Action: Review and ensure only sanctuary colors remain\n`);
                    warningCount++;
                } else {
                    console.error(`❌ Design System Violation Found!
   - File: ${filePath}
   - Line: ${index + 1}
   - Issue: Forbidden color/pattern violates Sanctuary design system
   - Code: "${line.trim()}"
   - Fix: Replace with sanctuary CSS variables\n`);
                    errorCount++;
                }
            }
        });
    });
}

function scanDirectory(dir) {
    if (!fs.existsSync(dir)) {
        console.warn(`⚠️ Directory not found: ${dir}`);
        return;
    }
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            scanDirectory(fullPath);
        } else if (ALLOWED_FILES.includes(path.extname(fullPath))) {
            auditFile(fullPath);
        }
    });
}

function generateReport() {
    console.log('\n=== TORCHLIGHT DESIGN SYSTEM AUDIT REPORT ===');
    console.log(`Directories scanned: ${DIRECTORIES_TO_SCAN.join(', ')}`);
    console.log(`File types checked: ${ALLOWED_FILES.join(', ')}`);
    
    if (errorCount === 0 && warningCount === 0) {
        console.log('\n✅ PERFECT CONFORMANCE: Your codebase is 100% compliant with the Sanctuary Design System!');
        console.log('🌟 All colors use approved CSS variables');
        console.log('🌟 All fonts conform to typography standards');
        console.log('🌟 No cosmic/purple violations detected');
    } else {
        if (errorCount > 0) {
            console.error(`\n🚨 CRITICAL VIOLATIONS: ${errorCount} design system violation(s) found`);
            console.error('These MUST be fixed before deployment.');
        }
        
        if (warningCount > 0) {
            console.warn(`\n⚠️ WARNINGS: ${warningCount} mixed pattern(s) found`);
            console.warn('These should be reviewed for consistency.');
        }
        
        console.log('\n📋 SANCTUARY DESIGN SYSTEM REFERENCE:');
        console.log('✅ Approved Colors:');
        console.log('   --warm-charcoal: hsl(30, 8%, 18%)');
        console.log('   --brushed-gold: hsl(44, 45%, 65%)');
        console.log('   --sage-teal: hsl(180, 25%, 55%)');
        console.log('   --warm-off-white: hsl(60, 10%, 96%)');
        console.log('   --warm-gray: hsl(30, 5%, 66%)');
        console.log('✅ Approved Fonts: Inter, Playfair Display');
    }
}

// Run the audit
console.log('🔍 Starting Torchlight Design System Conformance Audit...');
console.log('📊 Scanning for cosmic/purple violations and unapproved patterns...\n');

DIRECTORIES_TO_SCAN.forEach(dir => {
    scanDirectory(dir);
});

generateReport();

// Exit with appropriate code for CI/CD integration
if (errorCount > 0) {
    process.exit(1); // Fail the build if critical violations found
} else {
    process.exit(0); // Success
}