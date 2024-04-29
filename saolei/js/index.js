window.onload = function () {
  creaTab(16, 16)
  tabCell()
}
var times = 0 //计时器
var prInfo = [] //原始信息
for (var i = 0; i < 40; i++) {
  prInfo[i] = [false, null] //null用来存放翻开信息
}
for (var i = 40; i < 256; i++) {
  prInfo[i] = [true, null]
}
//打乱数组
prInfo.sort(function () {
  return Math.random() - 0.5
})

var info = [] //存放每个单元格的信息
//把四十个雷放进数组
var num = 0
for (var i = 0; i < 16; i++) {
  info[i] = []
  for (var j = 0; j < 16; j++) {
    info[i][j] = []
    info[i][j][0] = prInfo[num][0]
    info[i][j][1] = prInfo[num][1] //1→已经被翻开，null→未被翻开 2→标记状态
    num++
  }
}
console.log(info)
/*初始化数组里的信息*/
//0,1,2,....代表周边雷的个数
//false表示雷
var Xnum = 0
if (info[0][1][0] === false) {
  Xnum++
}
if (info[1][0][0] === false) {
  Xnum++
}
if (info[1][1][0] === false) {
  Xnum++
}
info[0][0][0] = Xnum //更改信息数组里的信息

//右上角
var Xnum = 0
if (info[0][14][0] === false) {
  Xnum++
}
if (info[1][15][0] === false) {
  Xnum++
}
if (info[1][14][0] === false) {
  Xnum++
}
info[0][15][0] = Xnum

//左下角
var Xnum = 0
if (info[14][0][0] === false) {
  Xnum++
}
if (info[14][1][0] === false) {
  Xnum++
}
if (info[15][0][0] === false) {
  Xnum++
}
info[15][0][0] = Xnum

//右下角
var Xnum = 0
if (info[14][14][0] === false) {
  Xnum++
}
if (info[15][14][0] === false) {
  Xnum++
}
if (info[14][15][0] === false) {
  Xnum++
}
info[15][15][0] = Xnum

//左边
var Xnum = 0
for (var x = 1; x < 15; x++) {
  if (info[x][0][0] !== false) {
    if (info[x - 1][0][0] === false) {
      Xnum++
    }
    if (info[x - 1][1][0] === false) {
      Xnum++
    }
    if (info[x][1][0] === false) {
      Xnum++
    }
    if (info[x + 1][0][0] === false) {
      Xnum++
    }
    if (info[x + 1][1][0] === false) {
      Xnum++
    }
    info[x][0][0] = Xnum
    Xnum = 0
  }
}

//右边
var Xnum = 0
for (var x = 1; x < 15; x++) {
  if (info[x][15][0] !== false) {
    if (info[x - 1][14][0] === false) {
      Xnum++
    }
    if (info[x - 1][15][0] === false) {
      Xnum++
    }
    if (info[x][14][0] === false) {
      Xnum++
    }
    if (info[x + 1][14][0] === false) {
      Xnum++
    }
    if (info[x + 1][15][0] === false) {
      Xnum++
    }
    info[x][15][0] = Xnum
    Xnum = 0
  }
}

//上边
var Xnum = 0
for (var y = 1; y < 15; y++) {
  if (info[0][y][0] !== false) {
    if (info[0][y - 1][0] === false) {
      Xnum++
    }
    if (info[0][y + 1][0] === false) {
      Xnum++
    }
    if (info[1][y - 1][0] === false) {
      Xnum++
    }
    if (info[1][y][0] === false) {
      Xnum++
    }
    if (info[1][y + 1][0] === false) {
      Xnum++
    }
    info[0][y][0] = Xnum
    Xnum = 0
  }
}

