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
  console.log('Total %d packages', data.packageNames.length);
  const lastIndex = 30;
  for (const [ index, fullname ] of data.packageNames.entries()) {
    if (index < lastIndex) continue;
    let success = false;
    try {
      const url = `https://r2.cnpmjs.org/-/package/${fullname}/syncs`;
      const result = await createTask(url);
      const data = result.data;
      if (data && data.id) {
        const logUrl = `${url}/${data.id}/log`;
        console.log('[%s] %s, status: %s, log: %s', index, fullname, result.status, logUrl);
      } else {
        console.log('[%s] %s, status: %s, data: %j', index, fullname, result.status, data);
      }
      success = true;
    } catch (err) {
      console.error('[%s] %s, error: %s', index, fullname, err);
      await setTimeout(1000);
    }

    if (success) continue;
    // try r2g

    try {
      const url = `https://r2g.cnpmjs.org/-/package/${fullname}/syncs`;
      const result = await createTask(url);
      const data = result.data;
      if (data && data.id) {
        const logUrl = `${url}/${data.id}/log`;
        console.log('[%s] %s, status: %s, log: %s', index, fullname, result.status, logUrl);
      } else {
        console.log('[%s] %s, status: %s, data: %j', index, fullname, result.status, data);
      }
    } catch (err) {
      console.error('[%s] %s, error: %s', index, fullname, err);
      await setTimeout(1000);
    }
  }
}

main();
