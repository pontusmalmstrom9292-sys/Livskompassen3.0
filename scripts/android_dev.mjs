import { networkInterfaces } from 'os';
import { execSync } from 'child_process';
import fs from 'fs';

// Find the local IP address
const nets = networkInterfaces();
let localIp = '';

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === 'IPv4' && !net.internal) {
      localIp = net.address;
      break; // Found one
    }
  }
  if (localIp) break;
}

if (!localIp) {
  localIp = '10.0.2.2'; // Fallback to Android emulator default
  console.log('Kunde inte hitta lokal IP, använder emulator-standard:', localIp);
}

const devUrl = `http://${localIp}:5173`;

console.log(`\n🚀 Konfigurerar Capacitor för Live Reload via Vite-servern på: ${devUrl}\n`);

try {
  // Ensure dist exists before cap sync
  if (!fs.existsSync('dist')) {
    console.log('Skapar temporär dist-mapp för Capacitor...');
    fs.mkdirSync('dist');
    fs.writeFileSync('dist/index.html', '<html><body>Startar Vite dev server...</body></html>');
  }

  // Write capacitor.config.json then sync (TS7 breaks capacitor.config.ts loader)
  execSync(`CAPACITOR_DEV_SERVER_URL=${devUrl} node scripts/write_capacitor_config.mjs && npx cap sync android`, {
    stdio: 'inherit',
  });

  console.log(`\n✅ Capacitor är nu inställd på Live Reload mot din Vite-server!\n`);
  console.log(`===========================================================`);
  console.log(`📋 NÄSTA STEG FÖR ATT KÖRA APPEN:`);
  console.log(`===========================================================`);
  console.log(`1. Se till att du har en terminal igång med: npm run dev`);
  console.log(`2. Öppna Android Studio genom att köra:      npm run android:open`);
  console.log(`3. Klicka på 'Run' (gröna play-knappen) i Android Studio för att bygga och starta appen på telefonen/emulatorn.`);
  console.log(`\nNär appen startar på telefonen kommer den direkt läsa från din Vite-server.`);
  console.log(`Ändringar du gör i koden (React/Vite) kommer uppdateras direkt på telefonen!\n`);
  console.log(`När du är klar med utvecklingen och vill bygga APK:n på riktigt igen:`);
  console.log(`Kör: npm run cap:sync\n`);

} catch (error) {
  console.error('\n❌ Ett fel uppstod vid synkning:', error.message);
}
