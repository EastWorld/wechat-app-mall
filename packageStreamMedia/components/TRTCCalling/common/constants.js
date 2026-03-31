export const EVENT = {
  INVITED: 'INVITED',
  GROUP_CALL_INVITEE_LIST_UPDATE: 'GROUP_CALL_INVITEE_LIST_UPDATE',
  USER_ENTER: 'USER_ENTER',
  USER_LEAVE: 'USER_LEAVE',
  REJECT: 'REJECT',
  NO_RESP: 'NO_RESP',
  LINE_BUSY: 'LINE_BUSY',
  CALLING_CANCEL: 'CALLING_CANCEL',
  CALLING_TIMEOUT: 'CALLING_TIMEOUT',
  CALL_END: 'CALL_END',
  USER_VIDEO_AVAILABLE: 'USER_VIDEO_AVAILABLE',
  USER_AUDIO_AVAILABLE: 'USER_AUDIO_AVAILABLE',
  USER_VOICE_VOLUME: 'USER_VOICE_VOLUME',

  HANG_UP: 'HANG_UP',
  ERROR: 'ERROR', // 组件内部抛出的错误
}

export const TRTC_EVENT = {
  REMOTE_USER_JOIN: 'REMOTE_USER_JOIN', // 远端用户进房
  REMOTE_USER_LEAVE: 'REMOTE_USER_LEAVE', // 远端用户退房
  REMOTE_VIDEO_ADD: 'REMOTE_VIDEO_ADD', // 远端视频流添加事件，当远端用户取消发布音频流后会收到该通知
  REMOTE_VIDEO_REMOVE: 'REMOTE_VIDEO_REMOVE', // 远端视频流移出事件，当远端用户取消发布音频流后会收到该通知
  REMOTE_AUDIO_ADD: 'REMOTE_AUDIO_ADD', // 远端音频流添加事件，当远端用户取消发布音频流后会收到该通知
  REMOTE_AUDIO_REMOVE: 'REMOTE_AUDIO_REMOVE', // 远端音频流移除事件，当远端用户取消发布音频流后会收到该通知
  REMOTE_STATE_UPDATE: 'REMOTE_STATE_UPDATE', // 远端用户播放状态变更
  LOCAL_NET_STATE_UPDATE: 'LOCAL_NET_STATE_UPDATE', // 本地推流网络状态变更
  REMOTE_NET_STATE_UPDATE: 'REMOTE_NET_STATE_UPDATE', // 远端用户网络状态变更
  LOCAL_AUDIO_VOLUME_UPDATE: 'LOCAL_AUDIO_VOLUME_UPDATE', // 本地音量变更
  REMOTE_AUDIO_VOLUME_UPDATE: 'REMOTE_AUDIO_VOLUME_UPDATE', // 远端用户音量变更
}

export const DEFAULT_PLAYER_CONFIG = {
  src: '',
  mode: 'RTC',
  autoplay: true, // 7.0.9 必须设置为true，否则 Android 有概率调用play()失败
  muteAudio: false, // 默认不拉取音频，需要手动订阅，如果要快速播放，需要设置false
  muteVideo: false, // 默认不拉取视频，需要手动订阅，如果要快速播放，需要设置false
  orientation: 'vertical', // 画面方向 vertical horizontal
  objectFit: 'fillCrop', // 填充模式，可选值有 contain，fillCrop
  enableBackgroundMute: false, // 进入后台时是否静音（已废弃，默认退台静音）
  minCache: 0.6, // 最小缓冲区，单位s（RTC 模式推荐 0.2s）
  maxCache: 0.8, // 最大缓冲区，单位s（RTC 模式推荐 0.8s）
  soundMode: 'speaker', // 声音输出方式 ear speaker
  enableRecvMessage: 'false', // 是否接收SEI消息
  autoPauseIfNavigate: true, // 当跳转到其它小程序页面时，是否自动暂停本页面的实时音视频播放
  autoPauseIfOpenNative: true, // 当跳转到其它微信原生页面时，是否自动暂停本页面的实时音视频播放
}
