var width = 600 //场景的宽
var height = 600 //场景的高
var step = 25 //单位格的长宽
var x = null //食物的位置；
var y = null //食物的位置
var times = null //定时器；
var grade = 300 //定时器速度；
var deg = 1 //关卡数；
var scores = 0 //积分；
var musicContrl = true //音乐交换开关
var start = false //开始开关
/*初始化加载*/
window.onload = function () {
  stage(600, 600, "yellowgreen")
  food()
  drawSnake()
  myWined("任意键开始游戏")
  sumScores() //计分框初始化
}

/*加载画布*/
var grass = document.getElementById("grass")
var context = grass.getContext("2d")
var f = document.getElementById("f")
var stage = function (width, height, color) {
  grass.width = width
  grass.height = height
  grass.style.background = color
}

grass.onclick = function () {
  //点击开始游戏
  if (start == false) {
    f.innerText = scores
    myWined("任意键开始游戏", "", true)
    myWined("第" + deg + "关", deg - 1)
    times = setInterval(moveSnake, grade)
    music("audio2")
    start = true //关闭开始开关
  }
  //若游戏结束，点击重新加载
  if (crossBorder()) {
    location.reload()
  }
}

/*音效函数*/
var music = function (id, stop) {
  var audios = document.getElementById(id)
  audios.play()
  if (stop) {
    audios.pause()
  }
}

/*加载食物*/
var food = function () {
  x = foodPosition().x
  y = foodPosition().y
  //如果食物出现在蛇身上重新生成食物
  if (ifShowOnSnake()) {
    food()
  }
  var imgFood = new Image()
  imgFood.src = "img/food.png"
  imgFood.onload = function () {
    context.drawImage(imgFood, x * step, y * step, step, step)
  }
}

/*食物产生的随机函数*/
var foodPosition = function () {
  var x_max = width / step
  var y_max = height / step
  var x = Math.floor(Math.random() * x_max)
  var y = Math.floor(Math.random() * y_max)
  return {
    x: x,
    y: y,
  }
}

/*蛇吃食物的判断*/
var ifEatFood = function () {
  if (snakeArr[len - 1][0] == x && snakeArr[len - 1][1] == y) {
    return true
  } else {
    return false
  }
}

/*判断食物是否出现在蛇身上*/
var ifShowOnSnake = function () {
  for (var i = 0; i < len - 1; i++) {
    if (x == snakeArr[i][0] && y == snakeArr[i][1]) {
      return true
    }
  }
}

/*画蛇*/
//不同方向的蛇头信息
var hr_img = new Image()
hr_img.src = "img/header_right.png"
var hl_img = new Image()
hl_img.src = "img/header_left.png"
var hu_img = new Image()
hu_img.src = "img/header_up.png"
var hd_img = new Image()
hd_img.src = "img/header_down.png"
var by_img = new Image()
by_img.src = "img/body.png"
var snakeArr = [
  [0, 0, by_img],
  [1, 0, by_img],
  [2, 0, hr_img],
] //蛇的初始化数组
var len = snakeArr.length
var drawSnake = function () {
  for (var i = 0; i < len; i++) {
    context.drawImage(
      snakeArr[i][2],
      snakeArr[i][0] * step,
      snakeArr[i][1] * step,
      step,
      step
    )
  }
  context.clearRect(clear_x * step, clear_y * step, step, step) //擦除蛇尾
}

