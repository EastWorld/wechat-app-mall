class User {
  constructor(options) {
    Object.assign(this, {
      userID: '',
      // hasMainStream: false, // 触发 1034 且stream type 为 main 即为true
      // hasAuxStream: false, // 触发 1034 且stream type 为 aux 即为true
      // hasSmallStream: false, // 触发 1034 且stream type 为 small 即为true
      streams: {
        // main: mainStream
        // aux: auxStream
      }, // 有0~2个Stream， 进房没有推流，main aux， small 特殊处理，small 和 main 同时只播放一路
      // stream 是用于渲染 live-player 的数据源
    }, options)
  }
}

export default User
