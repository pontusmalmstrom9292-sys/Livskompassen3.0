import { execSync } from 'child_process';

try {
  console.log('Fetching functions...');
  const output = execSync('npx firebase functions:list --json', { encoding: 'utf-8' });
  // Find the first '{' to ignore warnings
  const jsonStr = output.substring(output.indexOf('{'));
  const parsed = JSON.parse(jsonStr);
  const funcs = parsed.result || [];
  
  const v1Funcs = funcs.filter(f => f.platform === 'gcfv1');
  console.log(`Found ${v1Funcs.length} v1 functions.`);
  
  for (const f of v1Funcs) {
    console.log(`Deleting ${f.id} (${f.region})...`);
    execSync(`npx firebase functions:delete ${f.id} --region ${f.region} --force`, { stdio: 'inherit' });
  }
} catch (e) {
  console.error(e);
}
