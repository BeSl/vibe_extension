import * as path from 'path';
import { glob } from 'glob';

export function run(): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            // Import and instantiate Mocha
            const mochaClass = require('mocha');
            const mochaInstance = new mochaClass({
                ui: 'tdd',
                color: true,
                timeout: 10000
            });

            const testsRoot = path.resolve(__dirname, '..');

            // Find and add test files
            glob('**/**.test.js', { cwd: testsRoot })
                .then(files => {
                    // Add files to the test suite
                    files.forEach(f => {
                        const testFile = path.resolve(testsRoot, f);
                        console.log('Adding test file:', testFile);
                        mochaInstance.addFile(testFile);
                    });

                    // Run the tests
                    mochaInstance.run((failures: number) => {
                        if (failures > 0) {
                            reject(new Error(`${failures} tests failed.`));
                        } else {
                            console.log('All tests passed!');
                            resolve();
                        }
                    });
                })
                .catch(reject);
        } catch (err) {
            console.error('Error setting up tests:', err);
            reject(err);
        }
    });
}