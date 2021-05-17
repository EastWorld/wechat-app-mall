const WXAPI = require('apifm-wxapi')
Page({
  data: {
    adddata: [],
    adddata_day: [],
    active: 0,
    cc: 0,
    d2: false,
    xz: 1,
    d1top: 0,
    d2top: 0,
    d3top: 0,
    tabh: 0,
    djt: 0,
    jsday0: 0,
    jsday1: 0,
    jsday2: 0,
    jsday3: 0,
    jsday4: 0,
    jsday5: 0,
    jsday6: 0,
    jsday7: 0,
    jsday8: 0,
    jsday9: 0,
    jsday10: 0,
    jsday11: 0,
    jsday12: 0,
    jsday13: 0,
    jsday14: 0,
  },
  onLoad: function (options) {
  },
  onShow: function () {
    this.adddata()
  },

  async adddata() {

    const res = await WXAPI.goodsDetail(6765, wx.getStorageSync('token'))
    console.log(res);
    const res_day = await WXAPI.tourJourneyList(1, 6765)
    console.log("res_day:", res_day);

    var that = this;


    if (res.code == 0) {
      that.setData({
        adddata: res.data
      })
    }

    if (res_day.code == 0) {
      var cd = res_day.data;
      var lc = 1;
      if (cd.length <= 5) {
        lc = cd.length
      } else {
        lc = 5
      }
      that.setData({
        cc: lc,
        adddata_day: res_day.data
      })
      console.log("cc:", that.data.cc);


      let query = wx.createSelectorQuery()

      query.select('#bignav').boundingClientRect((rect) => {
        that.setData({
          jtab: rect.height
        })
      }).exec()


      query.select('#ys1').boundingClientRect((rect) => {
        that.setData({
          d1top: rect.top
        })

      }).exec()

      query.select('#ys2').boundingClientRect((rect) => {
        that.setData({
          d2top: rect.top - that.data.jtab - that.data.jtab
        })

      }).exec()

      query.select('#ys3').boundingClientRect((rect) => {
        that.setData({
          d3top: rect.top
        })

      }).exec()


      query.select('#jsday0').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday0: rect.top
          })
        }
      }).exec()
      query.select('#jsday1').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday1: rect.top
          })
        }
      }).exec()

      query.select('#jsday2').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday2: rect.top
          })
        }
      }).exec()


      query.select('#jsday3').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday3: rect.top
          })
        }
      }).exec()
      query.select('#jsday4').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday4: rect.top
          })
        }
      }).exec()
      query.select('#jsday5').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday5: rect.top
          })
        }
      }).exec()
      query.select('#jsday6').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday6: rect.top
          })
        }
      }).exec()
      query.select('#jsday7').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday7: rect.top
          })
        }
      }).exec()
      query.select('#jsday8').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday8: rect.top
          })
        }
      }).exec()
      query.select('#jsday9').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday9: rect.top
          })
        }
      }).exec()
      query.select('#jsday10').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday10: rect.top
          })
        }
      }).exec()
      query.select('#jsday11').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday11: rect.top
          })
        }
      }).exec()
      query.select('#jsday12').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday12: rect.top
          })
        }
      }).exec()
      query.select('#jsday13').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday13: rect.top
          })
        }
      }).exec()
      query.select('#jsday14').boundingClientRect((rect) => {
        if (rect) {
          that.setData({
            jsday14: rect.top
          })
        }
      }).exec()





    }

  },
  ts(e) {
    const idx = e.currentTarget.dataset.id;

    var that = this;
    that.setData({
      djt: idx
    })

    var jl = 0;
    if (idx == 0) {
      jl = that.data.jsday0 - that.data.jtab - that.data.jtab

    }
    if (idx == 1) {
      jl = that.data.jsday1
    } if (idx == 2) {
      jl = that.data.jsday2
    } if (idx == 3) {
      jl = that.data.jsday13
    } if (idx == 4) {
      jl = that.data.jsday4
    } if (idx == 5) {
      jl = that.data.jsday5
    } if (idx == 6) {
      jl = that.data.jsday6
    } if (idx == 7) {
      jl = that.data.jsday7
    } if (idx == 8) {
      jl = that.data.jsday8
    } if (idx == 9) {
      jl = that.data.jsday9
    } if (idx == 10) {
      jl = that.data.jsday10
    } if (idx == 11) {
      jl = that.data.jsday11
    } if (idx == 12) {
      jl = that.data.jsday12
    } if (idx == 13) {
      jl = that.data.jsday13
    } if (idx == 14) {
      jl = that.data.jsday14
    }
    wx.pageScrollTo({
      scrollTop: jl + 10,
      duration: 0
    })

  },


  previewImg(e) {
    const idx = e.currentTarget.dataset.idx
    console.log(idx);
    console.log(this.data.adddata.pics[idx].pic);
    console.log(this.data.adddata.pics);

    const pics = []
    this.data.adddata.pics.forEach(ele => {
      pics.push(ele.pic)
    })
    wx.previewImage({
      current: pics[idx],
      urls: pics
    })

  },



  ty(e) {
    var td = e.currentTarget.dataset.id
    var that = this;
    console.log(td);

    if (td == 1) {
      that.setData({
        d2: false,
        xz: 1
      })
      wx.pageScrollTo({
        scrollTop: that.data.d1top - that.data.jtab,
        duration: 0
      })
      return
    }
    if (td == 2) {
      that.setData({
        d2: true,
        xz: 2,
        djt: 0
      })
      wx.pageScrollTo({
        scrollTop: that.data.d2top + that.data.jtab + 2,
        duration: 0
      })
      return
    }
    if (td == 3) {
      that.setData({
        d2: false,
        xz: 3
      })
      wx.pageScrollTo({
        scrollTop: that.data.d3top + that.data.jtab + 2,
        duration: 0
      })
      return
    }

  },
  // 开始滑动

  onPageScroll: function (e) {
    var that = this;
    that.setData({
      scrollTop: e.scrollTop
    })


    // if (that.data.scrollTop >= that.data.d3top - that.data.jtab) {
    //   console.log(11111);

    //   this.setData({
    //     d2: false
    //   })
    // }


    if (that.data.scrollTop >= that.data.d3top) {
      console.log(33333);
      this.setData({
        d2: false,
        xz: 3
      })
      return
    }

    if (that.data.scrollTop >= that.data.jsday14 && that.data.jsday14 > 0) {
      this.setData({
        djt: 14,
        d2: true,
        xz: 2
      })
      return
    } if (that.data.scrollTop >= that.data.jsday13 && that.data.jsday13 > 0) {
      this.setData({
        djt: 13,
        d2: true,
        xz: 2
      })
      return
    } if (that.data.scrollTop >= that.data.jsday12 && that.data.jsday12 > 0) {
      this.setData({
        djt: 12,
        d2: true,
        xz: 2
      })
      return
    } if (that.data.scrollTop >= that.data.jsday11 && that.data.jsday11 > 0) {
      this.setData({
        djt: 11,
        d2: true,
        xz: 2
      })
      return
    } if (that.data.scrollTop >= that.data.jsday10 && that.data.jsday10 > 0) {
      this.setData({
        djt: 10,
        d2: true,
        xz: 2
      })
      return
    } if (that.data.scrollTop >= that.data.jsday9 && that.data.jsday9 > 0) {
      this.setData({
        djt: 9,
        d2: true,
        xz: 2
      })
      return
    } if (that.data.scrollTop >= that.data.jsday8 && that.data.jsday8 > 0) {
      this.setData({
        djt: 8,
        d2: true,
        xz: 2
      })
      return
    } if (that.data.scrollTop >= that.data.jsday7 && that.data.jsday7 > 0) {
      this.setData({
        djt: 7,
        d2: true,
        xz: 2
      })
      return
    } if (that.data.scrollTop >= that.data.jsday6 && that.data.jsday6 > 0) {
      this.setData({
        djt: 6,
        d2: true,
        xz: 2
      })
      return
    } if (that.data.scrollTop >= that.data.jsday5 && that.data.jsday5 > 0) {
      this.setData({
        djt: 5,
        d2: true,
        xz: 2
      })
      return
    } if (that.data.scrollTop >= that.data.jsday4 && that.data.jsday4 > 0) {
      this.setData({
        djt: 4,
        d2: true,
        xz: 2
      })
      return
    } if (that.data.scrollTop >= that.data.jsday3 && that.data.jsday3 > 0) {
      this.setData({
        djt: 3,
        d2: true,
        xz: 2
      })
      return
    }
    if (that.data.scrollTop >= that.data.jsday2 && that.data.jsday2 > 0) {
      this.setData({
        djt: 2,
        d2: true,
        xz: 2
      })
      return
    }

    if (that.data.scrollTop >= that.data.jsday1 && that.data.jsday1 > 0) {
      this.setData({
        djt: 1,
        d2: true,
        xz: 2
      })
      return
    }

    if (that.data.scrollTop >= that.data.jsday0) {
      this.setData({
        djt: 0,
        d2: true,
        xz: 2
      })
      return
    }


    if (that.data.scrollTop >= that.data.d2top) {
      console.log(222222);
      this.setData({
        d2: true,
        xz: 2
      })
      return
    }

    if (that.data.scrollTop >= that.data.d1top) {  //临界值，根据自己的需求来调整

      console.log(1111);
      this.setData({
        d2: false,
        xz: 1
      })
    }









  },

})