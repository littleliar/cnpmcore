import { load } from "all-package-names";
import urllib from 'urllib';
import { setTimeout } from 'timers/promises';

async function createTask(url: string) {
  const result = await urllib.request(url, {
    method: 'PUT',
    timeout: 10000,
    dataType: 'json',
  });
  return result;
}

async function main() {
  const data = await load();
  const total = data.packageNames.length;
  console.log('Total %d packages', total);
  const lastIndex = 0;
  for (const [ index, fullname ] of data.packageNames.entries()) {
    if (index < lastIndex) continue;
    let success = false;

    while (!success) {
      try {
        const url = `http://localhost:7001/-/package/${fullname}/syncs`;
        const result = await createTask(url);
        const data = result.data;
        if (data && data.id) {
          const logUrl = `${url}/${data.id}/log`;
          console.log('[%s/%s] %s, status: %s, log: %s', index, total, fullname, result.status, logUrl);
        } else {
          console.log('[%s/%s] %s, status: %s, data: %j', index, total, fullname, result.status, data);
        }
        success = true;
      } catch (err: any) {
        console.error('[%s/%s] %s, error: %s', index, total, fullname, err.message);
        await setTimeout(1000);
      }
    }
  }
}

main();
