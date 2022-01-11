'use strict';
/**
 * 命令执行流程
 * 准备阶段：检查版本号、检查node版本、检查root自动、检查用户主目录、检查入参、检查变量环境、检查是否为最新版本、提示更新
 * 命令注册：注册init命令、注册publish命令、注册clean命令、支持debug
 * 命令执行
*/
/**
 * require可以加载哪些文件
 * 1. 加载.js：必须module.exports/exports
 * 2. 加载.json: JSON.parse
 * 3. 加载.node: process.dlopen (C++ AddOn)
 * 4. 加载 非上述文件 any，会.js引擎进行解析，如果有js代码就正常解析，否则报错
*/
const pkg = require('../package.json');
const log = require('@lyy-cli-dev/log');
const colors = require('colors/safe');
const constant = require('./const');
const semver = require('semver');
module.exports = core;

function core() {
  // TODO
  try {
    checkPkgVersion();
    checkNodeVersion();
  } catch(e) {
    log.error(e.message);
  }
}
function checkPkgVersion() {
  log.notice('cli', pkg.version);
}

function checkNodeVersion() {
  // 获取当前node版本号
  const curVersion = process.version;
  // 比对最低版本号
  const lowestVersion = constant.LOWEST_NODE_VERSION;
  if (!semver.gte(curVersion, lowestVersion)) {
    throw new Error(colors.red(`lyy-cli-dev 需要安装v-${lowestVersion} 以上版本的node.js`));
  }
}