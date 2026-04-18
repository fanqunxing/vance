function Music() {
  var go = null
  var eat = null
  this.init = function (goSrc, eatSrc) {
    if (!!goSrc) {
      go = document.createElement("audio")
      go.src = goSrc
      document.querySelector("head").appendChild(go)
    }
    if (!!eatSrc) {
      eat = document.createElement("audio")
      eat.src = eatSrc
      document.querySelector("head").appendChild(eat)
    }
  }
  this.go = function () {
    if (!!go) {
      go.play()
    }
  }

  this.eat = function () {
    if (!!eat) {
      eat.play()
    }
  }
}

function WeiQi(dom) {
  var _divDom = dom
  var _width = Math.max(dom.offsetWidth, dom.offsetHeight)
  var _height = _width
  var _canvas = document.createElement("canvas")
  var _context = _canvas.getContext("2d")
  var ROAD_NUM = 19
  var _gridWidth = _height / (ROAD_NUM + 1)
  var BLACK_COLOR = "H"
  var NULL_CHESS = "O"
  var WHITE_COLOR = "B"
  var _onPut = loop
  var _onError = loop
  var _chessBoard = initChessBoard()
  var ERROR_CODE_HAS_CHESS = "1"
  var ERROR_CODE_IS_SUICIDE = "2"
  var ERROR_CODE_IS_DAJIE = "3" // 打劫
  var _stepCount = 0 // 计步器
  var _daJies = {} // 打击标记 把打劫的放在里面
  var _stepList = []
  var _music = new Music()
  var _showStepCount = false

  initCanvas()
  drawBoard()
  drawStars()

  // 空函数
  function loop() {}

  /**
   * 改变棋盘尺寸
   */
  function changeSize() {
    _width = Math.max(dom.offsetWidth, dom.offsetHeight)
    _height = _width
    _gridWidth = _height / (ROAD_NUM + 1)
    _canvas.width = _width
    _canvas.height = _height
  }

  function clone(o) {
    var o1 = JSON.parse(JSON.stringify(o))
    return o1
  }

  // 提子
  function removeBlock(chessBoard, x, y, deadArr, cPos) {
    var checkedPos = cPos || {}
    var type = chessBoard[x][y]
    var deads = deadArr || []
    // 已经数过了
    if (checkedPos[x + "," + y] == true) {
      return 0
    }
    // 如果有棋子
    if (chessBoard[x][y] != NULL_CHESS) {
      deads.push({ x: x, y: y, type: type })
      chessBoard[x][y] = NULL_CHESS
    }
    checkedPos[x + "," + y] = true
    var lx = x - 1
    var rx = x + 1
    var uy = y - 1
    var dy = y + 1
    if (lx >= 0 && chessBoard[lx][y] == type) {
      removeBlock(chessBoard, lx, y, deads, checkedPos)
    }
    if (rx < ROAD_NUM && chessBoard[rx][y] == type) {
      removeBlock(chessBoard, rx, y, deads, checkedPos)
    }
    if (uy >= 0 && chessBoard[x][uy] == type) {
      removeBlock(chessBoard, x, uy, deads, checkedPos)
    }
    if (dy < ROAD_NUM && chessBoard[x][dy] == type) {
      removeBlock(chessBoard, x, dy, deads, checkedPos)
    }
    return deads
  }

  // 数气
  function getBreath(chessBoard, x, y, cPos) {
    var q = 0
    var checkedPos = cPos || {}
    var type = chessBoard[x][y]
    // 已经数过了
    if (checkedPos[x + "," + y] == true) {
      return 0
    }
    checkedPos[x + "," + y] = true
    var lx = x - 1
    var rx = x + 1
    var uy = y - 1
    var dy = y + 1
    if (lx >= 0) {
      // 空位
      if (chessBoard[lx][y] == NULL_CHESS) {
        q = q + 1
        // 自己棋子
      } else if (chessBoard[lx][y] == type) {
        q = q + getBreath(chessBoard, lx, y, checkedPos)
      }
    }
    if (rx < ROAD_NUM) {
      if (chessBoard[rx][y] == NULL_CHESS) {
        q = q + 1
      } else if (chessBoard[rx][y] == type) {
        q = q + getBreath(chessBoard, rx, y, checkedPos)
      }
    }
    if (uy >= 0) {
      // 空位
      if (chessBoard[x][uy] == NULL_CHESS) {
        q = q + 1
        // 自己棋子
      } else if (chessBoard[x][uy] == type) {
        q = q + getBreath(chessBoard, x, uy, checkedPos)
      }
    }
    if (dy < ROAD_NUM) {
      // 空位
      if (chessBoard[x][dy] == NULL_CHESS) {
        q = q + 1
        // 自己棋子
      } else if (chessBoard[x][dy] == type) {
        q = q + getBreath(chessBoard, x, dy, checkedPos)
      }
    }
    return q
  }

  function initChessBoard() {
    var chessBoard = [] //存储落子情况的二维数组
    for (var i = 0; i < ROAD_NUM; i++) {
      chessBoard[i] = []
      for (var j = 0; j < ROAD_NUM; j++) {
        chessBoard[i][j] = NULL_CHESS
      }
    }
    return chessBoard
  }

  function getStepInfoFromPos(x, y) {
    return _stepList.findLast(step => {
      return step.x == x && step.y == y
    })
  }

  function drawAll() {
    clearBoard()
    drawBoard()
    drawStars()
    for (var i = 0; i < _chessBoard.length; i++) {
      for (var j = 0; j < _chessBoard[i].length; j++) {
        var type = _chessBoard[i][j]
        drawOneStep(i, j, type)
      }
    }
  }

  function isHasChess(chessBoard, x, y) {
    return chessBoard[x][y] != NULL_CHESS
  }

  // 是否可以下子
  function isCanDrop(x, y, type) {
    // 如果有子则不能下
    if (isHasChess(_chessBoard, x, y)) {
      _onError({ code: ERROR_CODE_HAS_CHESS, msg: "已经落子，不能落了" })
      return false
    }
    if (isSuicide(x, y, type)) {
      _onError({ code: ERROR_CODE_IS_SUICIDE, msg: "没气" })
      return false
    }
    if (isDaJie(x, y, type)) {
      _onError({ code: ERROR_CODE_IS_DAJIE, msg: "打劫" })
      return false
    }
    return true
  }

  // 沙箱棋盘运行下判断是否是自杀
  function isSuicide(x, y, type) {
    // 获取沙箱棋局
    var chessBoardSandboxie = clone(_chessBoard)

    // 沙箱内下棋
    putChess(chessBoardSandboxie, x, y, type)

    // 沙箱内看是否提子
    var deaths = eatChess(chessBoardSandboxie, x, y, type)

    if (deaths.length > 0) {
      // 此时吃子，不算自杀
      return false
    }

    // 如果没有尺子，则沙箱内数气
    var qi = getBreath(chessBoardSandboxie, x, y)
    // 如果气是0则为自杀行为
    return qi == 0
  }

  function isDaJie(x, y, type) {
    if (
      _daJies[type] &&
      _daJies[type].stepCount == _stepCount + 1 &&
      _daJies[type].pos.x == x &&
      _daJies[type].pos.y == y
    ) {
      return true
    }
    return false
  }

  // 沙箱内判断是否标记打劫
  function isMarkDaJie(x, y, type, deaths) {
    // 获取沙箱棋局
    var chessBoardSandboxie = clone(_chessBoard)

    // 沙箱内下棋
    // putChess(chessBoardSandboxie, x, y, type);

    // // 沙箱内看是否提子
    // var deaths = eatChess(chessBoardSandboxie, x, y, type);

    // console.log(deaths);

    // 提子一个有可能打劫
    if (deaths.length == 1) {
      // 被吃的棋子再下回去试试，看看能不能提子
      var deathChess = deaths[0]
      var x1 = deathChess.x
      var y1 = deathChess.y
      var type1 = deathChess.type
      putChess(chessBoardSandboxie, x1, y1, type1)
      var deaths1 = eatChess(chessBoardSandboxie, x1, y1, type1)

      // 如果也是提子一颗，并且是原来的子，那么就是打劫
      if (
        deaths1.length == 1 &&
        deaths1[0].x == x &&
        deaths1[0].y == y &&
        deaths1[0].type == type
      ) {
        return true
      }
    }
    return false
  }

  var DROP_RESULI_ORDINARY = "0" // 正常下棋成功
  var DROP_RESULI_EAT = "1" // 吃棋
  var DROP_RESULI_FAIL = "2" // 下棋失败

  // 逻辑下棋
  function logicDropChess(x, y, type) {
    console.log(x, y, type)
    // 已经落子，不能落了
    if (!isCanDrop(x, y, type)) {
      return DROP_RESULI_FAIL
    }
    // 下棋。重要
    putChess(_chessBoard, x, y, type)
    var deaths = eatChess(_chessBoard, x, y, type)
    // 标记打劫
    markDaJie(x, y, type, deaths)

    if (deaths.length > 0) {
      return DROP_RESULI_EAT
    }
    return DROP_RESULI_ORDINARY
  }

  function dropChess(x, y, type) {
    var result = logicDropChess(x, y, type)
    if (result == DROP_RESULI_ORDINARY || result == DROP_RESULI_EAT) {
      // 计步器加一
      _stepCount++
      _stepList.push({
        x: x,
        y: y,
        type: type,
        stepCount: _stepCount,
        showStepCount: _showStepCount,
      })
      makeMusic(result == DROP_RESULI_EAT)
      drawAll()
      // todo 改成可以设置的
      // drawActive(x, y)
    }
  }

  function makeMusic(isEat) {
    if (isEat > 0) {
      _music.eat()
    } else {
      _music.go()
    }
  }

  function markDaJie(x, y, type, deaths) {
    var isMDJ = isMarkDaJie(x, y, type, deaths)
    if (isMDJ) {
      var resType = getReverseType(type)
      _daJies[resType] = {
        stepCount: _stepCount + 1,
        pos: { x: deaths[0].x, y: deaths[0].y },
      }
    }
  }

  // 获取反向颜色
  function getReverseType(type) {
    if (BLACK_COLOR == type) {
      return WHITE_COLOR
    }
    if (WHITE_COLOR == type) {
      return BLACK_COLOR
    }
    return type
  }

  // 下棋
  function putChess(chessBoard, x, y, type) {
    chessBoard[x][y] = type
  }

  // 吃子
  function eatChess(chessBoard, x, y, type) {
    // var isEat = false;
    var deaths = []
    var lx = x - 1
    var rx = x + 1
    var uy = y - 1
    var dy = y + 1
    if (lx >= 0) {
      if (![type, NULL_CHESS].includes(chessBoard[lx][y])) {
        var death = autoRemoveChess(chessBoard, lx, y)
        deaths.push.apply(deaths, death)
      }
    }
    if (rx < ROAD_NUM) {
      if (![type, NULL_CHESS].includes(chessBoard[rx][y])) {
        var death = autoRemoveChess(chessBoard, rx, y)
        deaths.push.apply(deaths, death)
      }
    }
    if (uy >= 0) {
      if (![type, NULL_CHESS].includes(chessBoard[x][uy])) {
        var death = autoRemoveChess(chessBoard, x, uy)
        deaths.push.apply(deaths, death)
      }
    }
    if (dy < ROAD_NUM) {
      if (![type, NULL_CHESS].includes(chessBoard[x][dy])) {
        var death = autoRemoveChess(chessBoard, x, dy)
        deaths.push.apply(deaths, death)
      }
    }
    return deaths
  }

  function initCanvas() {
    _canvas.width = _width
    _canvas.height = _height
    _canvas.style.background = "#a97652"
    _canvas.style.cursor = "pointer"
    _divDom.appendChild(_canvas)
    _divDom.onclick = function (e) {
      var g = _gridWidth
      var x = e.offsetX - g
      var y = e.offsetY - g
      var i = Math.round(x / g)
      var j = Math.round(y / g)

      // 用户手动设置一次
      var chessman = { x: i, y: j, type: BLACK_COLOR }

      _onPut(chessman)

      dropChess(chessman.x, chessman.y, chessman.type)
    }
  }

  function autoRemoveChess(chessBoard, x, y) {
    // 0就是没气了
    var NULL_QI = 0
    var death = []
    var qi = getBreath(chessBoard, x, y)
    if (qi == NULL_QI) {
      // 吃子
      death = removeBlock(chessBoard, x, y)
    }
    return death
  }

  function clearBoard() {
    _context.clearRect(0, 0, _width, _height)
  }

  function drawBoard() {
    _context.lineWidth = 1
    _context.strokeStyle = "#000000"
    var g = _gridWidth
    var w = _width
    /*画网格*/
    for (var i = 0; i < ROAD_NUM; i++) {
      _context.beginPath()
      _context.strokeStyle = "#272822"
      _context.moveTo(g + i * g + 0.5, g)
      _context.lineTo(g + i * g + 0.5, w - g)
      _context.stroke()
      _context.moveTo(g, g + i * g + 0.5)
      _context.lineTo(w - g, g + i * g + 0.5)
      _context.stroke()
    }
  }

  /*画特殊星位*/
  function star(k, l) {
    var g = _gridWidth
    _context.beginPath()
    _context.fillStyle = "#2C2924"
    _context.arc(g + k * g, g + l * g, 4, 0, 2 * Math.PI)
    _context.fill()
    _context.closePath()
  }

  function drawActive(i, j) {
    var g = _gridWidth
    _context.beginPath()
    _context.fillStyle = "red"
    _context.arc(g + i * g, g + j * g, g / 6, 0, 2 * Math.PI)
    _context.fill()
    _context.closePath()
  }

  function drawStars() {
    var c = (ROAD_NUM - 1) / 2
    var s = ROAD_NUM / 4 > 3 ? 3 : 2
    var e = ROAD_NUM - 1 - s
    var isBig = ROAD_NUM == 19
    star(s, s)
    isBig && star(s, c)
    star(s, e)
    isBig && star(c, s)
    star(c, c)
    isBig && star(c, e)
    star(e, s)
    isBig && star(e, c)
    star(e, e)
  }

  /*画棋子*/
  function drawOneStep(i, j, type) {
    if (type == NULL_CHESS) {
      return
    }
    var g = _gridWidth
    _context.beginPath()
    var gColor = _context.createRadialGradient(
      g + i * g + 2,
      g + j * g - 2,
      13,
      g + i * g + 2,
      g + j * g - 2,
      0
    )
    if (type === BLACK_COLOR) {
      gColor.addColorStop(0, "#0a0a0a")
      gColor.addColorStop(1, "#636766")
    } else if ((type = WHITE_COLOR)) {
      gColor.addColorStop(0, "#d1d1d1")
      gColor.addColorStop(1, "#f9f9f9")
    }
    _context.fillStyle = gColor
    var x = g + i * g
    var y = g + j * g

    _context.arc(x, y, g / 2 - 1, 0, 2 * Math.PI)
    _context.fill()
    _context.save()
    _context.beginPath()

    _context.fillStyle = "red"
    _context.textAlign = "center"
    _context.textBaseline = "middle"
    _context.font = "15px Georgia"
    var stepInfo = getStepInfoFromPos(i, j)
    if (stepInfo.showStepCount) {
      _context.fillText(stepInfo.stepCount, x, y)
    }
    _context.restore()
    _context.closePath()
  }

  this.onPut = function (fn) {
    _onPut = fn
  }

  this.onError = function (fn) {
    _onError = fn
  }

  // 读取每一步
  this.readStep = function (x, y, type) {
    dropChess(x, y, type)
  }

  // 悔棋一步
  this.backStep = function () {
    _chessBoard = initChessBoard()
    _stepList.pop()
    _stepCount--
    _stepList.forEach(function (step) {
      logicDropChess(step.x, step.y, step.type)
    })
    drawAll()
  }

  this.clearBoard = function () {
    _chessBoard = initChessBoard()
    drawAll()
  }

  this.getStepCount = function () {
    return _stepCount
  }

  this.initSize = function () {
    changeSize()
    drawAll()
  }

  this.changeRoadNum = function (n) {
    ROAD_NUM = n / 1
    _chessBoard = initChessBoard()
    changeSize()
    drawAll()
  }

  this.showStepCount = function (isShow) {
    _showStepCount = Boolean(isShow)
  }

  this.setMusic = function (music) {
    if (!music) {
      return
    }
    _music.init(music.go, music.eat)
  }
}
