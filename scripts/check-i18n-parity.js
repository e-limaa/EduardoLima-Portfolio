const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const DOCS_ROOT = path.resolve(__dirname, '../src/app/docs');

// Configuration
const SOURCE_EXT = '.mdx';
const TARGET_EXT = '.pt-br.mdx';
const IGNORE_DIRS = ['mocks', 'examples']; // Directories to skip

async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);
        if (IGNORE_DIRS.includes(subdir)) return [];
        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

async function checkParity() {
    console.log('🌍 checks-i18n-parity: Scanning for missing translations...');

    try {
        const allFiles = await getFiles(DOCS_ROOT);

        // Filter down to just MDX files
        const mdxFiles = allFiles.filter(f => f.endsWith(SOURCE_EXT));

        // Separate Source (EN) from Target (PT-BR)
        const sourceFiles = mdxFiles.filter(f => !f.endsWith(TARGET_EXT));

        let missingCount = 0;

        sourceFiles.forEach(source => {
            // Construct expected target path: "file.mdx" -> "file.pt-br.mdx"
            // Note: If source is "file.mdx", we want "file.pt-br.mdx" in the same dir.

            // We need to handle the extension logic carefully.
            // My convention is: name.mdx (EN) -> name.pt-br.mdx (PT)
            // So simply inserting .pt-br before .mdx

            const dir = path.dirname(source);
            const filename = path.basename(source, SOURCE_EXT); // "file"
            const expectedTarget = path.join(dir, `${filename}${TARGET_EXT}`);

            if (!fs.existsSync(expectedTarget)) {
                console.error(`❌ Missing PT-BR translation: ${path.relative(process.cwd(), source)}`);
                console.error(`   Expected: ${path.relative(process.cwd(), expectedTarget)}`);
                missingCount++;
            }
        });

        if (missingCount > 0) {
            console.error(`\n🚨 Failed: Found ${missingCount} missing translations.`);
            console.error('All .mdx documentation files must have a corresponding .pt-br.mdx file.');
            process.exit(1);
        } else {
            console.log('✅ Success: All English documentation files have Portuguese counterparts.');
        }

    } catch (err) {
        console.error('Script failed:', err);
        process.exit(1);
    }
}

checkParity();
