//本来打算用七个二维数组存储七种形状，但有第八个就崩溃的bug
//所以没有用；下面七个数组只是一个对应的注释
/*
var L=[[-3,4,null],[-2,4,null],[-1,4,null],[-1,5,null]];
var S=[[-3,3,null],[-2,3,null],[-2,4,null],[-1,4,null]];
var I=[[-1,4,null],[-2,4,null],[-3,4,null],[-4,4,null]];
var J=[[-3,4,null],[-2,4,null],[-1,4,null],[-1,3,null]];
var Z=[[-2,3,null],[-2,4,null],[-1,4,null],[-1,5,null]];
var O=[[-2,5,null],[-2,4,null],[-1,4,null],[-1,5,null]];
var T=[[-2,5,null],[-2,4,null],[-2,3,null],[-1,4,null]];
*/

var blockArr = [] //形状的三维数组
//初始化数组
for (var i = 0; i < 100; i++) {
  blockArr[i] = [
    [-3, 4, null],
    [-2, 4, null],
    [-1, 4, null],
    [-1, 5, null],
    ["L", "red"],
  ] //放L
}
for (var i = 100; i < 200; i++) {
  blockArr[i] = [
    [-1, 4, null],
    [-2, 4, null],
    [-3, 4, null],
    [-4, 4, null],
    ["I", "orange"],
  ] //I
}
for (var i = 200; i < 300; i++) {
  blockArr[i] = [
    [-3, 4, null],
    [-2, 4, null],
    [-1, 4, null],
    [-1, 3, null],
    ["J", "green"],
  ] //J
}
for (var i = 300; i < 400; i++) {
  blockArr[i] = [
    [-2, 3, null],
    [-2, 4, null],
    [-1, 4, null],
    [-1, 5, null],
    ["Z", "blue"],
  ] //Z
}
for (var i = 400; i < 500; i++) {
  blockArr[i] = [
    [-3, 3, null],
    [-2, 3, null],
    [-2, 4, null],
    [-1, 4, null],
    ["S", "#2493EB"],
  ] //S
}
for (var i = 500; i < 600; i++) {
  blockArr[i] = [
    [-2, 5, null],
    [-2, 4, null],
    [-1, 4, null],
    [-1, 5, null],
    ["O", "#C639F5"],
  ] //O
}
for (var i = 600; i < 700; i++) {
  blockArr[i] = [
    [-2, 5, null],
    [-2, 4, null],
    [-2, 3, null],
    [-1, 4, null],
    ["T", "yellow"],
  ] //T
}
blockArr.sort(function () {
  return Math.random() - 0.5
}) //打乱数组
var index = 0 //形状数组的取数索引,这是全局的核心
var position = [] //占位数组，这是占位，停止，变形的核心。若是true→可以使用；若是false→已经被占用
var times = null // 定时器
var speed = 500
var score = 0 //游戏积分
//初始化这个二维数组
for (var i = -4; i < 21; i++) {
  position[i] = []
  for (var j = 0; j < 10; j++) {
    position[i][j] = true //可以存放为true
  }
}
//把第21行初始为false
for (var k = 0; k < 10; k++) {
  position[20][k] = false //第21行成为一堵墙
}

/*添加菜单*/
var scograss = document.getElementById("sco")
var restart = document.getElementsByClassName("restart")[0]
var deg = document.getElementById("deg")
var musicBj = document.getElementsByClassName("music")[0]
//计分函数
var setScore = function () {
  music("audio4")
  score++
  scograss.innerText = score
}
//重新开始
restart.onclick = function () {
  music("audio1")
  location.reload()
}
//难度的选择
var degBool = true //难度开关
function degs(obj) {
  music("audio1")
  if (degBool) {
    deg.innerText = obj
    if (obj == "低级") {
      speed = 500
    } else if (obj == "中级") {
      speed = 300
    } else if (obj == "高级") {
      speed = 150
    }
  }
}
//音效函数
var music = function (id, stop) {
  var audios = document.getElementById(id)
  audios.play()
  if (stop) {
    audios.pause()
  }
}

//背景音乐的控制
var musicBjBool = true //背景开关
musicBj.onclick = function () {
  if (musicBjBool) {
    music("audio2")
    musicBj.innerText = "关闭背景音乐"
  } else {
    music("audio2", "stop")
    musicBj.innerText = "开启背景音乐"
  }
  musicBjBool = !musicBjBool
}

