import Event from '../utils/event.js'
import User from '../model/user.js'
import Stream from '../model/stream.js'
import { TRTC_EVENT } from '../common/constants.js'

const TAG_NAME = 'UserController'
/**
 * 通讯成员管理
 */
class UserController {
  constructor(componentContext) {
    // userMap 用于存储完整的数据结构
    this.userMap = new Map()
    // userList 用于存储简化的用户数据 Object，包括 {userID hasMainAudio hasMainVideo hasAuxAudio hasAuxVideo}
    this.userList = []
    // streamList 存储steam 对象列表，用于 trtc-room 渲染 player
    this.streamList = []
    this._emitter = new Event()
    this.componentContext = componentContext
  }
  userEventHandler(event) {
    const code = event.detail.code
    let data
    if (event.detail.message && typeof event.detail.message === 'string') {
      try {
        data = JSON.parse(event.detail.message)
      } catch (exception) {
        console.warn(TAG_NAME, 'userEventHandler 数据格式错误', exception)
        return false
      }
    } else {
      console.warn(TAG_NAME, 'userEventHandler 数据格式错误')
      return false
    }
    switch (code) {
      case 1031:
        // console.log(TAG_NAME, '远端用户进房通知：', code)
        // 1031 有新用户
        // {
        //   "userlist":[
        //          {
        //              "userid":"webrtc11"
        //          }
        //      ]
        // }
        this.addUser(data)
        break
      case 1032:
        // console.log(TAG_NAME, '远端用户退房通知：', code)
        // 1032 有用户退出
        this.removeUser(data)
        break
      case 1033:
        // console.log(TAG_NAME, '远端用户视频状态位变化通知：', code)
        // 1033 用户视频状态变化，新增stream或者更新stream 状态
        // {
        //   "userlist":[
        //          {
        //              "userid":"webrtc11",
        //              "playurl":" room://rtc.tencent.com?userid=xxx&streamtype=main",
        //              "streamtype":"main",
        //              "hasvideo":true
        //          }
        //      ]
        // }
        this.updateUserVideo(data)
        break
      case 1034:
        // console.log(TAG_NAME, '远端用户音频状态位变化通知：', code)
        // 1034 用户音频状态变化
        // {
        //   "userlist":[
        //          {
        //              "userid":"webrtc11",
        //              "playurl":" room://rtc.tencent.com?userid=xxx&streamtype=main",
        //              "hasaudio":false
        //          }
        //      ]
        // }
        this.updateUserAudio(data)
        break
    }
  }
  /**
   * 处理用户进房事件
   * @param {Object} data pusher 下发的数据
   */
  addUser(data) {
    // console.log(TAG_NAME, 'addUser', data)
    const incomingUserList = data.userlist
    const userMap = this.userMap
    if (Array.isArray(incomingUserList) && incomingUserList.length > 0) {
      incomingUserList.forEach((item) => {
        const userID = item.userid
        // 已经在 map 中的用户
        let user = this.getUser(userID)
        if (!user) {
          // 新增用户
          user = new User({ userID: userID })
          this.userList.push({
            userID: userID,
          })
        }
        userMap.set(userID, user)
        this._emitter.emit(TRTC_EVENT.REMOTE_USER_JOIN, { userID: userID, userList: this.userList })
        // console.log(TAG_NAME, 'addUser', item, userMap.get(userID), this.userMap)
      })
    }
  }
  /**
   * 处理用户退房事件
   * @param {Object} data pusher 下发的数据 {userlist}
   */
  removeUser(data) {
    // console.log(TAG_NAME, 'removeUser', data)
    const incomingUserList = data.userlist
    if (Array.isArray(incomingUserList) && incomingUserList.length > 0) {
      incomingUserList.forEach((item) => {
        const userID = item.userid
        let user = this.getUser(userID)
        // 偶现SDK触发退房事件前没有触发进房事件
        if (!user || !user.streams) {
          return
        }
        // 从userList 里删除指定的用户和 stream
        this._removeUserAndStream(userID)
        // 重置
        user.streams['main'] && user.streams['main'].reset()
        user.streams['aux'] && user.streams['aux'].reset()
        // 用户退出，释放引用，外部调用该 user 所有stream 的 playerContext.stop() 方法停止播放
        // TODO 触发时机提前了，方便外部用户做出处理，时机仍需进一步验证
        this._emitter.emit(TRTC_EVENT.REMOTE_USER_LEAVE, { userID: userID, userList: this.userList, streamList: this.streamList })
        user = undefined
        this.userMap.delete(userID)
        // console.log(TAG_NAME, 'removeUser', this.userMap)
      })
    }
  }
  /**
   * 处理用户视频通知事件
   * @param {Object} data pusher 下发的数据 {userlist}
   */
  updateUserVideo(data) {
    console.log(TAG_NAME, 'updateUserVideo', data)
    const incomingUserList = data.userlist
    if (Array.isArray(incomingUserList) && incomingUserList.length > 0) {
      incomingUserList.forEach((item) => {
        const userID = item.userid
        const streamType = item.streamtype
        const streamID = userID + '_' + streamType
        const hasVideo = item.hasvideo
        const src = item.playurl
        const user = this.getUser(userID)
        // 更新指定用户的属性
        if (user) {
          // 查找对应的 stream
          let stream = user.streams[streamType]
          console.log(TAG_NAME, 'updateUserVideo start', user, streamType, stream)
          // 常规逻辑
          // 新来的stream，新增到 user.steams 和 streamList，streamList 包含所有用户(有音频或视频)的 stream
          if (!stream) {
            // 不在 user streams 里，需要新建
            user.streams[streamType] = stream = new Stream({ userID, streamID, hasVideo, src, streamType })
            this._addStream(stream)
          } else {
            // 更新 stream 属性
            stream.setProperty({ hasVideo })
            // if (!hasVideo && !stream.hasAudio) {
            //   this._removeStream(stream)
            // }
            // or
            // if (hasVideo) {
            //   stream.setProperty({ hasVideo })
            // } else if (!stream.hasAudio) {
            //   // hasVideo == false && hasAudio == false
            //   this._removeStream(stream)
            // }
          }
          // 更新所属user 的 hasXxx 值
          this.userList.find((item)=>{
            if (item.userID === userID) {
              item[`has${streamType.replace(/^\S/, (s) => s.toUpperCase())}Video`] = hasVideo
              return true
            }
          })
          console.log(TAG_NAME, 'updateUserVideo end', user, streamType, stream)
          const eventName = hasVideo ? TRTC_EVENT.REMOTE_VIDEO_ADD : TRTC_EVENT.REMOTE_VIDEO_REMOVE
          this._emitter.emit(eventName, { stream: stream, streamList: this.streamList, userList: this.userList })
          // console.log(TAG_NAME, 'updateUserVideo', user, stream, this.userMap)
        }
      })
    }
  }
  /**
   * 处理用户音频通知事件
   * @param {Object} data pusher 下发的数据 {userlist}
   */
  updateUserAudio(data) {
    // console.log(TAG_NAME, 'updateUserAudio', data)
    const incomingUserList = data.userlist
    if (Array.isArray(incomingUserList) && incomingUserList.length > 0) {
      incomingUserList.forEach((item) => {
        const userID = item.userid
        // 音频只跟着 stream main ，这里只修改 main
        const streamType = 'main'
        const streamID = userID + '_' + streamType
        const hasAudio = item.hasaudio
        const src = item.playurl
        const user = this.getUser(userID)
        if (user) {
          let stream = user.streams[streamType]
          // if (!stream) {
          //   user.streams[streamType] = stream = new Stream({ streamType: streamType })
          //   this._addStream(stream)
          // }

          // 常规逻辑
          // 新来的stream，新增到 user.steams 和 streamList，streamList 包含所有用户的 stream
          if (!stream) {
            // 不在 user streams 里，需要新建
            user.streams[streamType] = stream = new Stream({ userID, streamID, hasAudio, src, streamType })
            this._addStream(stream)
          } else {
            // 更新 stream 属性
            stream.setProperty({ hasAudio })
            // if (!hasAudio && !stream.hasVideo) {
            //   this._removeStream(stream)
            // }
            // or
            // if (hasAudio) {
            //   stream.setProperty({ hasAudio })
            // } else if (!stream.hasVideo) {
            // // hasVideo == false && hasAudio == false
            //   this._removeStream(stream)
            // }
          }

          // stream.userID = userID
          // stream.streamID = userID + '_' + streamType
          // stream.hasAudio = hasAudio
          // stream.src = src
          // 更新所属 user 的 hasXxx 值
          this.userList.find((item)=>{
            if (item.userID === userID) {
              item[`has${streamType.replace(/^\S/, (s) => s.toUpperCase())}Audio`] = hasAudio
              return true
            }
          })
          const eventName = hasAudio ? TRTC_EVENT.REMOTE_AUDIO_ADD : TRTC_EVENT.REMOTE_AUDIO_REMOVE
          this._emitter.emit(eventName, { stream: stream, streamList: this.streamList, userList: this.userList })
          // console.log(TAG_NAME, 'updateUserAudio', user, stream, this.userMap)
        }
      })
    }
  }
  /**
   *
   * @param {String} userID 用户ID
   * @returns {Object}
   */
  getUser(userID) {
    return this.userMap.get(userID)
  }
  getStream({ userID, streamType }) {
    const user = this.userMap.get(userID)
    if (user) {
      return user.streams[streamType]
    }
    return undefined
  }
  getUserList() {
    return this.userList
  }
  getStreamList() {
    return this.streamList
  }
  /**
   * 重置所有user 和 steam
   * @returns {Object}
   */
  reset() {
    this.streamList.forEach((item)=>{
      item.reset()
    })
    this.streamList = []
    this.userList = []
    this.userMap.clear()
    return {
      userList: this.userList,
      streamList: this.streamList,
    }
  }
  on(eventCode, handler, context) {
    this._emitter.on(eventCode, handler, context)
  }
  off(eventCode, handler) {
    this._emitter.off(eventCode, handler)
  }
  /**
   * 删除用户和所有的 stream
   * @param {String} userID 用户ID
   */
  _removeUserAndStream(userID) {
    this.streamList = this.streamList.filter((item)=>{
      return item.userID !== userID && item.userID !== ''
    })
    this.userList = this.userList.filter((item)=>{
      return item.userID !== userID
    })
  }
  _addStream(stream) {
    if (!this.streamList.includes(stream)) {
      this.streamList.push(stream)
    }
  }
  _removeStream(stream) {
    console.warn('==========', stream)
    this.streamList = this.streamList.filter((item)=>{
      if (item.userID === stream.userID && item.streamType === stream.streamType) {
        return false
      }
      return true
    })
    const user = this.getUser(stream.userID)
    user.streams[stream.streamType] = undefined
  }
}

export default UserController