//下边
var Xnum = 0
for (var y = 1; y < 15; y++) {
  if (info[15][y][0] !== false) {
    if (info[14][y - 1][0] === false) {
      Xnum++
    }
    if (info[14][y][0] === false) {
      Xnum++
    }
    if (info[14][y + 1][0] === false) {
      Xnum++
    }
    if (info[15][y - 1][0] === false) {
      Xnum++
    }
    if (info[15][y + 1][0] === false) {
      Xnum++
    }
    info[15][y][0] = Xnum
    Xnum = 0
  }
}

//中间
var Xnum = 0
for (var x = 1; x < 15; x++) {
  for (var y = 1; y < 15; y++) {
    if (info[x][y][0] !== false) {
      if (info[x - 1][y - 1][0] === false) {
        Xnum++
      }
      if (info[x - 1][y][0] === false) {
        Xnum++
      }
      if (info[x - 1][y + 1][0] === false) {
        Xnum++
      }
      if (info[x][y - 1][0] === false) {
        Xnum++
      }
      if (info[x][y + 1][0] === false) {
        Xnum++
      }
      if (info[x + 1][y - 1][0] === false) {
        Xnum++
      }
      if (info[x + 1][y][0] === false) {
        Xnum++
      }
      if (info[x + 1][y + 1][0] === false) {
        Xnum++
      }
      info[x][y][0] = Xnum
      Xnum = 0
    }
  }
}

/*开始按钮*/

var star = document.getElementById("begin")
var timeNum = document.getElementById("time")
var starBool = true
star.onclick = function () {
  if (starBool) {
    setTimes()
    starBool = false
  } else {
    location.reload()
  }
}
//计时器
var secd = 0
function setTimes() {
  timeNum.innerText = secd
  secd++
  times = setTimeout(setTimes, 1000)
}

/*绘制表格*/
function creaTab(rows, cells) {
  var div = document.getElementById("contain")
  var tab = "<table border=0 cellspacing=1 cellpadding=3>"
  for (var i = 0; i < rows; i++) {
    tab += "<tr>"
    for (var j = 0; j < cells; j++) {
      if (i < 10) {
        i = "0" + i
      }
      if (j < 10) {
        j = "0" + j
      }
      tab += "<td id=" + "box" + i + j + ">"
      tab += '<img src="img/雷.png">'
      tab += '<img src="img/标记.png">'
      tab += "</td>"
      i /= 1
      j /= 1
    }
    tab += "</tr>"
  }
  tab += "</table>"
  div.innerHTML = tab
}

/*
document.oncontextmenu = function(){
	alert(1);
	console.log(this);
	return false;
}
*/

/*给每个单元格添加点击事件*/
function tabCell() {
  var tab = document.getElementsByTagName("table")
  var rows = tab[0].rows
  var rowslen = rows.length
  for (var i = 0; i < rowslen; i++) {
    var cells = rows[i].cells
    for (var j = 0; j < cells.length; j++) {
      cells[j].oncontextmenu = function () {
        if (starBool) {
          return
        }
        tips(this.id) //中击标记
        return false
      }
      cells[j].onclick = function (e) {
        if (starBool) {
          return
        }
        //点击样式的判断
        if (e.button == 0) {
          //左击关闭菜单
          show(this.id) //id穿给show函数
          // alert(checkThuderNum())
          if (checkTurnNum() === 216) {
            alert("你赢了")
            clearTimeout(times) //关闭定时器
            star.innerText = "王者归来"
          }
        } else if (e.button == 2) {
          /*alert(1);
					return;		//右击无效*/
        } else if (e.button == 1) {
          /*tips(this.id);//中击标记*/
        } else {
          return // 其他
        }
        //做标记雷的重写
        yet.innerText = 40 - checkThuderNum()
      }
    }
  }
}

/*中击事件*/
function tips(obj) {
  var id = obj
  //获取到它的坐标了
  var x = obj.substr(3, 2) / 1
  var y = obj.substr(5, 2) / 1
  var td = document.getElementById(id) //获取这个单元格
  if (info[x][y][1] === null) {
    td.childNodes[1].style.display = "block"
    info[x][y][1] = 2 //展示为标记状态
  } else if (info[x][y][1] === 2) {
    td.childNodes[1].style.display = "none"
    info[x][y][1] = null //取消标记状态
  }
}

