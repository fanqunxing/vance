var trun = false
var over = false
var me = false //true→黑棋，false→白棋
var chessBoard = [] //存储落子情况的二维数组
for (var i = 0; i < 19; i++) {
  chessBoard[i] = []
  for (var j = 0; j < 19; j++) {
    chessBoard[i][j] = 0
  }
}
/*赢法数组*/
var wins = []

/* 赢法的统计数组*/
var myWin = []
var computerWin = []

for (var i = 0; i < 19; i++) {
  wins[i] = []
  for (var j = 0; j < 19; j++) {
    wins[i][j] = []
  }
}
var count = 0

for (var i = 0; i < 19; i++) {
  for (var j = 0; j < 15; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i][j + k][count] = true
    }
    count++
  }
}

for (var i = 0; i < 19; i++) {
  for (var j = 0; j < 15; j++) {
    for (var k = 0; k < 5; k++) {
      wins[j + k][i][count] = true
    }
    count++
  }
}

for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 15; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j + k][count] = true
    }
    count++
  }
}

for (var i = 0; i < 15; i++) {
  for (var j = 18; j > 3; j--) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j - k][count] = true
    }
    count++
  }
}
// console.log(count);

for (var i = 0; i < count; i++) {
  myWin[i] = 0
  computerWin[i] = 0
}

/*----------------------------------------------------*/
/*获取操作画布*/
var chess = document.getElementById("myCanvas")
var context = chess.getContext("2d")
var audios = document.getElementById("audio")
var audios2 = document.getElementById("audio2")
var audios3 = document.getElementById("audio3")
var audios4 = document.getElementById("audio4")
var audios5 = document.getElementById("audio5")

/*音效加载函数*/
var fallmusic = function () {
  audio.play()
}
var mywinmusic = function () {
  audio2.play()
}
var myfallmusic = function () {
  audio3.play()
}
var music = function () {
  audio4.play()
}
var clicks = function () {
  audio5.play()
}

/*设置棋盘材质*/
var material = new Image()
material.src = "img/04.jpg"
material.onload = function () {
  /*加载画*/
  context.drawImage(material, 0, 0, 600, 600)
  drawChessBoard()
  stars()
  /*电脑先手的判断*/
  if (trun) {
    setTimeout("oneStep(9,9,false)", 0) //落子
    chessBoard[9][9] = 2 //站位
    // 注册赢法
    for (var k = 0; k < count; k++) {
      if (wins[9][9][k]) {
        computerWin[k]++
        myWin[k] = 6
      }
    }
  }
}

/*显示头像*/
var showPic = function () {
  var m = myCanvas.getBoundingClientRect().left
  var n = myCanvas.getBoundingClientRect().top
  computerPic.style.left = m + 620 + "px"
  computerPic.style.top = n + "px"
  myPic.style.left = m - 120 + "px"
  myPic.style.top = n + 500 + "px"
  setTimeout(showPic, 10)
}
showPic()

/*更改头像状态*/
var chargePic = function (mYsrc, computerSrc) {
  var mynode = document.getElementById("myPic")
  var mynewnode = document.createElement("img")
  var myoldnew = mynode.childNodes[0]
  mynewnode.src = mYsrc
  mynode.replaceChild(mynewnode, myoldnew)

  var comnode = document.getElementById("computerPic")
  var comnewnode = document.createElement("img")
  var comoldnew = comnode.childNodes[0]
  comnewnode.src = computerSrc
  comnode.replaceChild(comnewnode, comoldnew)
}
/*更改头像边框*/
var chargeBorder = function (myColor, computerColor) {
  myPic.style.borderColor = myColor
  computerPic.style.borderColor = computerColor
}

/*开始按钮的交互*/
var begin = document.getElementById("start")
var tips = document.getElementById("tips")
begin.onclick = function () {
  tips.style.display = "block"
  begin.style.opacity = 0
  slightOut()
  slightIn()
  setTimeout("begin.style.display='none'", 1000)
  clicks()
}

