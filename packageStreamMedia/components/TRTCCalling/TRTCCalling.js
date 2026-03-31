import EventEmitter from './utils/event.js'
import TSignaling from './utils/tsignaling-wx'
import * as ENV from 'utils/environment.js'
import MTA from 'libs/mta_analysis.js'
import { EVENT, TRTC_EVENT } from './common/constants.js'
import UserController from './controller/user-controller'

const app = getApp()

const TAG_NAME = 'TRTCCalling-Component'
// 组件旨在跨终端维护一个通话状态管理机，以事件发布机制驱动上层进行管理，并通过API调用进行状态变更。
// 组件设计思路将UI和状态管理分离。您可以通过修改`template`文件夹下的文件，适配您的业务场景，
// 在UI展示上，您可以通过属性的方式，将上层的用户头像，名称等数据传入组件内部，`static`下的用户头像图片，
// 只是为了展示基础的效果，您需要根据业务场景进行修改。
Component({
  properties: {
    config: {
      type: Object,
      value: {
        sdkAppID: app.globalData.sdkAppID,
        userID: '',
        userSig: '',
        type: 0,
      },
      observer: function(newVal, oldVal) {
        this.setData({
          config: newVal,
        })
      },
    },
    pusherAvatar: {
      type: String,
      value: '',
    },
    remoteAvatar: {
      type: String,
      value: '',
    },

  },
  data: {
    soundMode: 'speaker', // 声音模式 听筒/扬声器
    callingFlag: false,
    active: false,
    pusherConfig: { // 本地上行状态管理
      pushUrl: '',
      frontCamera: 'front',
      enableMic: true,
      enableCamera: true,
      volume: 0,
    },
    playerList: [], // 通话成员列表
    streamList: [],
    invitation: { // 接收到的邀请
      inviteID: '',
    },
    invitationAccept: { // 发出的邀请，以及返回的状态
      inviteID: '',
      acceptFlag: false,
      rejectFlag: false,
    },
    _historyUserList: [], // 房间内进过房的成员列表，用于发送call_end
  },

  methods: {
    _initEventEmitter() {
      // 监听TSignaling事件
      this.tsignaling.on(TSignaling.EVENT.NEW_INVITATION_RECEIVED, (event) => {
        console.log(TAG_NAME, 'onNewInvitationReceived', `是否在通话：${this.data.callingFlag || this.data.invitationAccept.acceptFlag}, inviteID:${event.data.inviteID} inviter:${event.data.inviter} inviteeList:${event.data.inviteeList} data:${event.data.data}`)
        const data = JSON.parse(event.data.data)
        // 新的通话邀请
        // {
        //   "version":0,
        //   "call_type":1,
        //   "room_id":"123"
        // }
        // 通话结束，发出的 call_end
        // {
        //   "version":0,
        //   "call_type":1,
        //   "call_end":123123
        // }
        // 通话中，接收的新的邀请时，忙线拒绝
        if (this.data.callingFlag || this.data.invitationAccept.acceptFlag) {
          this.tsignaling.reject({
            inviteID: event.data.inviteID,
            data: JSON.stringify({
              version: 0,
              call_type: data.call_type,
              line_busy: '',
            }),
          })
          return
        }
        if (data.call_end) {
          // 小程序端对 call_end 的接收不做业务处理，这里只是向外抛出这个事件
          this._emitter.emit(EVENT.CALL_END, {
            call_end: data.call_end,
          })
        } else {
          this.data.invitation.inviteID = event.data.inviteID
          this.data.invitation.inviter = event.data.inviter

          this.data.invitation.type = data.call_type
          this.data.invitation.roomID = data.room_id
          this.setData({
            invitation: this.data.invitation,
            callingFlag: true, // 当前invitation未处理完成时，下一个invitation都将会忙线
          }, () => {
            console.log(`${TAG_NAME} NEW_INVITATION_RECEIVED invitation: `, this.data.callingFlag, this.data.invitation)
            this._emitter.emit(EVENT.INVITED, {
              inviter: this.data.invitation.inviter,
              type: this.data.invitation.type,
            })
          })
        }
      })
      this.tsignaling.on(TSignaling.EVENT.INVITEE_ACCEPTED, (event) => {
        // 发出的邀请收到接受的回调
        console.log(`${TAG_NAME} INVITEE_ACCEPTED inviteID:${event.data.inviteID} invitee:${event.data.invitee} data:${event.data.data}`)
        if (this.data.invitationAccept.inviteID === event.data.inviteID) {
          this.data.invitationAccept.acceptFlag = true
          this.setData({
            invitationAccept: this.data.invitationAccept,
          })
        }
      })
      this.tsignaling.on(TSignaling.EVENT.INVITEE_REJECTED, (event) => {
        // 发出的邀请收到拒绝的回调
        console.log(`${TAG_NAME} INVITEE_REJECTED inviteID:${event.data.inviteID} invitee:${event.data.invitee} data:${event.data.data}`)
        // 小程序使用双向绑定模式，这里只向外抛出拒绝的用户 userID 业务逻辑由业务层进行处理
        const data = JSON.parse(event.data.data)
        if (this.data.invitationAccept.inviteID === event.data.inviteID) {
          this.data.invitationAccept.rejectFlag = true
          this.setData({
            invitationAccept: this.data.invitationAccept,
          }, () => {
            if (data.line_busy === '') {
              this._emitter.emit(EVENT.LINE_BUSY, {
                inviteID: event.data.inviteID,
                invitee: event.data.invitee,
                reason: 'line busy',
              })
            } else {
              this._emitter.emit(EVENT.REJECT, {
                inviteID: event.data.inviteID,
                invitee: event.data.invitee,
                reason: 'reject',
              })
            }
          })
        }
      })
      this.tsignaling.on(TSignaling.EVENT.INVITATION_CANCELLED, (event) => {
        // 收到的邀请收到该邀请取消的回调
        console.log('demo | onInvitationCancelled', `inviteID:${event.data.inviteID} inviter:${event.data.invitee} data:${event.data.data}`)
        // invitation取消，收到此消息的时候应该还没有接通，为防止时序的问题，还是走一下挂断流程
        this.setData({
          callingFlag: false,
        })
        this._emitter.emit(EVENT.CALLING_CANCEL, {
          inviteID: event.data.inviteID,
          invitee: event.data.invitee,
        })
      })
      this.tsignaling.on(TSignaling.EVENT.INVITATION_TIMEOUT, (event) => {
        console.log(TAG_NAME, 'onInvitationTimeout 邀请超时', `inviteID:${event.data.inviteID} inviteeList:${event.data.inviteeList}`)
        // 邀请超时, 无人应答
        this._emitter.emit(EVENT.NO_RESP, {
          inviteID: event.data.inviteID,
          inviteeList: event.data.inviteeList,
        })
      })
      this.tsignaling.on(TSignaling.EVENT.SDK_READY, () => {
        console.log(TAG_NAME, 'TSignaling SDK ready')
      })
      this.tsignaling.on(TSignaling.EVENT.SDK_NOT_READY, () => {
        this._emitter.emit(EVENT.ERROR, {
          errorMsg: 'TSignaling SDK not ready !!! 如果想使用发送消息等功能，接入侧需驱动 SDK 进入 ready 状态',
        })
      })
      this.tsignaling.on(TSignaling.EVENT.TEXT_MESSAGE_RECEIVED, () => {

      })
      this.tsignaling.on(TSignaling.EVENT.CUSTOM_MESSAGE_RECEIVED, () => {

      })
      this.tsignaling.on(TSignaling.EVENT.REMOTE_USER_JOIN, () => {
        //
      })
      this.tsignaling.on(TSignaling.EVENT.REMOTE_USER_LEAVE, () => {
        // 离开
      })
      this.tsignaling.on(TSignaling.EVENT.KICKED_OUT, () => {
        // 被踢下线 TODO
        wx.showToast({
          title: '您已被踢下线',
        })
        this.hangup()
      })
      this.tsignaling.on(TSignaling.EVENT.NET_STATE_CHANGE, () => {

      })
      // 监听TRTC SDK抛出的事件
      this.userController.on(TRTC_EVENT.REMOTE_USER_JOIN, (event)=>{
        console.log(TAG_NAME, '远端用户进房', event, event.data.userID)
        this.setData({
          playerList: event.data.userList,
        }, () => {
          // this._emitter.emit(EVENT.REMOTE_USER_JOIN, { userID: event.data.userID })
          this._emitter.emit(EVENT.USER_ENTER, {
            userID: event.data.userID,
          })
          if (this.data._historyUserList.indexOf(event.data.userID) > -1) {
            this.data._historyUserList.push(event.data.userID)
          }
        })
        console.log(TAG_NAME, 'REMOTE_USER_JOIN', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
      // 远端用户离开
      this.userController.on(TRTC_EVENT.REMOTE_USER_LEAVE, (event)=>{
        console.log(TAG_NAME, '远端用户离开', event, event.data.userID)
        if (event.data.userID) {
          this.setData({
            playerList: event.data.userList,
            streamList: event.data.streamList,
          }, () => {
            // TODO: 房间内没有远端用户时就退房, 并且发出invite消息，带call_end信息
            this._emitter.emit(EVENT.USER_LEAVE, {
              userID: event.data.userID,
            })
          })
        }
        console.log(TAG_NAME, 'REMOTE_USER_LEAVE', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
      // 视频状态 true
      this.userController.on(TRTC_EVENT.REMOTE_VIDEO_ADD, (event)=>{
        console.log(TAG_NAME, '远端视频可用', event, event.data.stream.userID)
        const stream = event.data.stream
        this.setData({
          playerList: event.data.userList,
          streamList: event.data.streamList,
        }, () => {
          stream.playerContext = wx.createLivePlayerContext(stream.streamID, this)
        })
        console.log(TAG_NAME, 'REMOTE_VIDEO_ADD', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
      // 视频状态 false
      this.userController.on(TRTC_EVENT.REMOTE_VIDEO_REMOVE, (event)=>{
        console.log(TAG_NAME, '远端视频移除', event, event.data.stream.userID)
        const stream = event.data.stream
        this.setData({
          playerList: event.data.userList,
          streamList: event.data.streamList,
        }, () => {
          // 有可能先触发了退房事件，用户名下的所有stream都已清除
          if (stream.userID && stream.streamType) {
            // this._emitter.emit(EVENT.REMOTE_VIDEO_REMOVE, { userID: stream.userID, streamType: stream.streamType })
          }
        })
        console.log(TAG_NAME, 'REMOTE_VIDEO_REMOVE', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
      // 音频可用
      this.userController.on(TRTC_EVENT.REMOTE_AUDIO_ADD, (event)=>{
        console.log(TAG_NAME, '远端音频可用', event)
        const stream = event.data.stream
        this.setData({
          playerList: event.data.userList,
          streamList: event.data.streamList,
        }, () => {
          stream.playerContext = wx.createLivePlayerContext(stream.streamID, this)
          // 新增的需要触发一次play 默认属性才能生效
          // stream.playerContext.play()
          // console.log(TAG_NAME, 'REMOTE_AUDIO_ADD playerContext.play()', stream)
          // this._emitter.emit(EVENT.REMOTE_AUDIO_ADD, { userID: stream.userID, streamType: stream.streamType })
        })
        console.log(TAG_NAME, 'REMOTE_AUDIO_ADD', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
      // 音频不可用
      this.userController.on(TRTC_EVENT.REMOTE_AUDIO_REMOVE, (event)=>{
        console.log(TAG_NAME, '远端音频移除', event, event.data.stream.userID)
        const stream = event.data.stream
        this.setData({
          playerList: event.data.userList,
          streamList: event.data.streamList,
        }, () => {
          // 有可能先触发了退房事件，用户名下的所有stream都已清除
          if (stream.userID && stream.streamType) {
            // this._emitter.emit(EVENT.REMOTE_AUDIO_REMOVE, { userID: stream.userID, streamType: stream.streamType })
          }
        })
        console.log(TAG_NAME, 'REMOTE_AUDIO_REMOVE', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
    },
    /**
     * 登录IM接口，所有功能需要先进行登录后才能使用
     *
     */
    login() {
      return new Promise((resolve, reject) => {
        this.tsignaling.setLogLevel(0)
        MTA.Page.stat()
        this.tsignaling.login({
          userID: this.data.config.userID,
          userSig: this.data.config.userSig,
        }).then( () => {
          console.log(TAG_NAME, 'login', 'IM登入成功')
          this._initEventEmitter()
          resolve()
        })
      })
    },
    /**
     * 登出接口，登出后无法再进行拨打操作
     */
    logout() {
      this.tsignaling.logout({
        userID: this.data.config.userID,
        userSig: this.data.config.userSig,
      }).then( () => {
        console.log(TAG_NAME, 'login', 'IM登出成功')
      }).catch( () => {
        console.error(TAG_NAME, 'login', 'IM登出失败')
      })
    },
    /**
     * 监听事件
     *
     * @param eventCode 事件名
     * @param handler 事件响应回调
     */
    on(eventCode, handler, context) {
      this._emitter.on(eventCode, handler, context)
    },

    off(eventCode, handler) {
      this._emitter.off(eventCode, handler)
    },
    /**
     * C2C邀请通话，被邀请方会收到的回调
     * 如果当前处于通话中，可以调用该函数以邀请第三方进入通话
     *
     * @param userID 被邀请方
     * @param type 0-为之， 1-语音通话，2-视频通话
     */
    call({ userID, type }) {
      // 生成房间号，拼接URL地址
      const roomID = Math.floor(Math.random() * 100000000 + 1) // 随机生成房间号
      this._getPushUrl(roomID)
      this._enterTRTCRoom()
      this.tsignaling.invite({
        userID: userID,
        data: JSON.stringify({
          version: 0,
          call_type: type,
          room_id: roomID,
        }),
        timeout: 30,
      }).then( (res) => {
        console.log(`${TAG_NAME} call(userID: ${userID}, type: ${type}) success`)
        this.data.invitationAccept.inviteID = res.inviteID
        this.setData({
          invitationAccept: this.data.invitationAccept,
          callingFlag: true,
        })
      }).catch((error) => {
        console.log(`${TAG_NAME} call(userID:${userID},type:${type}) failed', error: ${error}`)
      })
    },
    /**
     * IM群组邀请通话，被邀请方会收到的回调
     * 如果当前处于通话中，可以继续调用该函数继续邀请他人进入通话，同时正在通话的用户会收到的回调
     *
     * @param userIDList 邀请列表
     * @param type 1-语音通话，2-视频通话
     * @param groupID IM群组ID
     */
    groupCall(params) {
      this.tsignaling.inviteInGroup({
        groupID: params.groupID,
        inviteeList: params.userIDList,
        timeout: 30,
        data: JSON.stringify({
          version: 0,
          call_type: params.type,
          room_id: Math.floor(Math.random() * 100000000 + 1),
        }),
      }).then(function(res) {
        console.log(TAG_NAME, 'inviteInGroup OK', res)
      }).catch(function(error) {
        console.log(TAG_NAME, 'inviteInGroup failed', error)
      })
    },
    /**
     * 当您作为被邀请方收到 {@link TRTCCallingDelegate#onInvited } 的回调时，可以调用该函数接听来电
     */
    accept() {
      // 拼接pusherURL进房
      console.log(TAG_NAME, 'accept() inviteID: ', this.data.invitation.inviteID)
      this.tsignaling.accept({
        inviteID: this.data.invitation.inviteID,
        data: JSON.stringify({
          version: 0,
          call_type: this.data.config.type,
        }),
      }).then( () => {
        console.log('接受成功')
      }).catch( () => {
        console.error('接受失败')
      })
      this._getPushUrl(this.data.invitation.roomID)
      this._enterTRTCRoom()
    },
    /**
     * 当您作为被邀请方收到的回调时，可以调用该函数拒绝来电
     */
    reject() {
      if (this.data.invitation.inviteID) {
        this.tsignaling.reject({
          inviteID: this.data.invitation.inviteID,
          data: JSON.stringify({
            version: 0,
            call_type: this.data.config.type,
          }),
        }).then( (res) => {
          console.log('demo reject OK', res)
          this._reset()
        }).catch( (error) => {
          console.log('demo reject failed', error)
        })
      } else {
        console.warn(`${TAG_NAME} 未收到邀请，无法拒绝`)
        return
      }
    },
    /**
     * 当您处于通话中，可以调用该函数结束通话
     */
    hangup() {
      const inviterFlag = !this.data.invitation.inviteID && this.data.invitationAccept.inviteID && true // 是否是邀请者
      if (inviterFlag && !this.data.invitationAccept.acceptFlag && !this.data.invitationAccept.rejectFlag) {
        console.log(TAG_NAME, 'cancel() inviteID: ', this.data.invitationAccept.inviteID)
        this.tsignaling.cancel({
          inviteID: this.data.invitationAccept.inviteID,
        })
      }
      if (this.data.playerList.length === 0 && this.data.invitationAccept.acceptFlag) {
        const currentTime = Date.parse(new Date())
        // console.log('发送call_end信息', currentTime)
        this.data._historyUserList.forEach( (user) => {
          this.tsignaling.invite({
            userID: user,
            data: JSON.stringify({
              version: 0,
              call_type: this.data.config.type,
              call_end: currentTime,
            }),
          })
        })
        this._emitter.emit(EVENT.CALL_END, {
          inviteID: this.data.invitationAccept.inviteID,
          call_end: currentTime,
        })
      }
      this._reset().then( () => {
        this._emitter.emit(EVENT.HANG_UP)
        console.log(TAG_NAME, 'hangup() pusherConfig: ', this.data.pusherConfig)
      })
    },

    _reset() {
      return new Promise( (resolve, reject) => {
        console.log(TAG_NAME, ' _reset()')
        const result = this.userController.reset()
        this.data.pusherConfig = {
          pushUrl: '',
          frontCamera: 'front',
          enableMic: true,
          enableCamera: true,
          volume: 0,
        },
        // 清空状态
        this.setData({
          pusherConfig: this.data.pusherConfig,
          soundMode: 'speaker',
          invitation: {
            inviteID: '',
          },
          playerList: result.userList,
          streamList: result.streamList,
          _historyUserList: [],
          active: false,
          callingFlag: false,
          invitationAccept: {
            inviteID: '',
            acceptFlag: false,
            rejectFlag: false,
          },
        }, () => {
          resolve()
        })
      })
    },
    /**
     *
     * @param userID 远端用户id
     */
    startRemoteView(userID) {
      this.data.streamList.forEach( (stream) => {
        if (stream.userID === userID) {
          stream.muteVideo = false
          this.setData({
            streamList: this.data.streamList,
          }, () => {
            console.log(`${TAG_NAME}, startRemoteView(${userID})`)
          })
          return
        }
      })
    },
    /**
     * 当您收到 onUserVideoAvailable 回调为false时，可以停止渲染数据
     *
     * @param userID 远端用户id
     */
    stopRemoteView(userID) {
      this.data.streamList.forEach( (stream) => {
        if (stream.userID === userID) {
          stream.muteVideo = true
          this.setData({
            streamList: this.data.streamList,
          }, () => {
            console.log(`${TAG_NAME}, stopRemoteView(${userID})`)
          })
          return
        }
      })
    },
    /**
     * 您可以调用该函数开启摄像头
     */
    openCamera() {
      this.data.pusherConfig.enableCamera = true
      this.setData({
        pusherConfig: this.data.pusherConfig,
      }, () => {
        console.log(`${TAG_NAME}, closeCamera() pusherConfig: ${this.data.pusherConfig}`)
      })
    },
    /**
     * 您可以调用该函数关闭摄像头
     * 处于通话中的用户会收到回调
     */
    closeCamera() {
      this.data.pusherConfig.enableCamera = false
      this.setData({
        pusherConfig: this.data.pusherConfig,
      }, () => {
        console.log(`${TAG_NAME}, closeCamera() pusherConfig: ${this.data.pusherConfig}`)
      })
    },
    /**
     * 是否静音mic
     *
     * @param isMute true:麦克风关闭 false:麦克风打开
     */
    // setMicMute(isMute) {
    //   this.data.pusherConfig.enableMic = !isMute
    //   this.setData({
    //     pusherConfig: this.data.pusherConfig,
    //   }, () => {
    //     console.log(`${TAG_NAME}, setMicMute(${isMute}) enableMic: ${this.data.pusherConfig.enableMic}`)
    //   })
    // },
    setMicMute(isMute) {
      this.data.pusherConfig.enableMic = !isMute
      this.setData({
        pusherConfig: this.data.pusherConfig,
      }, () => {
        console.log(`${TAG_NAME}, setMicMute(${isMute}) enableMic: ${this.data.pusherConfig.enableMic}`)
        wx.createLivePusherContext().setMICVolume({ volume: isMute ? 0 : 1 })
      })
    },

    switchCamera(isFrontCamera) {
      this.data.pusherConfig.frontCamera = isFrontCamera ? 'front' : 'back'
      this.setData({
        pusherConfig: this.data.pusherConfig,
      }, () => {
        console.log(`${TAG_NAME}, switchCamera(), frontCamera${this.data.pusherConfig.frontCamera}`)
      })
    },
    setHandsFree(isHandsFree) {
      this.data.soundMode = isHandsFree ? 'speaker' : 'ear'
      this.setData({
        soundMode: this.data.soundMode,
      }, () => {
        console.log(`${TAG_NAME}, setHandsFree() result: ${this.data.soundMode}`)
      })
    },

    _toggleAudio() {
      if (this.data.pusherConfig.enableMic) {
        this.setMicMute(true)
      } else {
        this.setMicMute(false)
      }
    },

    _toggleSoundMode() {
      if (this.data.soundMode === 'speaker') {
        this.setHandsFree(false)
      } else {
        this.setHandsFree(true)
      }
    },

    _getPushUrl(roomId) {
      // 拼接 puhser url rtmp 方案
      console.log(TAG_NAME, '_getPushUrl', roomId)
      // TODO: 解注释
      if (ENV.IS_TRTC) {
        // 版本高于7.0.8，基础库版本高于2.10.0 使用新的 url
        return new Promise((resolve, reject) => {
          this.setData({
            active: true,
          })
          let roomID = ''
          if (/^\d+$/.test(roomId)) {
            // 数字房间号
            roomID = '&roomid=' + roomId
          } else {
            // 字符串房间号
            roomID = '&strroomid=' + roomId
          }
          setTimeout(()=> {
            const pushUrl = 'room://cloud.tencent.com/rtc?sdkappid=' + this.data.config.sdkAppID +
                            roomID +
                            '&userid=' + this.data.config.userID +
                            '&usersig=' + this.data.config.userSig +
                            '&appscene=videocall' +
                            '&cloudenv=PRO' // ios此参数必填
            console.warn(TAG_NAME, 'getPushUrl result:', pushUrl)
            this.data.pusherConfig.pushUrl = pushUrl
            this.setData({
              pusherConfig: this.data.pusherConfig,
            })
            resolve(pushUrl)
          }, 0)
        })
      }
      console.error(TAG_NAME, '组件仅支持微信 App iOS >=7.0.9, Android >= 7.0.8, 小程序基础库版 >= 2.10.0')
      console.error(TAG_NAME, '需要真机运行，开发工具不支持实时音视频')
    },

    _enterTRTCRoom() {
      // 开始推流
      wx.createLivePusherContext().start()
    },

    _hangUp() {
      this.hangup()
    },

    _pusherStateChangeHandler(event) {
      const code = event.detail.code
      const message = event.detail.message
      const TAG_NAME = 'TRTCCalling pusherStateChange: '
      switch (code) {
        case 0: // 未知状态码，不做处理
          console.log(TAG_NAME, message, code)
          break
        case 1001:
          console.log(TAG_NAME, '已经连接推流服务器', code)
          break
        case 1002:
          console.log(TAG_NAME, '已经与服务器握手完毕,开始推流', code)
          break
        case 1003:
          console.log(TAG_NAME, '打开摄像头成功', code)
          break
        case 1005:
          console.log(TAG_NAME, '推流动态调整分辨率', code)
          break
        case 1006:
          console.log(TAG_NAME, '推流动态调整码率', code)
          break
        case 1007:
          console.log(TAG_NAME, '首帧画面采集完成', code)
          break
        case 1008:
          console.log(TAG_NAME, '编码器启动', code)
          break
        case 1018:
          console.log(TAG_NAME, '进房成功', code)
          break
        case 1019:
          console.log(TAG_NAME, '退出房间', code)
          // 20200421 iOS 仍然没有1019事件通知退房，退房事件移动到 exitRoom 方法里，但不是后端通知的退房成功
          // this._emitter.emit(EVENT.LOCAL_LEAVE, { userID: this.data.pusher.userID })
          break
        case 2003:
          console.log(TAG_NAME, '渲染首帧视频', code)
          break
        case 1020:
        case 1031:
        case 1032:
        case 1033:
        case 1034:
          // 通过 userController 处理 1020 1031 1032 1033 1034
          this.userController.userEventHandler(event)
          break
        case -1301:
          console.error(TAG_NAME, '打开摄像头失败: ', code)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case -1302:
          console.error(TAG_NAME, '打开麦克风失败: ', code)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case -1303:
          console.error(TAG_NAME, '视频编码失败: ', code)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case -1304:
          console.error(TAG_NAME, '音频编码失败: ', code)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case -1307:
          console.error(TAG_NAME, '推流连接断开: ', code)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case -100018:
          console.error(TAG_NAME, '进房失败: userSig 校验失败，请检查 userSig 是否填写正确', code, message)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case 5000:
          console.log(TAG_NAME, '小程序被挂起: ', code)
          // 20200421 iOS 微信点击胶囊圆点会触发该事件
          // 触发 5000 后，底层SDK会退房，返回前台后会自动进房
          break
        case 5001:
          // 20200421 仅有 Android 微信会触发该事件
          console.log(TAG_NAME, '小程序悬浮窗被关闭: ', code)
          break
        case 1021:
          console.log(TAG_NAME, '网络类型发生变化，需要重新进房', code)
          break
        case 2007:
          console.log(TAG_NAME, '本地视频播放loading: ', code)
          break
        case 2004:
          console.log(TAG_NAME, '本地视频播放开始: ', code)
          break
        default:
          console.log(TAG_NAME, message, code)
      }
    },

    _playerStateChange(event) {
      // console.log(TAG_NAME, '_playerStateChange', event)
      this._emitter.emit(EVENT.REMOTE_STATE_UPDATE, event)
    },

    _playerAudioVolumeNotify(event) {
      const userID = event.target.dataset.userid
      const volume = event.detail.volume
      const stream = this.userController.getStream({
        userID: userID,
        streamType: 'main',
      })
      if (stream) {
        stream.volume = volume
      }
      this.setData({
        streamList: this.data.streamList,
      }, () => {
        this._emitter.emit(EVENT.USER_VOICE_VOLUME, {
          userID: userID,
          volume: volume,
        })
      })
    },
    _pusherAudioVolumeNotify(event) {
      this.data.pusherConfig.volume = event.detail.volume
      this._emitter.emit(EVENT.USER_VOICE_VOLUME, {
        userID: this.data.config.userID,
        volume: event.detail.volume,
      })
      this.setData({
        pusherConfig: this.data.pusherConfig,
      })
    },
  },

  /**
   * 生命周期方法
   */
  lifetimes: {
    created: function() {
      // 在组件实例刚刚被创建时执行
      console.log(TAG_NAME, 'created', ENV)
      this.tsignaling = new TSignaling({ SDKAppID: this.data.config.sdkAppID })
      wx.setKeepScreenOn({
        keepScreenOn: true,
      })
      MTA.App.init({
        'appID': '500728728',
        'eventID': '500730148',
        'autoReport': true,
        'statParam': true,
        'ignoreParams': [],
      })
    },
    attached: function() {
      // 在组件实例进入页面节点树时执行
      console.log(TAG_NAME, 'attached')
      this.EVENT = EVENT
      this._emitter = new EventEmitter()
      this.userController = new UserController()
      MTA.Page.stat()
    },
    ready: function() {
      // 在组件在视图层布局完成后执行
      console.log(TAG_NAME, 'ready')
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      console.log(TAG_NAME, 'detached')
      this._reset()
    },
    error: function(error) {
      // 每当组件方法抛出错误时执行
      console.log(TAG_NAME, 'error', error)
    },
  },
  pageLifetimes: {
    show: function() {
    },
    hide: function() {
      // 组件所在的页面被隐藏时执行
      console.log(TAG_NAME, 'hide')
    },
    resize: function(size) {
      // 组件所在的页面尺寸变化时执行
      console.log(TAG_NAME, 'resize', size)
    },
  },
})
