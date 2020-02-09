function imageUtil (originalWidth, originalHeight) {
  let imageSize = {}
  wx.getSystemInfo({
    success: function (res) {
      const windowWidth = res.windowWidth
      imageSize.x = 0
      imageSize.y = 0
      imageSize.windowWidth = windowWidth
      imageSize.imageWidth = originalWidth
      imageSize.imageHeight = originalHeight
      if (originalWidth > windowWidth) {
        imageSize.imageWidth = windowWidth
        imageSize.imageHeight = windowWidth * originalHeight / originalWidth
      } else {
        imageSize.x = (windowWidth - originalWidth) / 2
      }
    }
  })
  return imageSize
}

module.exports = {
  imageUtil: imageUtil
}