/*渐隐*/
var beginOpc = 1
var slightOut = function () {
  beginOpc -= 0.05
  begin.style.opacity = beginOpc
  if (beginOpc >= 0) {
    setTimeout("slightOut()", 50)
  }
}
/*渐显*/
var tipOpc = 0
var slightIn = function () {
  tipOpc += 0.05
  tips.style.opacity = tipOpc
  if (tipOpc <= 1) {
    setTimeout("slightIn()", 100)
  }
}

/*选择黑白棋*/
var black = document.getElementById("black")
var white = document.getElementById("white")
black.onclick = function () {
  clicks()
  tips.style.display = "none"
  trun = false
  me = true
  material.onload()
  music()
  chargeBorder("#111", "#fff")
}
white.onclick = function () {
  clicks()
  tips.style.display = "none"
  trun = true
  me = true
  material.onload()
  music()
  chargeBorder("#fff", "#111")
}

/*菜单栏选项*/
reStar.onclick = function () {
  clicks()
  location.reload()
}
bjMusic.onclick = function () {
  clicks()
  menu.style.display = "none"
  if (audio4.paused) {
    audio4.play()
    this.innerText = "关闭背景声音"
  } else {
    audio4.pause()
    this.innerText = "打开背景声音"
  }
}

/*胜利显示*/
var myWined = function (txt) {
  context.beginPath()
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.strokeStyle = "red"
  context.fillStyle = "yellow"
  context.font = "80px 微软雅黑"
  context.strokeText(txt, 300, 300)
  context.fillText(txt, 300, 300)
}

/*画网格*/
var drawChessBoard = function () {
  for (var i = 0; i < 19; i++) {
    context.beginPath()
    context.strokeStyle = "#272822"
    context.moveTo(30 + i * 30, 30)
    context.lineTo(30 + i * 30, 570)
    context.stroke()
    context.moveTo(30, 30 + i * 30)
    context.lineTo(570, 30 + i * 30)
    context.stroke()
  }
}

/*画特殊星位*/
var star = function (k, l) {
  context.beginPath()
  context.fillStyle = "#2C2924"
  context.arc(30 + k * 30, 30 + l * 30, 4, 0, 2 * Math.PI)
  context.fill()
  context.closePath()
}
var stars = function () {
  star(3, 3)
  star(3, 9)
  star(3, 15)
  star(9, 3)
  star(9, 9)
  star(9, 15)
  star(15, 3)
  star(15, 9)
  star(15, 15)
}

/*画棋子*/
var oneStep = function (i, j, me) {
  context.beginPath()
  var g = context.createRadialGradient(
    30 + i * 30 + 2,
    30 + j * 30 - 2,
    13,
    30 + i * 30 + 2,
    30 + j * 30 - 2,
    0
  )
  //判断谁执黑棋
  if (!trun) {
    if (me) {
      g.addColorStop(0, "#0a0a0a")
      g.addColorStop(1, "#636766")
    } else {
      g.addColorStop(0, "#d1d1d1")
      g.addColorStop(1, "#f9f9f9")
    }
  } else {
    if (me) {
      g.addColorStop(0, "#d1d1d1")
      g.addColorStop(1, "#f9f9f9")
    } else {
      g.addColorStop(0, "#0a0a0a")
      g.addColorStop(1, "#636766")
    }
  }

  context.fillStyle = g
  context.arc(30 + i * 30, 30 + j * 30, 13, 0, 2 * Math.PI)
  context.fill()
  context.closePath()
  // me=!me;
  fallmusic() //添加音效

  //设置提示块
  var m = myCanvas.getBoundingClientRect().left + i * 30 + 26
  var n = myCanvas.getBoundingClientRect().top + j * 30 + 26
  oneStepTips(m, n, "red")
  //更换头像状态为对战
  chargePic("img/myRead.gif", "img/准备.gif")
}

/*落子跟随的提示*/
var idNum = 0
var tipsCir
var oneStepTips = function (i, j, color) {
  if (tipsCir == undefined) {
    tipsCir = document.createElement("div")
    tipsCir.id = "bo" + idNum
    tipsCir.style.width = "8px"
    tipsCir.style.height = "8px"
    tipsCir.style.background = color
    tipsCir.style.position = "absolute"
    tipsCir.style.left = i + "px"
    tipsCir.style.top = j + "px"
    document.body.appendChild(tipsCir)
  } else {
    tipsCir.style.left = i + "px"
    tipsCir.style.top = j + "px"
  }
  idNum++
}

