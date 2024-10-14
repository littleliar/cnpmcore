/** spell-checker: disable */
/* eslint-disable array-bracket-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import FSClient from "fs-cnpm";
import { EggAppConfig, PowerPartial } from "egg";
import { ChangesStreamMode, SyncMode } from "../app/common/constants";
import { CnpmcoreConfig } from "../app/port/config";

export default (appInfo: EggAppConfig) => {
  /**
   * 可能需要修改的环境变量
   * CNPMCORE_CONFIG_REGISTRY
   * CNPMCORE_DATA_DIR
   * CNPMCORE_LOG_DIR
   * CNPMCORE_NFS_DIR
   *
   * 数据库相关变量
   * CNPMCORE_MYSQL_DATABASE/MYSQL_DATABASE
   * CNPMCORE_MYSQL_PASSWORD/MYSQL_PASSWORD
   */

  const config = {} as PowerPartial<EggAppConfig> & {
    cnpmcore: Partial<CnpmcoreConfig>;
  };

  config.keys = process.env.CNPMCORE_EGG_KEYS || randomUUID();
  config.cnpmcore = {
    sourceRegistry: "https://registry.npmmirror.com",
    sourceRegistryIsCNpm: true,
    syncMode: SyncMode.admin,
    enableChangesStream: true,
    changesStreamRegistry: "https://registry.npmmirror.com/_changes",
    changesStreamRegistryMode: ChangesStreamMode.json,
    registry: process.env.CNPMCORE_CONFIG_REGISTRY || "http://127.0.0.1:7001",
    allowScopes: ["@cnpm", "@cnpmcore", "@example"],
    admins: {
      registry_admin: process.env.CNPMCORE_PASSWORD || "admin@cnpmjs.org",
    },
  };

  config.dataDir =
    process.env.CNPMCORE_DATA_DIR || join(appInfo.root, ".cnpmcore");

  config.nfs = {
    client: null,
    dir: process.env.CNPMCORE_NFS_DIR || join(config.dataDir, "nfs"),
  };

  config.nfs.client = new FSClient({ dir: config.nfs.dir });

  return config;
};
