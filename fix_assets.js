const fs = require('fs');
const path = require('path');

// Test suite inside the script to guarantee regex safety before modifying any file
const testCases = [
    {
        input: 'src="assets/1.png"',
        expected: 'src="1.png"'
    },
    {
        input: "url('assets/on-track.png')",
        expected: "url('on-track.png')"
    },
    {
        input: 'src="https://www.lego.com/cdn/cs/set-v2/assets/logo.svg"',
        expected: 'src="https://www.lego.com/cdn/cs/set-v2/assets/logo.svg"'
    },
    {
        input: 'src="assets/a.png"',
        expected: 'src="qq.png"'
    },
    {
        input: "href='assets/a.png'",
        expected: "href='qq.png'"
    },
    {
        input: 'alt="assets/a.png"',
        expected: 'alt="qq.png"'
    }
];

function performReplacement(content) {
    // 1. Replace assets/a.png -> qq.png (case-insensitive, local paths only)
    // We match assets/a.png, ensuring there is no http:// or https:// before it in the URL/string
    content = content.replace(/(?<!https?:\/\/[^\s'"]+)assets\/a\.png/gi, 'qq.png');

    // 2. Replace other assets/ -> empty string (local paths only)
    content = content.replace(/(?<!https?:\/\/[^\s'"]+)assets\//gi, '');

    return content;
}

// Run self-tests
console.log('Running self-tests for regex replacement...');
let allPassed = true;
testCases.forEach((tc, idx) => {
    const result = performReplacement(tc.input);
    if (result !== tc.expected) {
        console.error(`Test Case ${idx + 1} FAILED! Input: ${tc.input} | Expected: ${tc.expected} | Got: ${result}`);
        allPassed = false;
    } else {
        console.log(`Test Case ${idx + 1} PASSED.`);
    }
});

if (!allPassed) {
    console.error('Self-tests failed! Aborting execution.');
    process.exit(1);
}
console.log('All self-tests passed successfully! Starting file processing...\n');

const dir = 'c:/Users/user/Desktop/my';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    
    // Ignore the current script and other fix scripts
    if (file === 'fix_assets.js' || file === 'fix_text.js' || file === 'sync_header.js') {
        return;
    }

    let originalContent = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains local assets/ reference (or assets/a.png)
    // We check if performReplacement makes any difference
    const updatedContent = performReplacement(originalContent);
    
    if (originalContent !== updatedContent) {
        // Output changes line by line for verification
        const origLines = originalContent.split('\n');
        const updLines = updatedContent.split('\n');
        console.log(`--- Modifying ${file} ---`);
        for (let i = 0; i < origLines.length; i++) {
            if (origLines[i] !== updLines[i]) {
                console.log(`Line ${i + 1}:`);
                console.log(`  - ${origLines[i].trim()}`);
                console.log(`  + ${updLines[i].trim()}`);
            }
        }
        
        // Write the updated file safely in UTF-8
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Successfully updated ${file}\n`);
    }
});

console.log('Asset path update process completed!');