/*移动蛇*/
var clear_x, clear_y //擦除尾部的位置记录
var moveSnake = function () {
  //监控是否结束
  if (crossBorder()) {
    clearInterval(times)
    music("audio4") //结束音效
    music("audio2", true)
    music("audio3", true)
    return
  }
  //监控是否吃到食物
  if (ifEatFood()) {
    music("audio1") //吃食物音效
    food() //重新生成食物
    addSnake() //增加蛇长
    scores++
    f.innerText = scores
    if (scores % 2 == 0) {
      //每隔十分音乐交换一次
      deg++
      myWined("第" + deg + "关", deg - 1)
      music("audio2", musicContrl)
      music("audio3", !musicContrl)
      musicContrl = !musicContrl
      clearInterval(times)
      grade *= 0.7 //加速
      scores = 0 //计分重置
      f.innerText = scores //计分重置
      times = setInterval(moveSnake, grade)
    }
  }

  ;(clear_x = snakeArr[0][0]), (clear_y = snakeArr[0][1]) //擦除尾部的位置记录
  //蛇身体前进一步
  for (var j = 0; j < len - 1; j++) {
    snakeArr[j][0] = snakeArr[j + 1][0]
    snakeArr[j][1] = snakeArr[j + 1][1]
  }
  //蛇头按条件前进一步
  if (direction == "right") {
    snakeArr[len - 1][0] += 1
    snakeArr[len - 1][2] = hr_img
  } else if (direction == "left") {
    snakeArr[len - 1][0] -= 1
    snakeArr[len - 1][2] = hl_img
  } else if (direction == "up") {
    snakeArr[len - 1][1] -= 1
    snakeArr[len - 1][2] = hu_img
  } else if ((direction = "down")) {
    snakeArr[len - 1][1] += 1
    snakeArr[len - 1][2] = hd_img
  }
  //重新绘制蛇
  drawSnake()
}

/*蛇长度加一节*/
var addSnake = function () {
  var last_x = snakeArr[0][0],
    last_y = snakeArr[0][1]
  var addNew = [last_x, last_x, by_img]
  snakeArr.unshift(addNew)
  drawSnake()
  len++
}

/*给body添加键盘事件*/
var direction = "right"
document.body.onkeydown = function (event) {
  if (event.keyCode == 38) {
    if (direction == "down") {
      return
    }
    direction = "up"
  }
  if (event.keyCode == 40) {
    if (direction == "up") {
      return
    }
    direction = "down"
  }
  if (event.keyCode == 37) {
    if (direction == "right") {
      return
    }
    direction = "left"
  }
  if (event.keyCode == 39) {
    if (direction == "left") {
      return
    }
    direction = "right"
  }
  //也可以点击任意键开始
  if (start == false) {
    f.innerText = scores
    times = setInterval(moveSnake, grade)
    music("audio2")
    myWined("任意键开始游戏", "", true)
    myWined("第" + deg + "关", deg - 1)
    start = true //关闭开始开关
  }
}

/*是否结束判断*/
var crossBorder = function () {
  // 判断是否出界
  if (
    snakeArr[len - 1][0] < 0 ||
    snakeArr[len - 1][0] > 23 ||
    snakeArr[len - 1][1] < 0 ||
    snakeArr[len - 1][1] > 23
  ) {
    return true
  } else {
    //判断是否吃到自己
    for (var i = 0; i < len - 1; i++) {
      if (
        snakeArr[len - 1][0] == snakeArr[i][0] &&
        snakeArr[len - 1][1] == snakeArr[i][1]
      ) {
        return true
      }
    }
  }
}

/*胜利显示*/
var myWined = function (txt, i, clearSelf) {
  context.beginPath()
  var color = ["red", "orange", "yellow", "blue", "green", "#B933F4", "#53BEFC"]
  if (!color[i]) {
    color[i] = "#53BEFC"
  }
  if (clearSelf) {
    //自清除功能
    context.fillStyle = "yellowgreen"
  } else {
    context.fillStyle = color[i]
  }
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.font = "80px 微软雅黑"
  context.fillText(txt, 300, 300)
  context.closePath()
}

/*计分框的定位*/
var sumScores = function () {
  var m = grass.getBoundingClientRect().left
  var n = grass.getBoundingClientRect().top
  var fenshu = document.getElementById("fenshu")
  fenshu.style.left = m * 1 + width * 1 - 120 + "px"
  fenshu.style.top = n * 1 + 10 + "px"
  setTimeout(sumScores, 10)
}