/*开始函数*/
var beginBool = true //开始开关
var begin = document.getElementById("start")
begin.onclick = function () {
  music("audio1")
  musicBj.innerText = "关闭背景音乐"
  if (beginBool) {
    //正常情况开始
    degBool = false //关闭难度点击的可能
    music("audio2")
    begin.style.display = "none"
    times = setInterval("moveBlock(" + index + ")", speed)
  } else {
    //结束游记后刷新开始
    location.reload()
  }
}

// ----------------------------------------------------------------
/*绘制下落方块*/
var drawBlock = function () {
  onFall = true //开启下移
  // if(blockArr[index]==undefined){clearInterval(times);return }
  for (var i = 0; i < blockArr[index].length - 1; i++) {
    if (blockArr[index][i][2] == null) {
      //创建
      var grass = document.getElementById("grass")
      blockArr[index][i][2] = document.createElement("span")
      blockArr[index][i][2].style.width = 20 + "px"
      blockArr[index][i][2].style.height = 20 + "px"
      blockArr[index][i][2].style.background =
        blockArr[index][blockArr[index].length - 1][1]
      blockArr[index][i][2].style.border = "solid 1px #000"
      blockArr[index][i][2].style.boxSizing = "border-box"
      blockArr[index][i][2].style.display = "block"
      blockArr[index][i][2].style.position = "absolute"
      blockArr[index][i][2].style.top = blockArr[index][i][0] * 20 + "px"
      blockArr[index][i][2].style.left = blockArr[index][i][1] * 20 + "px"
      grass.appendChild(blockArr[index][i][2])
    } else {
      //行为的移动
      blockArr[index][i][2].style.top = blockArr[index][i][0] * 20 + "px"
      blockArr[index][i][2].style.left = blockArr[index][i][1] * 20 + "px"
      blockArr[index][i][2].className = "box" + blockArr[index][i][0]
    }
  }
}
/*预测方块的绘制*/
var preBlock = function () {
  var pregrass = document.getElementById("preBlock")
  var preChild = pregrass.childNodes
  pregrass.style.background = "#272822"
  for (var i = 0; i < preChild.length; i++) {
    pregrass.removeChild(preChild[0]) //注意只要一直清除第一个就行了
  }
  for (var i = 0; i < blockArr[index + 1].length - 1; i++) {
    //创建
    var grass = document.getElementById("grass")
    var preSpan = document.createElement("span")
    preSpan.style.width = 20 + "px"
    preSpan.style.height = 20 + "px"
    preSpan.style.background =
      blockArr[index + 1][blockArr[index + 1].length - 1][1]
    preSpan.style.border = "solid 1px #000"
    preSpan.style.boxSizing = "border-box"
    preSpan.style.display = "block"
    preSpan.style.position = "absolute"
    preSpan.style.top = blockArr[index + 1][i][0] * 20 + 100 + "px"
    preSpan.style.left = blockArr[index + 1][i][1] * 20 - 40 + "px"
    pregrass.appendChild(preSpan)
  }
}

// ---------------------------------------------------------------------
/*结合块的移动*/
var moveBlock = function () {
  // 判断游戏是否结束
  if (ifGameOver()) {
    clearInterval(times)
    begin.style.display = "block"
    begin.innerText = "游戏结束"
    beginBool = false //还原开始开关
    return
  }
  //数组的移动
  for (var j = 0; j < blockArr[index].length - 1; j++) {
    blockArr[index][j][0] += 1
  }
  //下面两个函数的顺序千万不能乱否则有挤压bug
  preBlock() //预测下一块
  drawBlock()
  cross()
  onLeft = true //开启左移
  onRight = true //开启右移

  clearBlock()
  clearBlocking()
}

// ---------------------------------------------------------------------------

/*越界判断*/
var onDown = false
var cross = function () {
  for (var i = 0; i < blockArr[index].length - 1; i++) {
    //记录方块未来一步的位置并判断是否被占用
    if (!position[blockArr[index][i][0] + 1][blockArr[index][i][1]]) {
      clearInterval(times) //如果被占用停止
      onDown = true
      // console.log(index+'到了下边界了')
      break
    }
  }

  if (onDown) {
    for (var j = 0; j < blockArr[index].length - 1; j++) {
      //blockArr[s][j][0]//x的位置
      //blockArr[s][j][1]//y的位置
      position[blockArr[index][j][0]][blockArr[index][j][1]] = false //记录此位置
    }
    times = setInterval("moveBlock(" + index + ")", speed)
    index++
    onDown = false
  }
}

