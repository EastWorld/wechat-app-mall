import compareVersion from './compare-version.js'
const TAG_NAME = 'TRTC-ROOM'

const env = wx ? wx : qq
if (!env) {
  console.error(TAG_NAME, '不支持当前小程序环境')
}
const systemInfo = env.getSystemInfoSync()
const safeArea = systemInfo.safeArea
if (systemInfo.system === 'iOS 13.3' || (systemInfo.model === 'iPhoneX' && systemInfo.system === 'iOS 13.3.1') ) {
  // audio-volume-type = media
  console.log('use media audio volume type')
}
console.log(TAG_NAME, 'SystemInfo', systemInfo)
let isNewVersion
if (typeof qq !== 'undefined') {
  isNewVersion = true
} else if (typeof wx !== 'undefined') {
  if (compareVersion(systemInfo.version, '7.0.8') >= 0 || // mobile pc
  (compareVersion(systemInfo.version, '2.4.0') >= 0 && compareVersion(systemInfo.version, '6.0.0') < 0) && // mac os
  compareVersion(systemInfo.SDKVersion, '2.10.0') >= 0) {
    isNewVersion = true
  } else {
    isNewVersion = false
  }
}

export const IS_TRTC = isNewVersion
export const IS_QQ = typeof qq !== 'undefined'
export const IS_WX = typeof wx !== 'undefined'
export const IS_IOS = /iOS/i.test(systemInfo.system)
export const IS_ANDROID = /Android/i.test(systemInfo.system)
export const IS_MAC = /mac/i.test(systemInfo.system)
export const APP_VERSION = systemInfo.version
export const LIB_VERSION = (function() {
  if (systemInfo.SDKBuild) {
    return systemInfo.SDKVersion + '-' + systemInfo.SDKBuild
  }
  return systemInfo.SDKVersion
})()

let isFullscreenDevie = false
if (systemInfo.screenHeight > safeArea.bottom) {
// if (/iphone\s{0,}x/i.test(systemInfo.model)) {
  isFullscreenDevie = true
}

export const IS_FULLSCREEN_DEVICE = isFullscreenDevie

console.log(TAG_NAME, 'APP_VERSION:', APP_VERSION, ' LIB_VERSION:', LIB_VERSION, ' is new version:', IS_TRTC)
