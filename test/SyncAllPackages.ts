import { load } from "all-package-names";
import urllib from 'urllib';
import { setTimeout } from 'timers/promises';

async function createTask(url: string) {
  const result = await urllib.request(url, {
    method: 'PUT',
    timeout: 10000,
    dataType: 'json',
    contentType: 'json',
    data: {
      syncDownloadData: true,
      skipDependencies: true,
    },
  });
  return result;
}

async function main() {
  const data = await load();
  console.log('Total %d packages', data.packageNames.length);
  const lastIndex = 145619;
  for (const [ index, fullname ] of data.packageNames.entries()) {
    if (index < lastIndex) continue;
    let success = false;
    // try {
    //   const url = `https://registry.npmmirror.com/${fullname}/sync?sync_upstream=true`;
    //   const result = await createTask(url);
    //   const data = result.data;
    //   if (data && data.logId) {
    //     const logUrl = `https://registry.npmmirror.com/${fullname}/sync/log/${data.logId}`;
    //     console.log('[%s] %s, status: %s, log: %s', index, fullname, result.status, logUrl);
    //   } else {
    //     console.log('[%s] %s, status: %s, data: %j', index, fullname, result.status, data);
    //   }
    //   success = true;
    // } catch (err) {
    //   console.error('[%s] %s, error: %s', index, fullname, err);
    // }

    // await setTimeout(1000);
    // if (success) continue;

    // try {
    //   const url = `https://r2.cnpmjs.org/-/package/${fullname}/syncs`;
    //   const result = await createTask(url);
    //   const data = result.data;
    //   if (data && data.id) {
    //     const logUrl = `${url}/${data.id}/log`;
    //     console.log('[%s] %s, status: %s, log: %s', index, fullname, result.status, logUrl);
    //   } else {
    //     console.log('[%s] %s, status: %s, data: %j', index, fullname, result.status, data);
    //   }
    //   success = true;
    // } catch (err) {
    //   console.error('[%s] %s, error: %s', index, fullname, err);
    //   await setTimeout(1000);
    // }

    // if (success) continue;
    // try r2g

    while (!success) {
      try {
        const url = `https://r.cnpmjs.org/-/package/${fullname}/syncs`;
        const result = await createTask(url);
        const data = result.data;
        if (data && data.id) {
          const logUrl = `${url}/${data.id}/log`;
          console.log('[%s] %s, status: %s, log: %s', index, fullname, result.status, logUrl);
        } else {
          console.log('[%s] %s, status: %s, data: %j', index, fullname, result.status, data);
        }
        success = true;
      } catch (err: any) {
        console.error('[%s] %s, error: %s', index, fullname, err.message);
        await setTimeout(1000);
      }
    }
  }
}

main();
