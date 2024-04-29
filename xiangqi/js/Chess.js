/**
 * 2.0版本要解决的问题
 *
 * a.对类的重构
 * b.解除对jQuery的依赖
 * c.对外提供可配置的接口
 * d.实现将军算法
 */

/**
 * 一个函数只做一件事，实现全解耦
 */

;(function (factory) {
  factory()

  var version = "2.0"

  function Chess(dom) {
    var _sizeWidth,
      _sizeNet,
      _sizeEdgeX,
      _sizeEdgeY,
      _canvas,
      _context,
      _div,
      _myColor, //red,black
      _lockCheck = "auto",
      _boardNet = [
        [
          ["車", "B"],
          ["馬", "B"],
          ["象", "B"],
          ["士", "B"],
          ["将", "B"],
          ["士", "B"],
          ["象", "B"],
          ["馬", "B"],
          ["車", "B"],
        ],
        [
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
        ],
        [
          [null, "N"],
          ["砲", "B"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          ["砲", "B"],
          [null, "N"],
        ],
        [
          ["卒", "B"],
          [null, "N"],
          ["卒", "B"],
          [null, "N"],
          ["卒", "B"],
          [null, "N"],
          ["卒", "B"],
          [null, "N"],
          ["卒", "B"],
        ],
        [
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
        ],
        [
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
        ],
        [
          ["兵", "R"],
          [null, "N"],
          ["兵", "R"],
          [null, "N"],
          ["兵", "R"],
          [null, "N"],
          ["兵", "R"],
          [null, "N"],
          ["兵", "R"],
        ],
        [
          [null, "N"],
          ["炮", "R"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          ["炮", "R"],
          [null, "N"],
        ],
        [
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
          [null, "N"],
        ],
        [
          ["車", "R"],
          ["馬", "R"],
          ["相", "R"],
          ["仕", "R"],
          ["帥", "R"],
          ["仕", "R"],
          ["相", "R"],
          ["馬", "R"],
          ["車", "R"],
        ],
      ],
      _goTo = {
        select: null, //棋子
        begin: null, //起子坐标
        end: null, //落子坐标
        clicks: 0, //点击次数
      },
      _boardBack = function () {},
      _music = new Music()

    var c = new Coordinate()

    init()

    /*=========== 初始化 =======================*/
    function init() {
      initSize()
      creatCanvas()
      intBoard()
    }

    function creatCanvas() {
      _canvas = document.createElement("canvas")
      _context = _canvas.getContext("2d")
      _canvas.width = _sizeWidth
      _canvas.height = _sizeWidth
      _div.appendChild(_canvas)
      _div.onclick = function (e) {
        clickBoard(e)
      }
    }

    function initSize() {
      _div = document.querySelector(dom)
      _sizeWidth = Math.max(_div.offsetWidth, _div.offsetHeight)
      _sizeNet = (1 / 11) * _sizeWidth
      _sizeEdgeX = (1.5 / 11) * _sizeWidth
      _sizeEdgeY = (1 / 11) * _sizeWidth
      c.init(_sizeEdgeX, _sizeEdgeY, _sizeNet)
    }

    function intBoard() {
      var t = _sizeNet / 6,
        d = _sizeNet / 14
      //竖线九格
      for (var i = 1; i < 8; i++) {
        _context.drawSoildLine(c.x(i), c.y(0), c.x(i), c.y(4))
        _context.drawSoildLine(c.x(i), c.y(5), c.x(i), c.y(9))
      }

      _context.drawSoildLine(c.x(0), c.y(0), c.x(0), c.y(9))
      _context.drawSoildLine(c.x(8), c.y(0), c.x(8), c.y(9))

      //横线八格
      for (var i = 0; i < 10; i++) {
        _context.drawSoildLine(c.x(0), c.y(i), c.x(8), c.y(i))
      }
      //边框
      _context.drawRect(
        c.x(0) - t,
        c.y(0) - t,
        _sizeNet * 8 + 2 * t,
        _sizeNet * 9 + 2 * t,
        (1 / 150) * _sizeWidth,
        "#000"
      )

      //宫
      _context.drawDashLine(c.x(3), c.y(0), c.x(5), c.y(2))
      _context.drawDashLine(c.x(5), c.y(0), c.x(3), c.y(2))
      _context.drawDashLine(c.x(3), c.y(7), c.x(5), c.y(9))
      _context.drawDashLine(c.x(5), c.y(7), c.x(3), c.y(9))

      // 拐角
      _context.corner(c.x(1), c.y(2), d)
      _context.corner(c.x(7), c.y(2), d)
      _context.corner(c.x(0), c.y(3), d, "right")
      _context.corner(c.x(2), c.y(3), d)
      _context.corner(c.x(4), c.y(3), d)
      _context.corner(c.x(6), c.y(3), d)
      _context.corner(c.x(8), c.y(3), d, "left")
      _context.corner(c.x(0), c.y(6), d, "right")
      _context.corner(c.x(2), c.y(6), d)
      _context.corner(c.x(4), c.y(6), d)
      _context.corner(c.x(6), c.y(6), d)
      _context.corner(c.x(8), c.y(6), d, "left")
      _context.corner(c.x(1), c.y(7), d)
      _context.corner(c.x(7), c.y(7), d)

      _context.wirte(
        {
          x: c.x(4),
          y: c.y(4.5),
          r: c.w() / 2,
        },
        "楚\t河\t\t\t\t\t\t\t漢\t界",
        "#000",
        c.w() * 0.7
      )
    }

    /*============ Piece ====================*/
    function drawPiceInBoard() {
      clearBoard() //先清画布
      intBoard()
      for (var i = 0; i < _boardNet.length; i++) {
        var iTemp = _boardNet[i]
        for (var j = 0; j < iTemp.length; j++) {
          var posObj = { x: i, y: j }
          _boardNet[i][j][2] = pieceFactory(_boardNet[i][j], posObj)
        }
      }
    }

    function pieceFactory(arrElem, posObj) {
      var inWidth = _sizeNet / 12
      var circle = {
        x: c.x(posObj.y), //数组和物理的x,y不对应
        y: c.y(posObj.x), //所以颠倒一次
        r: c.w() / 2,
      }

      var incircle = {
        x: c.x(posObj.y),
        y: c.y(posObj.x),
        r: c.w() / 2 - inWidth,
      }

      if (!!arrElem[0]) {
        _context.drawCircle(circle, "#fff", null, 1)
        _context.drawCircle(incircle, "#fff", getColor(arrElem[1]), 2)
        _context.wirte(circle, arrElem[0], getColor(arrElem[1]), c.w() * 0.6)
      }

      function getColor(c) {
        if (c == "R") {
          return "#C00B04"
        } else if (c == "B") {
          return "#000"
        }
      }
      return {
        c: arrElem[1],
        x: posObj.x,
        y: posObj.y,
        n: arrElem[0],
      }
    }

    /*=============== 棋子驱动 ==========================*/
    //读取 _goTo 进行变化
    function moveTo() {
      var go = _goTo.begin
      var to = _goTo.end
      var color = _boardNet[go[0]][go[1]][1]
      //自检验
      var checkResult = check(go, to)
      if (checkResult == "No") {
        return false
      } else if (checkResult == "Go") {
        _music.go()
      } else if (checkResult == "Eat") {
        _music.eat()
      }
      _boardNet[to[0]][to[1]] = _boardNet[go[0]][go[1]]
      _boardNet[go[0]][go[1]] = [null, "N"]
      drawPiceInBoard()

      //激活轨迹
      activeStatus(go, color)
      activeStatus(to, color)
    }

    //激活位置
    function activeStatus(posArr, color) {
      var color = (function (c) {
        if (c == "R") {
          return "#00F"
        } else if (c == "B") {
          return "#F00"
        } else {
          return false
        }
      })(color)

      var circle = {
        x: c.x(posArr[1]),
        y: c.y(posArr[0]),
        r: c.w() / 2,
        c: color,
      }
      _context.active(circle)
    }

    /*============  事件绑定 ==========================*/
    function clickBoard(e) {
      //有效选择点击
      _goTo.clicks++
      var x = c.py(e.offsetY),
        y = c.px(e.offsetX)
      var color = (function () {
        return _boardNet[x][y][1]
      })()
      if (_goTo.clicks == 1) {
        //无效点击
        if (isLockChess(color)) {
          //只允许点击我方子力
          _goTo.clicks = 0
          return
        }
        _goTo.begin = [x, y]
        _goTo.select = _boardNet[x][y][1]
        _music.select()
        drawPiceInBoard()
        activeStatus([x, y], _goTo.select)
      } else {
        var checkResult = check(_goTo.begin, [x, y])
        //为重选点击
        if (checkResult == "No") {
          _goTo.begin = [x, y]
          _goTo.select = _boardNet[x][y][1]
          _music.select()
          drawPiceInBoard()
          activeStatus([x, y], _goTo.select)
          return
        }
        if (checkResult == "Eat") {
          _music.eat()
        }
        if ((checkResult = "Go")) {
          _music.go()
        }
        _goTo.end = [x, y]
        _goTo.clicks = 0
        moveTo()
        drawPiceInBoard()
        activeStatus(_goTo.begin, _goTo.select)
        activeStatus([x, y], _goTo.select)
        if (isDanger().result == true && isDanger().color != _myColor) {
          _music.danger()
        }

        //点击事件返回 == > 重要
        _boardBack(_goTo, _boardNet.clone().reverse())
      }
    }

    /*========== 规则性锁棋 ==============*/
    function isLockChess(color) {
      var myColor = changeColor(_myColor)
      //不锁
      if (_lockCheck == "no") {
        return false
      }
      //锁颜色
      if (_lockCheck == color) {
        return true
      }
      //全部锁
      if (_lockCheck == "all") {
        return true
      }
      if (_lockCheck == "auto") {
        if (myColor != color) {
          return true
        }
      }
      return true
    }

    /*=========== 校验器 ======================*/
    /**
     * 返回 "Go","Eat","No"
     */
    function check(go, to) {
      var base = baseCheck(go, to)
      var my = myCheck(go, to)
      var see = NetCheck.isKingSee(go, to)
      if (see) {
        return "No"
      }
      if (isDanger().result == true && isDanger().color == _myColor) {
        return "No"
      }
      if (base == "No" || my == "No") {
        return "No"
      } else {
        return base
      }
    }

    /**
     * 返回 "Go","Eat","No"
     */
    function baseCheck(go, to) {
      var goColor = _boardNet[go[0]][go[1]][1]
      var toColor = _boardNet[to[0]][to[1]][1]

      if (goColor == toColor || goColor == "N") {
        return "No"
      } else if (toColor == "N") {
        return "Go"
      } else {
        return "Eat"
      }
    }

    /**
     * 将军算法
     */
    function isDanger(myBoardNet) {
      if (!myBoardNet) {
        myBoardNet = _boardNet
      }
      var result = false
      var color = "N"
      var king = NetCheck.getKing(myBoardNet)
      var kingR = [king.R.x, king.R.y]
      var kingB = [king.B.x, king.B.y]
      for (var i = 0; i < myBoardNet.length; i++) {
        for (var j = 0; j < myBoardNet[i].length; j++) {
          if (!!myBoardNet[i][j][0]) {
            if (myBoardNet[i][j][1] == "R") {
              if (myCheck([i, j], kingB) == "Eat") {
                result = true
                color = "black"
              }
            } else {
              if (myCheck([i, j], kingR) == "Eat") {
                result = true
                color = "red"
              }
            }
          }
        }
      }
      return {
        result: result,
        color: color,
      }
    }

    /**
     * 特殊校验器
     */
    function myCheck(go, to) {
      var rtn = "No"
      var name = _boardNet[go[0]][go[1]][0]
      switch (name) {
        case "車":
          if (NetCheck.isLine(go, to) && NetCheck.getMiddlePiece(go, to) == 0) {
            rtn = "Eat"
          }
          break
        case "砲":
        case "炮":
          if (NetCheck.isLine(go, to)) {
            if (
              NetCheck.getMiddlePiece(go, to) == 0 &&
              baseCheck(go, to) == "Go"
            ) {
              rtn = "Go"
            } else if (
              NetCheck.getMiddlePiece(go, to) == 1 &&
              baseCheck(go, to) == "Eat"
            ) {
              rtn = "Eat"
            }
          }
          break
        case "相":
        case "象":
          if (
            NetCheck.isOpposite(go, to) &&
            NetCheck.distance(go, to) == 2 * Math.sqrt(2) &&
            NetCheck.getMiddlePiece(go, to) == 0 &&
            !NetCheck.isCrossRiver(go, to)
          ) {
            rtn = "Eat"
          }

          break
        case "馬":
          if (
            NetCheck.distance(go, to) == Math.sqrt(5) &&
            !NetCheck.isAstrictHorse(go, to)
          ) {
            rtn = "eat"
          }
          break
        case "士":
        case "仕":
          if (
            NetCheck.distance(go, to) == Math.sqrt(2) &&
            !NetCheck.isLeavePalace(go, to)
          ) {
            rtn = "eat"
          }
          break
        case "将":
        case "帥":
          if (
            NetCheck.distance(go, to) == 1 &&
            !NetCheck.isLeavePalace(go, to)
          ) {
            rtn = "eat"
          }
          break
        case "兵":
        case "卒":
          if (NetCheck.distance(go, to) != 1) {
            rtn = "No"
          } else {
            if (!NetCheck.isCrossRiver(go, to)) {
              if (NetCheck.isGo(go, to)) {
                rtn = "eat"
              }
            } else {
              if (!NetCheck.isBack(go, to)) {
                rtn = "eat"
              }
            }
          }
          break
      }
      return rtn
    }

    var NetCheck = (function () {
      //1.是否在通一直线
      function isLine(p1, p2) {
        var bFlag = false
        if (p1[0] == p2[0] || p1[1] == p2[1]) {
          bFlag = true
        }
        return bFlag
      }
      //2.中间间隔多少子
      function getMiddlePiece(p1, p2, myBoardNet) {
        if (!myBoardNet) {
          myBoardNet = _boardNet
        }
        var xAbs = p2[0] - p1[0]
        var yAbs = p2[1] - p1[1]
        var nums = 0
        if (p1[0] == p2[0]) {
          var minY = Math.min(p1[1], p2[1])
          var maxY = Math.max(p1[1], p2[1])
          for (var j = minY + 1; j < maxY; j++) {
            if (!!myBoardNet[p1[0]][j][0]) {
              nums++
            }
          }
        } else if (p1[1] == p2[1]) {
          var minX = Math.min(p1[0], p2[0])
          var maxY = Math.max(p1[0], p2[0])
          for (var i = minX + 1; i < maxY; i++) {
            if (!!myBoardNet[i][p1[1]][0]) {
              nums++
            }
          }
        } else if (Math.abs(xAbs) == Math.abs(yAbs)) {
          //考虑斜对角
          for (var i = 0; i < Math.abs(xAbs); i++) {
            var tempX = p1[0] + (xAbs / Math.abs(xAbs)) * i
            var tempY = p1[1] + (yAbs / Math.abs(yAbs)) * i
            if (!!myBoardNet[tempX][tempY][0]) {
              nums++
            }
          }
          nums--
        } else {
          //返回畸形数据
          nums = 99999999999999999
        }
        return nums
      }

      //两点之间的距离
      function distance(p1, p2) {
        var xAbs = Math.abs(p1[0] - p2[0])
        var yAbs = Math.abs(p1[1] - p2[1])
        return Math.sqrt(xAbs * xAbs + yAbs * yAbs)
      }

      //是否对角
      function isOpposite(p1, p2) {
        var resOpp = false
        var xAbs = Math.abs(p1[0] - p2[0])
        var yAbs = Math.abs(p1[1] - p2[1])
        if (yAbs == xAbs) {
          resOpp = true
        }
        return resOpp
      }

      //是否过河
      function isCrossRiver(p1, p2) {
        var result = false
        var pieceColor = _boardNet[p1[0]][p1[1]][1]
        if (pieceColor == "B" && p2[0] > 4) {
          result = true
        } else if (pieceColor == "R" && p2[0] <= 4) {
          result = true
        }
        if (_myColor != "red") {
          result = !result
        }
        return result
      }
      //不能离开皇宫
      function isLeavePalace(p1, p2) {
        var result = true
        if (p1[0] <= 2) {
          if (p2[0] <= 2 && p2[1] >= 3 && p2[1] <= 5) {
            result = false
          }
        }
        if (p2[0] >= 7) {
          if (p1[0] >= 7 && p2[1] >= 3 && p2[1] <= 5) {
            result = false
          }
        }
        return result
      }

      //拌马脚
      function isAstrictHorse(p1, p2) {
        var yAbs = Math.abs(p1[0] - p2[0])
        var xAbs = Math.abs(p1[1] - p2[1])
        var result = false
        if (yAbs > xAbs) {
          var midX = (p1[0] + p2[0]) / 2
          // 拌马脚
          if (!!_boardNet[midX][p1[1]][0]) {
            result = true
          }
        } else {
          var midY = (p1[1] + p2[1]) / 2
          // 拌马脚
          if (!!_boardNet[p1[0]][midY][0]) {
            result = true
          }
        }
        return result
      }

      //行走方向
      function runDirect(p1, p2) {
        var xAbs = p1[0] - p2[0]
        var yAbs = p1[1] - p2[1]
        if (Math.abs(xAbs) > Math.abs(yAbs)) {
          if (p1[0] - p2[0] > 0) {
            return "-x"
          } else {
            return "+x"
          }
        } else if (Math.abs(xAbs) == Math.abs(yAbs)) {
          return "xy"
        } else {
          if (p1[1] - p2[1] > 0) {
            return "-y"
          } else {
            return "+y"
          }
        }
      }

      //是否后退
      function isBack(p1, p2) {
        var pieceColor = _boardNet[p1[0]][p1[1]][1]
        var result = true
        if (pieceColor == "B" && p2[0] >= p1[0]) {
          result = false
        } else if (pieceColor == "R" && p2[0] <= p1[0]) {
          result = false
        }
        if (_myColor != "red") {
          if (pieceColor == "B" && p2[0] <= p1[0]) {
            result = false
          } else if (pieceColor == "R" && p2[0] >= p1[0]) {
            result = false
          }
        }
        return result
      }

      //只能向前走
      function isGo(p1, p2) {
        var result = false
        var pieceColor = _boardNet[p1[0]][p1[1]][1]
        if (pieceColor == "B" && p2[0] > p1[0]) {
          result = true
        } else if (pieceColor == "R" && p2[0] < p1[0]) {
          result = true
        }

        if (_myColor != "red") {
          if (pieceColor == "B" && p2[0] < p1[0]) {
            result = true
          } else if (pieceColor == "R" && p2[0] > p1[0]) {
            result = true
          }
        }
        return result
      }

      //皇帝是否见面
      function isKingSee(p1, p2) {
        var myBoardNet = _boardNet.clone()
        myBoardNet[p2[0]][p2[1]] = myBoardNet[p1[0]][p1[1]]
        myBoardNet[p1[0]][p1[1]] = [null, "N"]
        var see = getKing(myBoardNet)
        var king1 = [see.R.x, see.R.y]
        var king2 = [see.B.x, see.B.y]
        return (
          isLine(king1, king2) && getMiddlePiece(king1, king2, myBoardNet) == 0
        )
      }

      function getKing(myBoardNet) {
        if (!myBoardNet) {
          myBoardNet = _boardNet
        }
        var king = {}
        for (var i = 0; i < myBoardNet.length; i++) {
          for (var j = 0; j < myBoardNet[i].length; j++) {
            var name = myBoardNet[i][j][0]
            if (name == "将") {
              king.B = myBoardNet[i][j][2]
            }
            if (name == "帥") {
              king.R = myBoardNet[i][j][2]
            }
          }
        }
        return king
      }

      return {
        isLine: isLine,
        getMiddlePiece: getMiddlePiece,
        isOpposite: isOpposite,
        distance: distance,
        isCrossRiver: isCrossRiver,
        isAstrictHorse: isAstrictHorse,
        isLeavePalace: isLeavePalace,
        runDirect: runDirect,
        isBack: isBack,
        isGo: isGo,
        isKingSee: isKingSee,
        getKing: getKing,
      }
    })()

    /* ============== 接口 =====================*/
    this.test = function () {}

    this.setBoardNet = function (boardNet) {
      var result = false
      if (!!boardNet) {
        _boardNet = boardNet
        result = true
      }
      if (_myColor == "black") {
        _boardNet.reverse()
      }
      return result
    }

    this.getBoardNet = function () {
      return _boardNet
    }

    this.setColor = function (color) {
      var result = false
      if (!color) {
        color = "red"
        result = true
      }
      _myColor = color
      return result
    }

    this.initBoardNet = function () {
      drawPiceInBoard()
    }

    this.move = function (go, to) {
      var res = false
      if (check(go, to) != "No") {
        _goTo.begin = go
        _goTo.end = to
        moveTo(go, to)
        res = true
      }
      return res
    }

    this.setMusic = function (music) {
      if (!music) {
        return
      }
      _music.init(music.select, music.eat, music.go, music.danger)
    }

    this.click = function (fn) {
      _boardBack = fn
    }

    //锁棋 order : all[所有] red[红方] black[黑方] auto[自己] no[不锁]
    this.lockCheck = function (order) {
      var orderArr = ["all", "red", "black", "auto", "no"]
      if (orderArr.toString().indexOf(order) > -1) {
        _lockCheck = order
        if (order == "red") {
          _lockCheck = "R"
        } else if (order == "black") {
          _lockCheck = "B"
        }
      } else {
        _lockCheck = "auto"
      }
    }

    /*========== 基础工具 ====================*/
    function Music() {
      var select = null
      var go = null
      var eat = null
      var danger = null
      this.init = function (selectSrc, eatSrc, goSrc, dangerSrc) {
        if (!!selectSrc) {
          select = document.createElement("audio")
          select.src = selectSrc
          document.querySelector("head").appendChild(select)
        }
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
        if (!!dangerSrc) {
          danger = document.createElement("audio")
          danger.src = dangerSrc
          document.querySelector("head").appendChild(danger)
        }
      }
      this.select = function () {
        if (!!select) {
          select.play()
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
      this.danger = function () {
        if (!!danger) {
          danger.play()
        }
      }
    }

    function clearBoard() {
      _context.clearRect(0, 0, _sizeWidth, _sizeWidth)
    }

    function Coordinate() {
      var xf
      var yf
      var nf
      this.x = function (x) {
        return xf / 1 + (x * nf) / 1
      }
      this.y = function (y) {
        return yf / 1 + (y * nf) / 1
      }
      this.px = function (x) {
        return Math.round((x - xf) / nf)
      }
      this.py = function (y) {
        return Math.round((y - yf) / nf)
      }
      this.w = function () {
        return nf
      }

      this.init = function (xfactor, yfactor, nfactor) {
        xf = xfactor
        yf = yfactor
        nf = nfactor
      }
    }

    /**
     *颜色转化
     */
    function changeColor(color) {
      var colorArr = ["N", "B", "R"]
      if (colorArr.toString().indexOf(color) > -1) {
        return color
      }
      if (color == "red") {
        return "R"
      } else if (color == "black") {
        return "B"
      } else {
        return "N"
      }
    }
  }

  window.Chess = Chess
})(function () {
  Object.prototype.clone = function () {
    return JSON.parse(JSON.stringify(this))
  }

  CanvasRenderingContext2D.prototype.drawSoildLine = function (
    x1,
    y1,
    x2,
    y2,
    lineWidth,
    strokeStyle
  ) {
    this.beginPath()
    this.lineWidth = lineWidth == undefined ? 1 : lineWidth
    this.strokeStyle = strokeStyle == undefined ? "#272822" : strokeStyle
    this.moveTo(x1, y1)
    this.lineTo(x2, y2)
    this.stroke()
  }

  CanvasRenderingContext2D.prototype.drawDashLine = function (
    x1,
    y1,
    x2,
    y2,
    dashLength,
    lineWidth,
    strokeStyle
  ) {
    var dashLen = dashLength === undefined ? 5 : dashLength,
      xpos = x2 - x1,
      ypos = y2 - y1,
      numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen)
    this.beginPath()
    ;(this.lineWidth = lineWidth == undefined ? 1 : lineWidth),
      (this.strokeStyle = strokeStyle == undefined ? "#272822" : strokeStyle)
    for (var i = 0; i < numDashes; i++) {
      if (i % 2 == 0) {
        this.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i)
      } else {
        this.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i)
      }
    }
    this.stroke()
  }

  CanvasRenderingContext2D.prototype.corner = function (x, y, t, side) {
    var ctx = this
    switch (side) {
      case "left":
        cornerBase(ctx, x, y, t, -1, 1)
        cornerBase(ctx, x, y, t, -1, -1)
        break
      case "right":
        cornerBase(ctx, x, y, t, 1, 1)
        cornerBase(ctx, x, y, t, 1, -1)
        break
      default:
        cornerBase(ctx, x, y, t, 1, 1)
        cornerBase(ctx, x, y, t, 1, -1)
        cornerBase(ctx, x, y, t, -1, 1)
        cornerBase(ctx, x, y, t, -1, -1)
    }

    function cornerBase(ctx, x, y, t, kx, ky) {
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = "#272822"
      ctx.moveTo(x + kx * t * 3, y + ky * t)
      ctx.lineTo(x + kx * t, y + ky * t)
      ctx.lineTo(x + kx * t, y + ky * t * 3)
      ctx.stroke()
    }
  }

  CanvasRenderingContext2D.prototype.drawCircle = function (
    mycircle,
    fillStyle,
    strokeStyle,
    lineWidth
  ) {
    this.beginPath()
    this.strokeStyle = !!strokeStyle ? strokeStyle : "#272822"
    this.lineWidth = !!lineWidth ? lineWidth : 1
    this.fillStyle = fillStyle
    this.arc(mycircle.x, mycircle.y, mycircle.r, 0, Math.PI * 2, false)
    if (fillStyle) {
      this.fill()
    }
    this.stroke()
  }

  CanvasRenderingContext2D.prototype.wirte = function (
    pos,
    name,
    fillStyle,
    font
  ) {
    this.beginPath()
    this.textAlign = "center"
    this.textBaseline = "middle"
    this.lineWidth = 1
    this.strokeStyle = " black"
    this.fillStyle = fillStyle
    this.font = font + "px 楷体"
    this.fillText(name, pos.x, pos.y)
    this.stroke()
  }

  CanvasRenderingContext2D.prototype.active = function (posInfo) {
    cornerBase(this, posInfo.x, posInfo.y, posInfo.r - 2, posInfo.c)
    function cornerBase(ctx, x, y, r, c) {
      ctx.lineWidth = 3
      ctx.strokeStyle = c
      ctx.beginPath()
      ctx.moveTo(x + r, y + r - r / 3)
      ctx.lineTo(x + r, y + r)
      ctx.lineTo(x + r - r / 3, y + r)

      ctx.moveTo(x + r, y - r + r / 3)
      ctx.lineTo(x + r, y - r)
      ctx.lineTo(x + r - r / 3, y - r)
      ctx.stroke()

      ctx.moveTo(x - r, y - r + r / 3)
      ctx.lineTo(x - r, y - r)
      ctx.lineTo(x - r + r / 3, y - r)

      ctx.moveTo(x - r, y + r - r / 3)
      ctx.lineTo(x - r, y + r)
      ctx.lineTo(x - r + r / 3, y + r)
      ctx.stroke()
    }
  }

  CanvasRenderingContext2D.prototype.drawRect = function (
    x,
    y,
    hx,
    hy,
    lineWidth,
    strokeStyle
  ) {
    this.beginPath()
    this.lineWidth = lineWidth
    this.strokeStyle = strokeStyle
    this.rect(x, y, hx, hy)
    this.closePath()
    this.stroke()
  }
})
