import * as assert from 'assert';
import { PathLike } from 'fs';
import { rm, access } from 'node:fs/promises';
import { dirExists, makeDir, fileExists, getFileText, putFileText } from './fs';

// Teardown utility
const teardown = async (path: PathLike): Promise<void> => {
    try {
        await rm(path, { recursive: true, force: true });
    } catch (err) {
        console.error(`Failed to remove ${path}:`, err);
    }
};

// Test dirExists
(async (): Promise<void> => {
    const path: PathLike = './testDir';

    // Setup
    await makeDir(path);

    // Test
    const exists = await dirExists(path);
    assert.strictEqual(exists, true);

    // Teardown
    await teardown(path);
})();

// Test makeDir
(async (): Promise<void> => {
    const path: PathLike = './anotherTestDir';

    // Test
    await makeDir(path);

    // Assert
    try {
        await access(path);
    } catch (err) {
        assert.fail(`Directory ${path} should exist`);
    }

    // Teardown
    await teardown(path);
})();

// Test fileExists and putFileText
(async (): Promise<void> => {
    const path: PathLike = './testFile.txt';
    const content: string = 'Hello, world!';

    // Setup
    await putFileText(path, content);

    // Test
    const exists = await fileExists(path);
    assert.strictEqual(exists, true);

    // Teardown
    await teardown(path);
})();

// Test getFileText
(async (): Promise<void> => {
    const path: PathLike = './anotherTestFile.txt';
    const content: string = 'File content';

    // Setup
    await putFileText(path, content);

    // Test
    const retrievedContent = await getFileText(path);
    assert.strictEqual(retrievedContent, content);

    // Teardown
    await teardown(path);
})();