/*点击落子*/
chess.onclick = function (e) {
  if (over) {
    location.reload()
    return
  }

  if (!me) {
    return
  }
  /*点击样式的判断*/
  if (e.button == 0) {
    menu.style.display = "none" //左击关闭菜单
  } else if (e.button == 2) {
    return //右击无效
  } else if (e.button == 1) {
    menu.style.display = "block" // 中间打开菜单
    menu.style.left = e.clientX + 100 + "px"
    menu.style.top = e.clientY + 50 + "px"
    clicks()
    return
  } else {
    return // 其他
  }

  var x = e.offsetX - 30
  var y = e.offsetY - 30

  var i = Math.round(x / 30)
  var j = Math.round(y / 30)

  /*点在中间地带停止*/
  if (Math.abs(x - i * 30) > 10 || Math.abs(y - j * 30) > 10) {
    return
  }
  if (chessBoard[i][j] == 0) {
    oneStep(i, j, me)
    chessBoard[i][j] = 1
    for (var k = 0; k < count; k++) {
      if (wins[i][j][k]) {
        myWin[k]++
        console.log(myWin[k])
        computerWin[k] = 6
        if (myWin[k] == 5) {
          myWined("你赢了")
          chargePic("img/myWin.gif", "img/失败.GIF")
          mywinmusic()
          over = true
        }
      }
    }
    if (!over) {
      me = !me
      setTimeout("computerAI()", 1000)
    }
  }
}

/*电脑算法*/
var computerAI = function () {
  var myScore = []
  var computerScore = []
  var max = 0
  var u = 0,
    v = 0
  for (var i = 0; i < 19; i++) {
    myScore[i] = []
    computerScore[i] = []
    for (var j = 0; j < 19; j++) {
      myScore[i][j] = 0
      computerScore[i][j] = 0
    }
  }
  for (var i = 0; i < 19; i++) {
    for (var j = 0; j < 19; j++) {
      if (chessBoard[i][j] == 0) {
        for (var k = 0; k < count; k++) {
          if (wins[i][j][k]) {
            if (myWin[k] == 1) {
              myScore[i][j] += 200
            } else if (myWin[k] == 2) {
              myScore[i][j] += 400
            } else if (myWin[k] == 3) {
              myScore[i][j] += 2000
              // myScore[i][j]+=400;
            } else if (myWin[k] == 4) {
              myScore[i][j] += 10000
              // myScore[i][j]+=400;
            }
            if (computerWin[k] == 1) {
              computerScore[i][j] += 220
            } else if (computerWin[k] == 2) {
              computerScore[i][j] += 420
            } else if (computerWin[k] == 3) {
              computerScore[i][j] += 2100
              // computerScore[i][j]+=400;
            } else if (computerWin[k] == 4) {
              computerScore[i][j] += 200000
              // computerScore[i][j]+=1500;
            }
          }
        }
        if (myScore[i][j] > max) {
          max = myScore[i][j]
          u = i
          v = j
        } else if (myScore[i][j] == max) {
          if (computerScore[i][j] > computerScore[u][v]) {
            u = i
            v = j
          }
        }
        if (computerScore[i][j] > max) {
          max = computerScore[i][j]
          u = i
          v = j
        } else if (computerScore[i][j] == max) {
          if (myScore[i][j] > myScore[u][v]) {
            u = i
            v = j
          }
        }
      }
    }
  }

  oneStep(u, v, false)
  chessBoard[u][v] = 2
  for (var k = 0; k < count; k++) {
    if (wins[u][v][k]) {
      computerWin[k]++
      myWin[k] = 6
      if (computerWin[k] == 5) {
        myWined("boarboy赢了")
        chargePic("img/myFail.gif", "img/胜利.GIF")
        myfallmusic()
        over = true
      }
    }
  }
  if (!over) {
    me = !me
  }
}
