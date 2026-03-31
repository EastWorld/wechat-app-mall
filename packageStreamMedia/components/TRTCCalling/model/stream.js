// 一个stream 对应一个 player
import { DEFAULT_PLAYER_CONFIG } from '../common/constants.js'

class Stream {
  constructor(options) {
    Object.assign(this, DEFAULT_PLAYER_CONFIG, {
      userID: '', // 该stream 关联的userID
      streamType: '', // stream 类型 [main small] aux
      streamID: '', // userID + '_' + streamType
      isVisible: true, // 手Q初始化时不能隐藏 puser和player 否则黑屏。iOS 微信初始化时不能隐藏，否则同层渲染失败，player会置顶
      hasVideo: false,
      hasAudio: false,
      volume: 0, // 音量大小 0～100
      playerContext: undefined, // playerContext 依赖component context来获取，目前只能在渲染后获取
    }, options)
  }
  setProperty(options) {
    Object.assign(this, options)
  }
  reset() {
    if (this.playerContext) {
      this.playerContext.stop()
      this.playerContext = undefined
    }
    Object.assign(this, DEFAULT_PLAYER_CONFIG, {
      userID: '', // 该stream 关联的userID
      streamType: '', // stream 类型 [main small] aux
      streamID: '',
      isVisible: true,
      hasVideo: false,
      hasAudio: false,
      volume: 0, // 音量大小 0～100
      playerContext: undefined,
    })
  }
}

export default Stream
