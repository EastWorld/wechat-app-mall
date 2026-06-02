const WXAPI = require('apifm-wxapi');

Page({
  data: {
    // 游戏状态
    gameStatus: 'idle', // idle | playing | win | lose
    gameId: null,
    setting: null,

    // 数字格子
    cells: [], // [{num, status: 'active'|'gray'|'selected'}]
    guessCount: 0,
    maxGuessTime: 0,
    remainGuess: 0,

    // 并发控制
    isGuessing: false,

    // 弹窗
    showResult: false,
    resultType: '', // 'win' | 'lose'
    resultMsg: '',
    winScore: 0,
    useScore: 0,

    // 规则弹窗
    showRule: false,

    // 记录弹窗
    showLogs: false,
    logs: [],
    logsPage: 1,
    logsTotalPage: 1,
    logsLoading: false,

    // 动画
    grayingCells: [], // 正在变灰的格子下标集合（用于动画）
  },

  onLoad() {
    // 页面加载时展示规则
    this.setData({ showRule: true });
  },

  onShow() {},

  // 关闭规则弹窗
  closeRule() {
    this.setData({ showRule: false });
  },

  // 开始新一轮游戏
  async startGame() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/index' });
      return;
    }
    wx.showLoading({ title: '开局中...' });
    // https://www.yuque.com/apifm/nu0f75/ivmgriwlhx0y7q4w
    const res = await WXAPI.gameNumberBombBegin({ token });
    wx.hideLoading();

    if (res.code === 2000) {
      wx.navigateTo({ url: '/pages/login/index' });
      return;
    }
    if (res.code !== 0) {
      wx.showToast({ title: res.msg || '开局失败', icon: 'none' });
      return;
    }

    const { bombLog, setting } = res.data;
    const maxNumber = setting.maxNumber;
    const maxGuessTime = setting.maxGuessTime;

    // 生成格子
    const cells = [];
    for (let i = 1; i <= maxNumber; i++) {
      cells.push({ num: i, status: 'active' });
    }

    this.setData({
      gameStatus: 'playing',
      gameId: bombLog.id,
      setting,
      cells,
      guessCount: 0,
      maxGuessTime,
      remainGuess: maxGuessTime,
      isGuessing: false,
      showResult: false,
      useScore: bombLog.useScore,
      showRule: false,
    });
  },

  // 点击某个数字格子
  async onCellTap(e) {
    if (this.data.gameStatus !== 'playing') return;
    if (this.data.isGuessing) return; // 并发控制

    const index = e.currentTarget.dataset.index;
    const cell = this.data.cells[index];
    if (!cell || cell.status !== 'active') return;

    this.setData({ isGuessing: true });

    const token = wx.getStorageSync('token');
    // https://www.yuque.com/apifm/nu0f75/gi5ft2uxta1xw1qr
    const res = await WXAPI.gameNumberBombGuess({
      token,
      id: this.data.gameId,
      number: cell.num,
    });

    this.setData({ isGuessing: false });

    const code = res.code;

    if (code === 0) {
      // 猜中了，赢了
      this._markSelected(index);
      this.setData({
        gameStatus: 'win',
        guessCount: this.data.guessCount + 1,
        remainGuess: this.data.remainGuess - 1,
      });
      setTimeout(() => {
        this.setData({
          showResult: true,
          resultType: 'win',
          resultMsg: '🎉 恭喜你找到了炸弹！',
          winScore: this.data.setting.winScore,
        });
      }, 300);
      return;
    }

    if (code === 20000 || code === 20001) {
      wx.showToast({ title: '游戏已结束，请重新开局', icon: 'none' });
      this.setData({ gameStatus: 'idle' });
      return;
    }

    if (code === 10000 || code === 10001) {
      wx.showToast({ title: res.msg || '游戏未开启', icon: 'none' });
      this.setData({ gameStatus: 'idle' });
      return;
    }

    if (code === 30000) {
      // 次数用完，输了
      this._markSelected(index);
      this.setData({
        gameStatus: 'lose',
        guessCount: this.data.guessCount + 1,
        remainGuess: 0,
        showResult: true,
        resultType: 'lose',
        resultMsg: '💣 次数已用完，很遗憾没找到炸弹',
      });
      return;
    }

    if (code === 40000) {
      // 正确答案 < 当前猜的数字，把 [cell.num, maxNumber] 中高亮的全部置灰
      this._markSelected(index);
      const newGuessCount = this.data.guessCount + 1;
      const newRemain = this.data.remainGuess - 1;
      this.setData({ guessCount: newGuessCount, remainGuess: newRemain });
      this._grayRange(cell.num, this.data.setting.maxNumber);
      return;
    }

    if (code === 40001) {
      // 正确答案 > 当前猜的数字，把 [1, cell.num] 中高亮的全部置灰
      this._markSelected(index);
      const newGuessCount = this.data.guessCount + 1;
      const newRemain = this.data.remainGuess - 1;
      this.setData({ guessCount: newGuessCount, remainGuess: newRemain });
      this._grayRange(1, cell.num);
      return;
    }

    // 其他错误
    wx.showToast({ title: res.msg || '猜测失败', icon: 'none' });
  },

  // 标记当前格子为已选中
  _markSelected(index) {
    const cells = this.data.cells;
    cells[index] = { ...cells[index], status: 'selected' };
    this.setData({ cells });
  },

  // 将 [from, to] 范围内 active 的格子逐步置灰（带动画）
  _grayRange(from, to) {
    const cells = this.data.cells;
    const targets = [];
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].num >= from && cells[i].num <= to && cells[i].status === 'active') {
        targets.push(i);
      }
    }
    if (targets.length === 0) return;

    // 逐个延迟置灰，产生波纹动画效果
    // 最多分 8 批，每批间隔 80ms，避免 setData 过于频繁
    const batchSize = Math.ceil(targets.length / 8);
    const delay = 80;

    for (let batch = 0; batch < 8; batch++) {
      const batchTargets = targets.slice(batch * batchSize, (batch + 1) * batchSize);
      if (batchTargets.length === 0) break;
      setTimeout(() => {
        const updateObj = {};
        batchTargets.forEach(idx => {
          updateObj[`cells[${idx}].status`] = 'gray';
        });
        this.setData(updateObj);
      }, batch * delay);
    }
  },

  // 关闭结果弹窗
  closeResult() {
    this.setData({ showResult: false });
  },

  // 再来一局
  playAgain() {
    this.setData({ showResult: false });
    this.startGame();
  },

  // 查看游戏记录
  async openLogs() {
    this.setData({ showLogs: true, logs: [], logsPage: 1 });
    this._loadLogs(1);
  },

  closeLogs() {
    this.setData({ showLogs: false });
  },

  async _loadLogs(page) {
    if (this.data.logsLoading) return;
    this.setData({ logsLoading: true });
    const token = wx.getStorageSync('token');
    // https://www.yuque.com/apifm/nu0f75/vseytlsk2igapvak
    const res = await WXAPI.gameNumberBombLogs({ token, page, pageSize: 20 });
    this.setData({ logsLoading: false });
    if (res.code !== 0) {
      wx.showToast({ title: res.msg || '获取记录失败', icon: 'none' });
      return;
    }
    // status: 0进行中 1输 2赢 3超时 → 单字映射
    const statusShortMap = { 0: '中', 1: '败', 2: '胜', 3: '超' };
    const result = res.data.result.map(item => ({
      ...item,
      statusShort: statusShortMap[item.status] ?? item.statusStr,
    }));
    const newLogs = page === 1 ? result : [...this.data.logs, ...result];
    this.setData({
      logs: newLogs,
      logsPage: page,
      logsTotalPage: res.data.totalPage,
    });
  },

  loadMoreLogs() {
    const { logsPage, logsTotalPage } = this.data;
    if (logsPage < logsTotalPage) {
      this._loadLogs(logsPage + 1);
    }
  },

  // 格子状态样式映射
  getCellClass(status) {
    return status;
  },
  onShareAppMessage: function() {    
    return {
      title: '炸弹数字王 - 猜中赢积分',
      path: '/game/numberBomb/index?inviter_id=' + (wx.getStorageSync('uid') || ''),
      imageUrl: wx.getStorageSync('gameNumberBomb_share_pic')
    }
  },
  onShareTimeline() {    
    return {
      title: '炸弹数字王 - 猜中赢积分',
      query: 'inviter_id=' + (wx.getStorageSync('uid') || ''),
      imageUrl: wx.getStorageSync('gameNumberBomb_share_pic')
    }
  },
});