// -------------------------------------------------------------
/*按上键进行九十度的变化*/
var rotates = function () {
  if (blockArr[index][blockArr[index].length - 1][0] == "L") {
    if (
      position[blockArr[index][0][0] + 2][blockArr[index][0][1] + 2] &&
      position[blockArr[index][1][0]][blockArr[index][0][1] + 2]
    ) {
      blockArr[index][0][0] += 2
      blockArr[index][0][1] += 2
      blockArr[index][1][1] += 2
      blockArr[index][blockArr[index].length - 1][0] = "L1"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "L1") {
    if (
      position[blockArr[index][0][0] - 1][blockArr[index][0][1] - 1] &&
      position[blockArr[index][1][0] - 1][blockArr[index][0][1] - 1] &&
      position[blockArr[index][2][0] - 2][blockArr[index][0][1]]
    ) {
      blockArr[index][0][0] -= 1
      blockArr[index][0][1] -= 1
      blockArr[index][1][0] -= 1
      blockArr[index][1][1] -= 1
      blockArr[index][2][0] -= 2
      blockArr[index][blockArr[index].length - 1][0] = "L2"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "L2") {
    if (
      position[blockArr[index][0][0] + 1][blockArr[index][0][1] + 1] &&
      position[blockArr[index][1][0] + 1][blockArr[index][1][1] - 1] &&
      position[blockArr[index][2][0] + 1][blockArr[index][0][1]]
    ) {
      blockArr[index][0][0] += 1
      blockArr[index][0][1] += 1
      blockArr[index][1][0] += 3
      blockArr[index][1][1] -= 1
      blockArr[index][2][0] += 2
      blockArr[index][blockArr[index].length - 1][0] = "L3"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "L3") {
    if (
      position[blockArr[index][0][0] - 2][blockArr[index][0][1] - 2] &&
      position[blockArr[index][1][0] - 2][blockArr[index][1][1]]
    ) {
      blockArr[index][0][0] -= 2
      blockArr[index][0][1] -= 2
      blockArr[index][1][0] -= 2
      blockArr[index][blockArr[index].length - 1][0] = "L"
    }
  }
  // ------------------------S------------------------------------------
  if (blockArr[index][blockArr[index].length - 1][0] == "S") {
    if (
      position[blockArr[index][0][0]][blockArr[index][0][1] + 1] &&
      position[blockArr[index][3][0] - 2][blockArr[index][3][1] + 1]
    ) {
      blockArr[index][0][1] += 1
      blockArr[index][3][0] -= 2
      blockArr[index][3][1] += 1
      blockArr[index][blockArr[index].length - 1][0] = "S1"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "S1") {
    if (
      position[blockArr[index][0][0]][blockArr[index][0][1] - 1] &&
      position[blockArr[index][3][0] + 2][blockArr[index][3][1] - 1]
    ) {
      blockArr[index][0][1] -= 1
      blockArr[index][3][0] += 2
      blockArr[index][3][1] -= 1
      blockArr[index][blockArr[index].length - 1][0] = "S"
    }
  }
  // ------------------------I------------------------------------------------
  if (blockArr[index][blockArr[index].length - 1][0] == "I") {
    if (
      position[blockArr[index][0][0] - 3][blockArr[index][0][1] - 3] &&
      position[blockArr[index][1][0] - 2][blockArr[index][1][1] - 2] &&
      position[blockArr[index][2][0] - 1][blockArr[index][2][1] - 1]
    ) {
      blockArr[index][0][0] -= 3
      blockArr[index][0][1] -= 3
      blockArr[index][1][0] -= 2
      blockArr[index][1][1] -= 2
      blockArr[index][2][0] -= 1
      blockArr[index][2][1] -= 1
      for (var i = 0; i < blockArr[index].length - 1; i++) {
        blockArr[index][i][0] += 1
        blockArr[index][i][1] += 1
      }
      blockArr[index][blockArr[index].length - 1][0] = "I1"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "I1") {
    if (
      position[blockArr[index][0][0] + 3][blockArr[index][0][1] + 3] &&
      position[blockArr[index][1][0] + 2][blockArr[index][1][1] + 2] &&
      position[blockArr[index][2][0] + 1][blockArr[index][2][1] + 1]
    ) {
      blockArr[index][0][0] += 3
      blockArr[index][0][1] += 3
      blockArr[index][1][0] += 2
      blockArr[index][1][1] += 2
      blockArr[index][2][0] += 1
      blockArr[index][2][1] += 1
      for (var i = 0; i < blockArr[index].length - 1; i++) {
        blockArr[index][i][0] -= 1
        blockArr[index][i][1] -= 1
      }
      blockArr[index][blockArr[index].length - 1][0] = "I"
    }
  }

  // -----------------------J-------------------------------
  if (blockArr[index][blockArr[index].length - 1][0] == "J") {
    if (
      position[blockArr[index][0][0] + 2][blockArr[index][0][1] + 1] &&
      position[blockArr[index][1][0] + 2][blockArr[index][1][1] + 1]
    ) {
      blockArr[index][0][0] += 2
      blockArr[index][0][1] += 1
      blockArr[index][1][0] += 2
      blockArr[index][1][1] += 1
      blockArr[index][blockArr[index].length - 1][0] = "J1"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "J1") {
    if (
      position[blockArr[index][0][0] - 1][blockArr[index][0][1] - 1] &&
      position[blockArr[index][1][0] - 3][blockArr[index][1][1] - 1] &&
      position[blockArr[index][3][0] - 2][blockArr[index][3][1] + 2]
    ) {
      blockArr[index][0][0] -= 1
      blockArr[index][0][1] -= 1
      blockArr[index][1][0] -= 3
      blockArr[index][1][1] -= 1
      blockArr[index][3][0] -= 2
      blockArr[index][3][1] += 2
      blockArr[index][blockArr[index].length - 1][0] = "J2"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "J2") {
    if (
      position[blockArr[index][0][0] + 1][blockArr[index][0][1] + 1] &&
      position[blockArr[index][1][0] + 2][blockArr[index][1][1] - 1] &&
      position[blockArr[index][3][0] + 1][blockArr[index][3][1] - 2]
    ) {
      blockArr[index][0][0] += 1
      blockArr[index][0][1] += 1
      blockArr[index][1][0] += 2
      blockArr[index][1][1] -= 1
      blockArr[index][3][0] += 1
      blockArr[index][3][1] -= 2
      blockArr[index][blockArr[index].length - 1][0] = "J3"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "J3") {
    if (
      position[blockArr[index][0][0] - 2][blockArr[index][0][1] - 1] &&
      position[blockArr[index][1][0] - 1][blockArr[index][1][1] + 1] &&
      position[blockArr[index][3][0] + 1][blockArr[index][3][1]]
    ) {
      blockArr[index][0][0] -= 2
      blockArr[index][0][1] -= 1
      blockArr[index][1][0] -= 1
      blockArr[index][1][1] += 1
      blockArr[index][3][0] += 1
      blockArr[index][blockArr[index].length - 1][0] = "J"
    }
  }
  // ---------------------Z---------------------------------
  if (blockArr[index][blockArr[index].length - 1][0] == "Z") {
    if (
      position[blockArr[index][0][0] - 1][blockArr[index][0][1] + 2] &&
      position[blockArr[index][3][0] - 1][blockArr[index][3][1]]
    ) {
      blockArr[index][0][0] -= 1
      blockArr[index][0][1] += 2
      blockArr[index][3][0] -= 1
      blockArr[index][blockArr[index].length - 1][0] = "Z1"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "Z1") {
    if (
      position[blockArr[index][0][0] + 1][blockArr[index][0][1] - 2] &&
      position[blockArr[index][3][0] + 1][blockArr[index][3][1]]
    ) {
      blockArr[index][0][0] += 1
      blockArr[index][0][1] -= 2
      blockArr[index][3][0] += 1
      blockArr[index][blockArr[index].length - 1][0] = "Z"
    }
  }
  // ------------------T------------------------------------
  if (blockArr[index][blockArr[index].length - 1][0] == "T") {
    if (position[blockArr[index][2][0] - 1][blockArr[index][2][1] + 1]) {
      blockArr[index][2][0] -= 1
      blockArr[index][2][1] += 1
      blockArr[index][blockArr[index].length - 1][0] = "T1"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "T1") {
    if (position[blockArr[index][3][0] - 1][blockArr[index][3][1] - 1]) {
      blockArr[index][3][0] -= 1
      blockArr[index][3][1] -= 1
      blockArr[index][blockArr[index].length - 1][0] = "T2"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "T2") {
    if (position[blockArr[index][0][0] + 1][blockArr[index][0][1] - 1]) {
      blockArr[index][0][0] += 1
      blockArr[index][0][1] -= 1
      blockArr[index][blockArr[index].length - 1][0] = "T3"
    }
  } else if (blockArr[index][blockArr[index].length - 1][0] == "T3") {
    if (
      position[blockArr[index][0][0] - 1][blockArr[index][0][1] + 1] &&
      position[blockArr[index][2][0] + 1][blockArr[index][2][1] - 1] &&
      position[blockArr[index][0][0] + 1][blockArr[index][0][1] + 1]
    ) {
      blockArr[index][0][0] -= 1
      blockArr[index][0][1] += 1
      blockArr[index][2][0] += 1
      blockArr[index][2][1] -= 1
      blockArr[index][3][0] += 1
      blockArr[index][3][1] += 1
      blockArr[index][blockArr[index].length - 1][0] = "T"
    }
  }
}

// ----------------------------------------------------------------

/*键盘事件*/
var onLeft = true //左移开关
var onRight = true //右移开关
var onFall = true // 下移开关
document.onkeydown = function (event) {
  var a = event.keyCode
  if (a == 37) {
    //判断全左边是否占用
    for (var i = 0; i < blockArr[index].length - 1; i++) {
      if (!position[blockArr[index][i][0]][blockArr[index][i][1] - 1]) {
        onLeft = false //关闭左移
        // console.log(index+'到了左边')
      }
    }

    //全左移动
    if (onLeft) {
      for (var i = 0; i < blockArr[index].length - 1; i++) {
        blockArr[index][i][1] -= 1
        music("audio1")
      }
    }
  }

  if (a == 39) {
    //判断全右边是否占用
    for (var i = 0; i < blockArr[index].length - 1; i++) {
      if (!position[blockArr[index][i][0]][blockArr[index][i][1] + 1]) {
        // console.log(index+'到了右边')
        onRight = false //关闭左移
      }
    }

    //全右移动
    if (onRight) {
      for (var i = 0; i < blockArr[index].length - 1; i++) {
        blockArr[index][i][1] += 1
        music("audio1")
      }
    }
  }
  //向上形变
  if (a == 38) {
    rotates()
    music("audio1")
  }
  //向下下落

  if (a == 40) {
    //判断全下边是否占用
    for (var i = 0; i < blockArr[index].length - 1; i++) {
      if (!position[blockArr[index][i][0] + 2][blockArr[index][i][1]]) {
        onFall = false //关闭下移
      }
    }
    //全左移动
    if (onFall) {
      for (var i = 0; i < blockArr[index].length - 1; i++) {
        blockArr[index][i][0] += 1
        music("audio1")
      }
    }
  }
}

/*消除函数*/
var falseNum = 0
var clearRows = null //要清除的行
var clearBool = false
var clearBlock = function () {
  //得到哪一行已经被占满，并返回那一行交给clearBlocking()
  for (var i = -4; i < 20; i++) {
    for (var j = 0; j < 10; j++) {
      if (!position[i][j]) {
        falseNum++
      }
    }
    if (falseNum != 10) {
      falseNum = 0
    } else {
      clearRows = i
      clearBool = true
      falseNum = 0
      setScore() //计分
      return
    }
  }
}
/*获取到被占满的一行后进行清除行为*/
var clearBlocking = function () {
  if (clearBool) {
    var clearDiv = document.getElementsByClassName("box" + clearRows) //获取到要清除的span
    //实现清除
    for (var c = 0; c < 10; c++) {
      clearDiv[0].parentNode.removeChild(clearDiv[0]) //注意只要一直清除第一个就行了
    }
    position.splice(clearRows, 1) //把清除行的对应的数组也删掉
    var addPosition = [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]
    position.unshift(addPosition) //头部重新生成一个空的站位数组
    clearBool = false //关闭清除开关

    //实现清除行以上部分的下移
    var recover = document.getElementsByTagName("span")
    for (var m = 0; m < recover.length; m++) {
      var classes = recover[m].className //得到每span的class
      var classesIndex = classes.substring(3) / 1 //得到每span的class的索引
      //判断如果索引小于clearRows则下拉一个单位
      if (classesIndex < clearRows) {
        var Top = parseInt(recover[m].style.top) //得到每span的x方向值
        recover[m].style.top = Top + 20 + "px" //强行下拉一个单位

        var classes = recover[m].className //得到每span的class索引
        recover[m].className = "box" + (classes.substring(3) / 1 + 1) //将class的索引也加1
      }
    }
  }
}

/*判断游戏结束的函数*/
var ifGameOver = function () {
  for (var i = 0; i < 4; i++) {
    if (index < 1) {
      return
    }
    if (blockArr[index][i][0] < 0 && blockArr[index - 1][i][0] < 0) {
      music("audio3")
      music("audio2", "stop")
      return true
    }
  }
}