//检测标记雷数量的封装函数
function checkThuderNum() {
  var checkThuderNum = 0 //翻面的个数
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      if (info[i][j][1] === 2) {
        //2→已经标记
        checkThuderNum++
      }
    }
  }
  return checkThuderNum
}

//具体颜色样式的封装函数
function colorStyle(td, i, j) {
  if (info[i][j][0] === 0) {
    td.innerHTML = ""
  } else if (info[i][j][0] === 1) {
    td.innerHTML = info[i][j][0]
    td.style.color = "blue"
  } else if (info[i][j][0] === 2) {
    td.innerHTML = info[i][j][0]
    td.style.color = "green"
  } else if (info[i][j][0] >= 3) {
    td.innerHTML = info[i][j][0]
    td.style.color = "red"
  }
  td.style.background = "#FFFFFF"
}

//检测反面的次数的封装函数
function checkTurnNum() {
  var checknum = 0 //翻面的个数
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      if (info[i][j][1] === 1) {
        //1→已经被翻开，null→未被翻开
        checknum++
      }
    }
  }
  return checknum
}

/*胜败判断*/
var winBool = false
function ifWin() {
  if (winBool) {
    alert("你赢了")
  }
}

/*点击的具体事件*/
function show(obj) {
  var id = obj
  //获取到它的坐标了
  var x = obj.substr(3, 2) / 1
  var y = obj.substr(5, 2) / 1
  var td = document.getElementById(id) //获取这个单元格
  //如果点击的是false→雷
  if (info[x][y][0] === false) {
    clearTimeout(times) //关闭定时器
    star.innerText = "惜败再来" //
    for (var i = 0; i < 16; i++) {
      for (var j = 0; j < 16; j++) {
        if (i < 10) {
          i = "0" + i
        }
        if (j < 10) {
          j = "0" + j
        }
        var tdAll = document.getElementById("box" + i + "" + j)
        i /= 1
        j /= 1
        if (info[i][j][0] === false) {
          tdAll.childNodes[1].style.display = "none"
          tdAll.childNodes[0].style.display = "block"
          tdAll.style.background = "#FFFFFF"
        } else {
          td.childNodes[1].style.display = "none"
          colorStyle(tdAll, i, j)
        }
      }
    }
  }
  //如果点击的是除了false和0的数显示当前
  else if (info[x][y][0] !== 0) {
    //
    //显示当前
    if (info[x][y][1] === null) {
      colorStyle(td, x, y)
      info[x][y][1] = 1 //展示为翻开状态
    }
    console.log(info)
  }
  //如果点击的是0
  //以下是半自动翻面的判断
  //全自动的未能模拟出来
  else if (info[x][y][0] === 0) {
    // alert('0')
    if (info[x][y][1] === null) {
      var xDown = x //向下爬虫
      while (xDown >= 0 && xDown <= 15 && info[xDown][y][0] !== false) {
        if (xDown < 10) {
          xDown = "0" + xDown
        }
        if (y < 10) {
          y = "0" + y
        }
        var tdAll = document.getElementById("box" + xDown + "" + y)
        xDown /= 1
        y /= 1
        if (info[xDown][y][0] === 0) {
          tdAll.innerHTML = ""
        } else {
          colorStyle(tdAll, xDown, y)
        }
        tdAll.style.background = "#FFFFFF"
        info[xDown][y][1] = 1 //展示为翻开状态

        var yRight = y //向右爬虫
        while (
          yRight >= 0 &&
          yRight <= 15 &&
          info[xDown][yRight][0] !== false
        ) {
          if (xDown < 10) {
            xDown = "0" + xDown
          }
          if (yRight < 10) {
            yRight = "0" + yRight
          }
          var tdAll = document.getElementById("box" + xDown + "" + yRight)
          xDown /= 1
          yRight /= 1
          if (info[xDown][yRight][0] === 0) {
            tdAll.innerHTML = ""
          } else {
            colorStyle(tdAll, xDown, yRight)
            // tdAll.innerHTML=info[xDown][yRight][0];
          }
          tdAll.style.background = "#FFFFFF"
          info[xDown][yRight][1] = 1 //展示为翻开状态
          if (info[xDown][yRight][0] === 0) {
            yRight++
          } else {
            break
          }
        }
        var yLeft = y //向左爬虫
        while (yLeft >= 0 && yLeft <= 15 && info[xDown][yLeft][0] !== false) {
          if (xDown < 10) {
            xDown = "0" + xDown
          }
          if (yLeft < 10) {
            yLeft = "0" + yLeft
          }
          var tdAll = document.getElementById("box" + xDown + "" + yLeft)
          xDown /= 1
          yLeft /= 1
          if (info[xDown][yLeft][0] === 0) {
            tdAll.innerHTML = ""
          } else {
            colorStyle(tdAll, xDown, yLeft)
            // tdAll.innerHTML=info[xDown][yLeft][0];
          }
          tdAll.style.background = "#FFFFFF"
          info[xDown][yLeft][1] = 1 //展示为翻开状态
          if (info[xDown][yLeft][0] === 0) {
            yLeft--
          } else {
            break
          }
        }
        if (info[xDown][y][0] === 0) {
          xDown++
        } else {
          break
        }
      }

      var xUp = x //向上爬虫
      while (xUp >= 0 && xUp <= 15 && info[xUp][y][0] !== false) {
        if (xUp < 10) {
          xUp = "0" + xUp
        }
        if (y < 10) {
          y = "0" + y
        }
        var tdAll = document.getElementById("box" + xUp + "" + y)
        xUp /= 1
        y /= 1
        if (info[xUp][y][0] === 0) {
          tdAll.innerHTML = ""
        } else {
          colorStyle(tdAll, xUp, y)
          // tdAll.innerHTML=info[xUp][y][0];
        }
        tdAll.style.background = "#FFFFFF"
        info[xUp][y][1] = 1 //展示为翻开状态

        var yRight = y //向右爬虫
        while (yRight >= 0 && yRight <= 15 && info[xUp][yRight][0] !== false) {
          if (xUp < 10) {
            xUp = "0" + xUp
          }
          if (yRight < 10) {
            yRight = "0" + yRight
          }
          var tdAll = document.getElementById("box" + xUp + "" + yRight)
          xUp /= 1
          yRight /= 1
          if (info[xUp][yRight][0] === 0) {
            tdAll.innerHTML = ""
          } else {
            // tdAll.innerHTML=info[xUp][yRight][0];
            colorStyle(tdAll, xUp, yRight)
          }
          tdAll.style.background = "#FFFFFF"
          info[xUp][yRight][1] = 1 //展示为翻开状态
          if (info[xUp][yRight][0] === 0) {
            yRight++
          } else {
            break
          }
        }
        var yLeft = y //向左爬虫
        while (yLeft >= 0 && yLeft <= 15 && info[xUp][yLeft][0] !== false) {
          if (xUp < 10) {
            xUp = "0" + xUp
          }
          if (yLeft < 10) {
            yLeft = "0" + yLeft
          }
          var tdAll = document.getElementById("box" + xUp + "" + yLeft)
          xUp /= 1
          yLeft /= 1
          if (info[xUp][yLeft][0] === 0) {
            tdAll.innerHTML = ""
          } else {
            // tdAll.innerHTML=info[xUp][yLeft][0];
            colorStyle(tdAll, xUp, yLeft)
          }
          tdAll.style.background = "#FFFFFF"
          info[xUp][yLeft][1] = 1 //展示为翻开状态
          if (info[xUp][yLeft][0] === 0) {
            yLeft--
          } else {
            break
          }
        }
        if (info[xUp][y][0] === 0) {
          xUp--
        } else {
          break
        }
      }
    }
  }
}
