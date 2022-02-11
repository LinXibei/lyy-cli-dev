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
const pathExists = require('path-exists').sync;
const userHome = require('os').homedir();
module.exports = core;

let args;
function core() {
  // TODO
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    log.verbose('debug', 'test debug');
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
function checkRoot() {
  // 默认调取了process.seteuid() 和process.setguid()
  const rootCheck = require("root-check");
  rootCheck();
  // console.log(process.geteuid());// 获取当前uid，0为root
}
function checkUserHome() {
  // user-home，用到的是os homedir方法实现
  // path-exists，用到的是fs.accessSync方法实现
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前用户主目录不存在'));
  }
}

function checkInputArgs() {
  const minimist = require('minimist');
  args = minimist(process.argv.slice(2));
  checkArgs();
}
function checkArgs() {
  process.env.LOG_LEVEL = args.debug ? 'verbose' : 'info';
  log.level = process.env.LOG_LEVEL;
}
