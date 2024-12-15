text = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`

arrow = ['^', '>', 'v', '<']
dir = [
  [-1, 0], // 0 = up
  [0, +1], // 1 = right
  [+1, 0], // 2 = down
  [0, -1], // 3 = left
];


ogmap = text.split('\n\n')[0].split('\n').map(v=>v.split(''))
path = text.match(/[\^><v]/g)
ogmap2 = text.split("\n\n")[0]
  .replaceAll("#", "##")
  .replaceAll("O", "[]")
  .replaceAll(".", "..")
  .replaceAll("@", "@.")
  .split("\n")
  .map((v) => v.split(""));

pathlength = path.length
//part1()
pathlength = 0
part2()

//---------------------------------------------------------

function findrobot(map) {
  let a = []
  map.forEach((v, i) => {
    if (v.indexOf("@") > -1) {
      a.push(i, v.indexOf("@"));
    }
  });
  return a
}

function gps(m, item) {
  total = 0
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] != item) continue;
      total += y * 100 + x;
    }
  }
  return total
}

//---------------------------------------------------------

function part1() {
  let map = [];
  ogmap.forEach((v) => map.push(v.slice()));

 let robot = findrobot(map);

  for (let p = 0; p < path.length; p++) {
    d = dir[arrow.indexOf(path[p])];
    current = robot.slice();
    steps = 1;
    pushing = false;
    while (map[current[0]][current[1]] != "#") {
      newX = current[1] + d[1];
      newY = current[0] + d[0];

      if (map[newY][newX] == "." && steps == 1) {
        map[robot[0]][robot[1]] = ".";
        map[newY][newX] = "@";
        robot = [newY, newX];
        break;
      }

      if (map[newY][newX] == "O") {
        pushing = true;
      }

      if (map[newY][newX] == "." && pushing == true) {
        map[robot[0]][robot[1]] = ".";
        map[robot[0] + d[0]][robot[1] + d[1]] = "@";
        map[newY][newX] = "O";
        robot = [robot[0] + d[0], robot[1] + d[1]];
        break;
      }

      current = [newY, newX];
      steps++;
    }
  }

  p1 = gps(map, 'O')
  displayText("part 1: " + p1);
  map = map.map((v) => v.join(""));
  displayText(map);
}

//------------------------------------------------------

function part2(a) {
  manual = false
  map2 = []
  ogmap2.forEach((v) => map2.push(v.slice()));

  robot = findrobot(ogmap2);

  for (let p = 0; p < pathlength; p++) {
    part2check(path[p])
  }

  printmap2 = map2.map((v) => v.join(""));
  displayText(printmap2);

  if(a) {
    p2 = gps(map2, '[')
    displayText(`<span style="font-size:1.5rem">part 2: ${p2}`)
  }
}

//---------------------------------------------------------

function part2check(a) {
  arrw = arrow.indexOf(a)
  d = dir[arrw];
  current = robot.slice();
  steps = 1;
  pushing = false;
  yup = true

  while (yup) {
    newX = current[1] + d[1];
    newY = current[0] + d[0];
    row5()

    // see if next spot empty
    if (map2[newY][newX] == "." && steps == 1) {
      map2[robot[0]][robot[1]] = ".";
      map2[newY][newX] = "@";
      robot = [newY, newX];
      break;
    }

    // see if boxes
    if (/[\[\]]/.test(map2[newY][newX])) {
      pushing = true;
    }

    // pushing horizontally
    if (pushing == true && arrw % 2 == 1 && map2[newY][newX] == ".") {
      temp = map2[newY].join('')
      if (arrw == 3) {
        temp = temp.replace(/\.([\[\]]+)@/, '$1@.')
      }
      if (arrw == 1) {
        temp = temp.replace(/@([\[\]]+)\./, '.@$1')
      }
      map2[newY] = temp.split('')
      robot = [newY, robot[1] + d[1]]
      break
    }

    // pushing vertically
    if (pushing == true && arrw % 2 == 0) {
      checking = []
      checking.push([[robot[0], robot[1]]])

      canpush = true
      while (canpush) {
        let newestrow = checking.length-1
        let addrow  = checking.length
        tempnewrow = new Set()

        for (let i=0;i<checking[newestrow].length; i++) {
          coord = checking[newestrow][i]
          checkY = coord[0] + d[0]
          checkX = coord[1] + d[1]

          if (map2[checkY][checkX] == '#') {
            canpush = false
            break;
          }

          if (map2[checkY][checkX] == '[') {
            tempnewrow.add(`${checkY} ${checkX}`)
            tempnewrow.add(`${checkY} ${checkX + 1}`)
          } else if (map2[checkY][checkX] == ']') {
            tempnewrow.add(`${checkY} ${checkX - 1}`)
            tempnewrow.add(`${checkY} ${checkX}`)
          }
        }

        if (!canpush) {break}

        checking[addrow] = []

        tempnewrow.forEach(v=>checking[addrow].push(v.split(' ').map(a=>parseInt(a))))

        if (checking[addrow].length == 0) {
          checking.pop()
          for (let n=checking.length-1; n > -1; n--) {
            for (let m=0;m<checking[n].length;m++) {
              c = checking[n][m]
              map2[c[0] + d[0]][c[1] + d[1]] = map2[c[0]][c[1]]
              map2[c[0]][c[1]] = '.'
            }
          }

          robot = [newY, newX]
          break
        }
      }
      break
    }

    if (map2[newY][newX] == "#") {
      break
    }

    current = [newY, newX];
    steps++;
  }
}

//---------------------------------------------------------

function part3(a) {
  part2check(a)
  printmap2 = map2.map((v) => v.join(""));
  displayText(printmap2);
}

//---------------------------------------------------------

$(function () {

  autorunning = false;
  $(window).keydown(function(event){
    switch(event.which) {
      case 32:
        if (!autorunning) {
          autorunning = true
          autoruntext = $('<div>').addClass('autoruntext').text('autorunning...')
          $('.resultwrapper').append(autoruntext)
          autorun = setInterval(()=>{
            clearBoard()
            part3(path[pathlength])
            pathlength++
          }, 200)
        } else {
          autorunning = false
          autoruntext.remove()
          clearInterval(autorun)
        }
        break;
      case 13:
        newmsg = message.clone()
        $('.messagewrapper').append(newmsg)
        setTimeout(()=>{newmsg.remove()}, 3000)
        panel.animate({bottom: '0'}, 500)
        manual = true
        autorunning = false
        if ($('.autoruntext').length > 0) {autoruntext.remove()}
        clearInterval(autorun)
        break;
    }

    if (manual) {
      switch(event.which) {
        case 38: //up
          part3('^')
          fakepress('#up')
          break;
        case 37: //left
          part3('<')
          fakepress('#left')
          break;
        case 40: //down
          part3('v')
          fakepress('#down')
          break;
        case 39: //right
          part3('>')
          fakepress('#right')
          break;
      }

      if (event.which < 41 || event.which > 36) {
        clearBoard()
      }
    }
  })

  $("#result").css({
    "word-break": "normal",
    "line-height": "1.2em",
    "letter-spacing": "0em",
    "font-size": `calc(100vh / 20)`,
    "white-space": "pre",
    'overflow': 'visible'
  });

  $(".resultwrapper").css({
    "display": "flex",
    "align-items": "center",
    "justify-content": "center",
    "padding-bottom": "120px",
    "overflow": "hidden"
  });

  panel = $("<div>").addClass("panel");
  $("body").append(panel);
  $(".panel").append(`
  <button id="up">▲</button>
  <button id="left">◄</button>
  <button id="down">▼</button>
  <button id="right">►</button>`);

  panel.css("bottom", "-20%");

  message = $("<div>").addClass("message").text("> MANUAL OVERRIDE ENGAGED");

  $('body').append('<div class="messagewrapper"></div>')

  $('.panel button').click(function(){
    switch($(this).attr('id')) {
      case 'up':
        part3('^')
        break;
      case 'left':
        part3('<')
        break;
      case 'down':
        part3('v')
        break;
      case 'right':
        part3('>')
    }
    clearBoard()
  })
})

function fakepress(a) {
  $(a).addClass('click')
  setTimeout(()=>{$(a).removeClass('click')}, 100)
}

function row5() {
  if (manual) {
    if (newX > map2[newY].length - 1) {
      map2.forEach((v,i)=>{map2[i].push(' ')})
      if ($(window).width() < 1000) {
        $('.resultwrapper').css({'justify-content': 'right', 'padding-right': '50px'})
      }
    }
    Xlimit = 25
    if (newX == Xlimit) {
      map2.forEach((v,i)=>{map2[i][Xlimit + 1] = ' '})
      map2[map2.length - 1][Xlimit - 2] =  '🔥'
      map2[map2.length - 1][Xlimit - 1] =  '🔥'
      map2[map2.length - 1][Xlimit] =  '🔥'
      
      console.log(newY + ' ' + newX)
      fire = setInterval(doFire, 200)

    }
    if (newY == 5) {
      if (arrw  == 1 && map2[newY][newX] == '#' && steps == 1) {
      map2[robot[0]][robot[1]] = ".";
      map2[newY][newX] = '@'
      robot = [newY, newX];
      yup = false
      }
      if (pushing == true && arrw == 1 && /[ #]/.test(map2[newY][newX])) {
        temp = map2[newY].join('')
        temp = temp.replace(/@([\[\]]+)[ #]/, ' @$1')
        map2[newY] = temp.split('')
        robot = [newY, robot[1] + d[1]]
        yup = false
      }
    }
  }
  if (map2[newY][newX] == " " && steps == 1) {
    map2[robot[0]][robot[1]] = " ";
    map2[newY][newX] = "@";
    robot = [newY, newX];
    yup = false;
  }
}

function doFire() {
  if (map2[newY][newX] == ']') {
    newnewY = newY - 1
    map2[newY][newX] = ' '
    map2[newY][newX - 1] = ' '
    if (newnewY > -1) {      
    newY = newnewY
    map2[newY][newX] = ']'
    map2[newY][newX - 1] = '['
    } else {
      clearInterval(fire)
      boxwin = $('<div>').addClass('youwin').text('🎉 WOW I DIDNT THINK THAT WOULD HAPPEN 🎉')
      $('body').append(boxwin)
    }
  }
  if (map2[newY][newX] == '@') {
    manual = false
    newnewY = newY + 1
    map2[newY][newX] = ' '
    if (newnewY < map2.length - 1) {
      newY = newnewY
      console.log(newY)
      map2[newY][newX] = '@'
    } else {
      clearInterval(fire)
      youwin = $('<div>').addClass('youwin').text('🎉🎉 YOU WIN!! 🎉🎉')
      $('body').append(youwin)
    }
  }
  clearBoard()
  printmap2 = map2.map((v) => v.join(""));
  displayText(printmap2);
}