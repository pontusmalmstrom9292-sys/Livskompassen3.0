import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log("\n🔍 Starting G85 Daily Driver Verification (Day 1)...\n");

const localPropsPath = 'android/local.properties';

// 1. Check local.properties
if (!fs.existsSync(localPropsPath)) {
    console.error("❌ FAIL: android/local.properties missing!");
    process.exit(1);
}

const localProps = fs.readFileSync(localPropsPath, 'utf8');
const hasDebugPin = localProps.includes('LK_DEBUG_SIGNATURE_SHA256');
const hasReleasePin = localProps.includes('LK_RELEASE_SIGNATURE_SHA256');

if (hasDebugPin) {
    console.log("✅ PASS: Debug Signature Pin configured.");
} else {
    console.warn("⚠️ WARN: Debug Signature Pin missing (will use default).");
}

if (hasReleasePin) {
    console.log("✅ PASS: Release Signature Pin configured.");
} else {
    console.error("❌ FAIL: Release Signature Pin missing! Release builds will fail.");
}

// 2. Run Gradle Verify task
try {
    console.log("\n📦 Running Titanium Security Verification...");
    execSync('cd android && ./gradlew verifySecurityComponents', { stdio: 'inherit' });
    console.log("✅ PASS: All critical architecture components verified.");
} catch (e) {
    console.error("❌ FAIL: Architecture violation detected!");
    process.exit(1);
}

// 3. Run Unit Tests
try {
    console.log("\n🧪 Running Android Unit Tests...");
    execSync('cd android && ./gradlew :app:testDebugUnitTest', { stdio: 'inherit' });
    console.log("✅ PASS: Core logic tests successful.");
} catch (e) {
    console.error("❌ FAIL: Unit tests failed!");
    process.exit(1);
}

console.log("\n🚀 G85 DAY 1 PRE-FLIGHT: SUCCESS");
console.log("Next step: Run the app on G85 and verify Sacred Lock (biometric).");
