const CONFIG = require('../config.js')
const REQUEST_CACHE = []
const API_BASE_URL = 'https://api.it120.cc'
/**
 * 简单请求封装
 * url: 请求地址
 * data: 请求内容
 * method: 请求方法
 * cache: 缓存时长(单位: 秒)
 */
function FetchRequest(url, data, method = 'GET', cache = 0, header = {}, noSubDomain = false) {
  var request_key = GetStorageKey(url, method);
  console.log(111, cache)
  if (cache) {
    return new Promise(Storage);
  } else {
    return new Promise(Request);
  }

  /**
   * 缓存相关
   */
  function Storage(resolve, reject) {
    wx.getStorage({
      key: request_key,
      success: StorageSuccess,
      fail: StorageError
    })

    /**
     * 成功回调
     */
    function StorageSuccess(store) {
      if (CheckCache(store.data)) {
        resolve(store.data);
      } else {
        Request(resolve, reject);
      }
    }

    /**
     * 异常处理
     */
    function StorageError(err) {
      Request(resolve, reject);
    }
  }

  /**
   * 请求接口
   */
  function Request(resolve, reject) {
    // if (CheckRequest(request_key)) {
    //   return;
    // }
    SaveRequest(request_key);
    let _url = API_BASE_URL + '/' + CONFIG.subDomain + url
    if (noSubDomain) {
      _url = API_BASE_URL + url
    }
    wx.request({
      url: _url,
      method: method.toUpperCase(),
      data: data,
      header: header,
      success: FetchSuccess,
      fail: FetchError,
      complete: RequestOver
    })

    /**
     * 成功回调
     */
    function FetchSuccess(res) {
      SaveCache(res);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(res);
      } else {
        FetchError(res.data);
        switch (res.statusCode) {
          case 403:
            // 业务逻辑处理
            break
        }
      }
    }

    /**
     * 异常处理
     */
    function FetchError(err) {
      if (err) {
        wx.showToast({
          title: err.errMsg || err.message,
          icon: 'none',
          duration: 3000
        })
      }
      reject(err);
    }
  }

  /**
   * 保存缓存信息
   */
  function SaveCache(res) {
    if (cache > 0 && res.statusCode >= 200 && res.statusCode < 300) {
      res.timestamp = Date.parse(new Date()) + cache * 1000;
      wx.setStorage({
        key: GetStorageKey(url, method),
        data: res,
      })
    }
  }

  /**
   * 验证缓存是否过期
   */
  function CheckCache(data) {
    return data.timestamp < Date.parse(new Date());
  }

  function RequestOver() {
    RemoveRequest(request_key);
  }
}

/**
 * 并发请求
 * 没做缓存等处理
 */
function FetchRequestAll(data) {
  return new Promise(function (resolve, reject) {
    Promise.all(data).then(res => {
      resolve(res)
    })
  })
}
function CheckRequest(key) {
  return REQUEST_CACHE.indexOf(key) >= 0;
}

function SaveRequest(key) {
  var index = REQUEST_CACHE.indexOf(key);
  if (index <= 0) {
    REQUEST_CACHE.push(key);
  }
}

function RemoveRequest(key) {
  var index = REQUEST_CACHE.indexOf(key);
  if (index >= 0) {
    REQUEST_CACHE.splice(index, 1);
  }
}

function GetStorageKey(url, method) {
  return `${method.toUpperCase()}:${url.toUpperCase()}`
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  fetchRequest: FetchRequest,
  cacheTime: 1800,
  fetchRequestAll: FetchRequestAll
}