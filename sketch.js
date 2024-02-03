var myFont;
const targetLen = 40;
// 旋轉的角度
var d_rx = 0;
var d_ry = 0;
var d_rz = 0;
// 每個方塊
var cubes = [];

// 隨機清單
var shuffle_list = [];
var shuffle_list_idx = 0;

// 用來紀錄轉換的過程
var trans_ori_seq = ""; //原來的狀態
var trans_axis = ""; // 旋轉的方式
var trans_table = {}; // 記錄所有轉換的狀態
var trans_table_bakeup = {};

var is_save = false;

// 紀錄完成的狀態，同一面的位置
var complete_arr ;

// 按鍵時間
var press_fc = 0;

// 警告訊息
var warning_info = '' ;

class Cube {
  constructor(cx, cy, cz, sz) {
    this.faces = [];
    this.colors = [];

    let len = sz / 2;
    this.cube_length = sz;
    // UP
    this.faces[0] = [];
    this.colors[0] = [200, 0, 0];
    this.faces[0].push([cx - len, cy + len, cz - len]);
    this.faces[0].push([cx + len, cy + len, cz - len]);
    this.faces[0].push([cx + len, cy + len, cz + len]);
    this.faces[0].push([cx - len, cy + len, cz + len]);
    this.faces[0].push([cx - len, cy + len, cz - len]);

    // L

    this.faces[1] = [];
    this.colors[1] = [0, 200, 0];
    this.faces[1].push([cx - len, cy - len, cz - len]);
    this.faces[1].push([cx - len, cy - len, cz + len]);
    this.faces[1].push([cx - len, cy + len, cz + len]);
    this.faces[1].push([cx - len, cy + len, cz - len]);
    this.faces[1].push([cx - len, cy - len, cz - len]);
    // F

    this.faces[2] = [];
    this.colors[2] = [0, 0, 200];
    this.faces[2].push([cx - len, cy - len, cz + len]);
    this.faces[2].push([cx - len, cy + len, cz + len]);
    this.faces[2].push([cx + len, cy + len, cz + len]);
    this.faces[2].push([cx + len, cy - len, cz + len]);
    this.faces[2].push([cx - len, cy - len, cz + len]);
    // R

    this.faces[3] = [];
    this.colors[3] = [200, 200, 0];
    this.faces[3].push([cx + len, cy - len, cz + len]);
    this.faces[3].push([cx + len, cy + len, cz + len]);
    this.faces[3].push([cx + len, cy + len, cz - len]);
    this.faces[3].push([cx + len, cy - len, cz - len]);
    this.faces[3].push([cx + len, cy - len, cz + len]);
    // B

    this.faces[4] = [];
    this.colors[4] = [200, 0, 200];
    this.faces[4].push([cx + len, cy - len, cz - len]);
    this.faces[4].push([cx + len, cy + len, cz - len]);
    this.faces[4].push([cx - len, cy + len, cz - len]);
    this.faces[4].push([cx - len, cy - len, cz - len]);
    this.faces[4].push([cx + len, cy - len, cz - len]);
    // D

    this.faces[5] = [];
    this.colors[5] = [0, 200, 200];
    this.faces[5].push([cx - len, cy - len, cz - len]);
    this.faces[5].push([cx - len, cy - len, cz + len]);
    this.faces[5].push([cx + len, cy - len, cz + len]);
    this.faces[5].push([cx + len, cy - len, cz - len]);
    this.faces[5].push([cx - len, cy - len, cz - len]);

    this.cal_center();
  }
  cal_center() {
    var n = 0;
    var ax = 0;
    var ay = 0;
    var az = 0;
    for (var face of this.faces) {
      //for (var vx of face) {
      for (var i = 0; i < 4; i++) {
        var vx = face[i];
        ax += vx[0];
        ay += vx[1];
        az += vx[2];
        n++;
      }
    }
    this.cx = ax / n;
    this.cy = ay / n;
    this.cz = az / n;
  }

  show() {
    let i = 0;
    for (var face of this.faces) {
      beginShape();
      let c = this.colors[i];
      // 內側面給灰色
      if (this.inside_face(face)) {
        c = [100, 100, 100]; // 灰色
      }
      fill(c[0], c[1], c[2]);
      for (var vx of face) {
        vertex(vx[0], vx[1], vx[2]);
      }
      endShape();
      i++;
    }
  }

  round_all_vertex() {
    for (var face of this.faces) {
      for (var vx of face) {
        // update vertex
        for (let i = 0; i < 3; i++) {
          vx[i] = round(vx[i]);
        }
      }
    }
  }

  update(rx, ry, rz) {
    // print( this.faces[0]) ;

    let check_fit = true;
    for (var face of this.faces) {
      for (var vx of face) {
        //vertex(vx[0], vx[1], vx[2]);
        var after_loc = this.cal_location(
          [vx[0], vx[1], vx[2], 1],
          0,
          0,
          0,
          rx,
          ry,
          rz
        );

        // update vertex
        for (let i = 0; i < 3; i++) {
          vx[i] = after_loc[i];
          let v = abs(round(vx[i]));
          if (v != 0 && v != targetLen) {
            check_fit = false;
          }
        }
      }
    }
    // print( this.faces[0]) ;
    // print("==================");
    if (check_fit) {
      this.round_all_vertex();
    }
    this.cal_center();
    return check_fit;
  }

  color_code(c_array) {
    if (c_array[0] == 200) {
      if (c_array[1] == 0) {
        if (c_array[2] == 0) {
          return "R";
        }
      }
    }
    if (c_array[0] == 0) {
      if (c_array[1] == 200) {
        if (c_array[2] == 0) {
          return "G";
        }
      }
    }
    if (c_array[0] == 0) {
      if (c_array[1] == 0) {
        if (c_array[2] == 200) {
          return "B";
        }
      }
    }
    if (c_array[0] == 200) {
      if (c_array[1] == 200) {
        if (c_array[2] == 0) {
          return "Y";
        }
      }
    }
    if (c_array[0] == 200) {
      if (c_array[1] == 0) {
        if (c_array[2] == 200) {
          return "P";
        }
      }
    }
    if (c_array[0] == 0) {
      if (c_array[1] == 200) {
        if (c_array[2] == 200) {
          return "S"; // Sky blue
        }
      }
    }
    return "";
  }

  outside_face_color_seg() {
    // x:+- >>> y:+- --> z:+-
    var xp = ""; //x+
    var xn = ""; //x-
    var yp = ""; //y+
    var yn = ""; //y-
    var zp = ""; //z+
    var zn = ""; //z-

    for (var i = 0; i < this.faces.length; i++) {
      if (this.inside_face(this.faces[i])) {
        continue;
      }
      //print(this.faces[i]) ;
      var ss = this.sum_all_vertex(this.faces[i]);
      //print( "---"+ss+"  "+this.cube_length) ;
      var maxv = this.cube_length * 5; // 5 vertex
      var tag = this.color_code(this.colors[i]);
      if (ss[0] == maxv) {
        xp = tag;
      }
      if (ss[0] == -maxv) {
        xn = tag;
      }
      if (ss[1] == maxv) {
        yp = tag;
      }
      if (ss[1] == -maxv) {
        yn = tag;
      }
      if (ss[2] == maxv) {
        zp = tag;
      }
      if (ss[2] == -maxv) {
        zn = tag;
      }
    }

    return xp + xn + yp + yn + zp + zn;
  }

  sum_all_vertex(face_vertex) {
    //print(">>>>"+face_vertex)
    var sum = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      sum[i] =
        face_vertex[0][i] +
        face_vertex[1][i] +
        face_vertex[2][i] +
        face_vertex[3][i] +
        face_vertex[4][i];
    }
    return sum;
  }

  inside_face(face_vertex) {
    for (
      let i = 0;
      i < 3;
      i++ // 3 個軸
    )
      if (face_vertex[0][i] == 0)
        if (face_vertex[1][i] == 0)
          if (face_vertex[2][i] == 0)
            if (face_vertex[3][i] == 0) if (face_vertex[4][i] == 0) return true;
    return false;
  }

  matrix_dot(vec, mat) {
    let result = [];
    for (let i = 0; i < mat.length; i++) {
      let s = 0;
      for (let j = 0; j < mat[i].length; j++) {
        s = s + vec[j] * mat[i][j];
      }
      s = round(s, 2);
      result.push(s);
    }
    return result;
  }

  cal_location(ori_pos, tx, ty, tz, rx, ry, rz) {
    var tm = [
      [1, 0, 0, tx],
      [0, 1, 0, ty],
      [0, 0, 1, tz],
      [0, 0, 0, 1],
    ];
    var mrz = [
      [cos(rz), -sin(rz), 0, 0],
      [sin(rz), cos(rz), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    var mrx = [
      [1, 0, 0, 0],
      [0, cos(rx), -sin(rx), 0],
      [0, sin(rx), cos(rx), 0],
      [0, 0, 0, 1],
    ];
    var mry = [
      [cos(ry), 0, sin(ry), 0],
      [0, 1, 0, 0],
      [-sin(ry), 0, cos(ry), 0],
      [0, 0, 0, 1],
    ];
    var r1 = this.matrix_dot(ori_pos, tm);
    // print(r1);
    r1 = this.matrix_dot(r1, mrz);
    // print(r1);
    r1 = this.matrix_dot(r1, mrx);
    // print(r1);
    r1 = this.matrix_dot(r1, mry);
    // print(r1);
    return [r1[0], r1[1], r1[2]];
  }
}

function create_perfect_shuffle( len ){
  var l1 = [] ;
  var l2 = [] ;
  let a = ["x+", "y+", "z+","x-", "y-", "z-"];
  for (let i = 0; i < len; i++) {
    let r = int(random(6));
    let r2 = (r+3)%6 ;
    l1.push(r);
    l2.push(r2);
  }

  var r = [];
  for(let i=0 ; i<l1.length ; i++){
    r.push( a[l1[i]]) ;
  }
  for(let i=l2.length-1 ; i>=0 ; i--){
    r.push( a[l2[i]]) ;
  }
  // console.log( l1 ) ;
  // console.log( l2 ) ;

  return r ;

}

function create_shuffle_list() {
  
//   for( let i=0  ; i<10 ; i++){
//     let a = create_perfect_shuffle(1) ;
//     shuffle_list.push.apply( shuffle_list , a) ;
//   }

//   for( let i=0  ; i<100 ; i++){
//     let a = create_perfect_shuffle(2) ;
//     shuffle_list.push.apply( shuffle_list , a) ;
//   }

//   for( let i=0  ; i<1000 ; i++){
//     let a = create_perfect_shuffle(3) ;
//     shuffle_list.push.apply( shuffle_list , a) ;
//   }

  for( let i=0  ; i<1000 ; i++){
    let a = create_perfect_shuffle(6) ;
    shuffle_list.push.apply( shuffle_list , a) ;
  }
}

function create_shuffle_list2(n) {
  let a = ["x+", "y+", "z+","x-", "y-", "z-"];
  for (let i = 0; i < n; i++) {
    let r = int(random(6));
    shuffle_list.push(a[r]);
  }
}

function test_shuffle_list(){
  shuffle_list.push('x+');
  shuffle_list.push('x+');
  shuffle_list.push('y+');
  shuffle_list.push('z+');
  shuffle_list.push('z-');
  shuffle_list.push('y-');
  shuffle_list.push('x-');
  shuffle_list.push('x-');
  shuffle_list.push('x-');
  shuffle_list.push('x-');
}



function delay(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}


async function simulation(){
  var n = 3 ;//= prompt('shuffle times : ') ;
  
  var succ = 0 ;
  var failc = 0 ;
  for( var i=0 ; i<50 ; i++){
      cubes=[] ;
      shuffle_list=[];
      shuffle_list_idx=0;
      create_cubes();
      await delay(500);
      create_shuffle_list2(n);
      print( shuffle_list ) ;
      while( shuffle_list_idx < shuffle_list.length ){
        await delay(500);
      }
      await delay(2000);
      var r = solve_quick();
      if( r){
        succ++ ;
      }else{
        print( shuffle_list ) ;
        failc++ ;
      }
      print((i+1)+","+succ+","+failc);
      await delay(500);
  }
  
}

function create_cubes() {
  var pos = [-20, 20];
  for (let n1 of pos) {
    for (let n2 of pos) {
      for (let n3 of pos) {
        cubes.push(new Cube(n1, n2, n3, targetLen));
      }
    }
  }
  trans_ori_seq =  get_seq();
  //print("START:"+trans_ori_seq) ;
}
function preload() {
  myFont = loadFont("montserrat.regular.ttf");
  load_trans_table_from_site();
}

function key_events() {
  const r = 3;
  if (keyIsPressed && frameCount-press_fc>50) {
    press_fc = frameCount ;
    //print("===>"+keyCode);
    switch (keyCode) {
      case 65: //a
        if (d_ry == 0 && d_rz == 0) {
          d_rx = 6 * r;
        }
        break;

      case 83: //s
        if (d_rx == 0 && d_rz == 0) {
          d_ry = 6 * r;
        }
        break;

      case 68: //d
        if (d_ry == 0 && d_rx == 0) {
          d_rz = 6 * r;
        }
        break;

      case 90: //z
        if (d_ry == 0 && d_rz == 0) {
          d_rx = -6 * r;
        }
        break;

      case 88: //x
        if (d_rx == 0 && d_rz == 0) {
          d_ry = -6 * r;
        }
        break;

      case 67: //c
        if (d_ry == 0 && d_rx == 0) {
          d_rz = -6 * r;
        }
        break;

      case 82: //r
        //console.log( shuffle_list) ;
        //console.log( shuffle_list_idx) ;
        if (shuffle_list.length == shuffle_list_idx) {
          //let n = parseInt(prompt('請輸入 shuffle 次數')) ;
          let n = 6;
          create_shuffle_list2(n);
          //print(shuffle_list);
          is_save = false;
        }
        break;


      case 81: // Q
        //print('Q')
        if (d_ry == 0 && d_rx == 0 && d_rz == 0) {
          //simulation();
          solve();
        }
        break;
    }
  }
}

function turn(axis) {
  let f_count = 0;
  for (let item of cubes) {
    if (axis == "x") {
      if (item.cx > 0) {
        if (item.update(d_rx, 0, 0)) {
          f_count++;
        }
      }
    } else if (axis == "y") {
      if (item.cy > 0) {
        if (item.update(0, d_ry, 0)) {
          f_count++;
        }
      }
    } else {
      if (item.cz > 0) {
        if (item.update(0, 0, d_rz)) {
          f_count++;
        }
      }
    }
  }
  //print( "fc:"+f_count) ;
  if (f_count == 4) {
    // 停止轉動
    if (axis == "x") {
      d_rx = 0;
    } else if (axis == "y") {
      d_ry = 0;
    } else {
      d_rz = 0;
    }
  }
}

function all_same_items(arr) {
  let first = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] != first) {
      return false;
    }
  }
  return true;
}

function complete() {
  // 紀錄每個方塊投影到每個方向的顏色編號
  let xp = []; // 紀錄 x+ 的方向
  let xn = []; // 紀錄 x- 的方向
  let yp = [];
  let yn = [];
  let zp = [];
  let zn = [];

  for (var cube of cubes) {
    // 某一個方塊
    for (let i = 0; i < 6; i++) {
      // i可以視為顏色代號
      // （方塊6面的）某一面
      let face = cube.faces[i];

      if (
        // 4點的 x
        face[0][0] == targetLen &&
        face[1][0] == targetLen &&
        face[2][0] == targetLen &&
        face[3][0] == targetLen
      ) {
        xp.push(i);
      } else if (
        // 4點的 x
        face[0][0] == -targetLen &&
        face[1][0] == -targetLen &&
        face[2][0] == -targetLen &&
        face[3][0] == -targetLen
      ) {
        xn.push(i);
      } else if (
        // 4點的 y
        face[0][1] == targetLen &&
        face[1][1] == targetLen &&
        face[2][1] == targetLen &&
        face[3][1] == targetLen
      ) {
        yp.push(i);
      } else if (
        // 4點的 y
        face[0][1] == -targetLen &&
        face[1][1] == -targetLen &&
        face[2][1] == -targetLen &&
        face[3][1] == -targetLen
      ) {
        yn.push(i);
      } else if (
        // 4點的 z
        face[0][2] == targetLen &&
        face[1][2] == targetLen &&
        face[2][2] == targetLen &&
        face[3][2] == targetLen
      ) {
        zp.push(i);
      } else if (
        // 4點的 z
        face[0][2] == -targetLen &&
        face[1][2] == -targetLen &&
        face[2][2] == -targetLen &&
        face[3][2] == -targetLen
      ) {
        zn.push(i);
      }
    }
  }

  // print( "-----------");
  // print( xp);
  // print( xn);
  // print( yp);
  // print( yn);
  // print( zp);
  // print( zn);
  // print( "-----------");

  // 檢查：每個方向內的"投影顏色編號" 都相同 ==> 顏色一致
  if (all_same_items(xp)) {
    if (all_same_items(xn)) {
      if (all_same_items(yp)) {
        if (all_same_items(yn)) {
          if (all_same_items(zp)) {
            if (all_same_items(zn)) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}

// function cube_status_tag() {
//   // 紀錄每個方塊投影到每個方向的顏色編號
//   let xp = []; // 紀錄 x+ 的方向
//   let xn = []; // 紀錄 x- 的方向
//   let yp = [];
//   let yn = [];
//   let zp = [];
//   let zn = [];

//   for (var cube of cubes) {
//     // 某一個方塊
//     for (let i = 0; i < 6; i++) {
//       // i可以視為顏色代號
//       // （方塊6面的）某一面
//       let face = cube.faces[i];

//       if (
//         // 4點的 x
//         face[0][0] == targetLen &&
//         face[1][0] == targetLen &&
//         face[2][0] == targetLen &&
//         face[3][0] == targetLen
//       ) {
//         xp.push(i);
//       } else if (
//         // 4點的 x
//         face[0][0] == -targetLen &&
//         face[1][0] == -targetLen &&
//         face[2][0] == -targetLen &&
//         face[3][0] == -targetLen
//       ) {
//         xn.push(i);
//       } else if (
//         // 4點的 y
//         face[0][1] == targetLen &&
//         face[1][1] == targetLen &&
//         face[2][1] == targetLen &&
//         face[3][1] == targetLen
//       ) {
//         yp.push(i);
//       } else if (
//         // 4點的 y
//         face[0][1] == -targetLen &&
//         face[1][1] == -targetLen &&
//         face[2][1] == -targetLen &&
//         face[3][1] == -targetLen
//       ) {
//         yn.push(i);
//       } else if (
//         // 4點的 z
//         face[0][2] == targetLen &&
//         face[1][2] == targetLen &&
//         face[2][2] == targetLen &&
//         face[3][2] == targetLen
//       ) {
//         zp.push(i);
//       } else if (
//         // 4點的 z
//         face[0][2] == -targetLen &&
//         face[1][2] == -targetLen &&
//         face[2][2] == -targetLen &&
//         face[3][2] == -targetLen
//       ) {
//         zn.push(i);
//       }
//     }
//   }

//   // print( "-----------");
//   // print( xp);
//   // print( xn);
//   // print( yp);
//   // print( yn);
//   // print( zp);
//   // print( zn);
//   // print( "-----------");

//   // 檢查：每個方向內的"投影顏色編號" 都相同 ==> 顏色一致
//   if (all_same_items(xp)) {
//     if (all_same_items(xn)) {
//       if (all_same_items(yp)) {
//         if (all_same_items(yn)) {
//           if (all_same_items(zp)) {
//             if (all_same_items(zn)) {
//               return true;
//             }
//           }
//         }
//       }
//     }
//   }
//   return false;
// }

function setup() {
  createCanvas(400, 400, WEBGL);
  angleMode(DEGREES);
  textFont(myFont);
  textSize(16);

  create_cubes();

  complete_arr = get_complete_seq_position_array();

  //load_trans_table();
}

function draw() {
  // 背景色
  background(255);

  // 訊息
  if( warning_info.length>0){
    fill(255,0,0);
    text(warning_info , -120 ,90) ;
  }
  fill(30);
  text("A , S , D : rotate", -120, 120);
  text("Z , X , C : rotate(backward)", -120, 150);
  text("R : shuffle     Q : Solve", -120, 180);

  // 滑鼠控制：旋轉攝影機
  orbitControl(2, 2, 2);

  // push(); // 結界-start
  // fill(50); // 設定填滿色彩
  // text("1 (1,1)", 40, 50); // 寫 X,Y,Z
  // text("2 (1,-1)", 40, -50); // 寫 X,Y,Z
  // text("3 (-1,1)", -80, 50); // 寫 X,Y,Z
  // text("4 (-1,-1)", -80, -50); // 寫 X,Y,Z
  // pop(); // 結界-end

  // 由 shuffle list 進行旋轉
  if (shuffle_list_idx < shuffle_list.length) {
    // 全部停止才可以轉
    if (d_rx == 0 && d_ry == 0 && d_rz == 0) {
        // if(shuffle_list_idx%100==0){
        //   print("shuffle turn : " + shuffle_list_idx);
        // }

      // 紀錄轉移狀態
      // log_trans_status();
      

      if (shuffle_list[shuffle_list_idx] == "x+") {
        trans_axis = "x+";
        d_rx = 10;
        // d_rx = 90;
      } else if (shuffle_list[shuffle_list_idx] == "y+") {
        trans_axis = "y+";
        d_ry = 10;
        // d_ry = 90;
      } else if (shuffle_list[shuffle_list_idx] == "z+") {
        trans_axis = "z+";
        d_rz = 10;
        // d_rz = 90;
      }else if (shuffle_list[shuffle_list_idx] == "x-") {
        trans_axis = "x-";
        d_rx = -10;
        // d_rx = -90;
      } else if (shuffle_list[shuffle_list_idx] == "y-") {
        trans_axis = "y-";
        d_ry = -10;
        // d_ry = -90;
      } else if (shuffle_list[shuffle_list_idx] == "z-") {
        trans_axis = "z-";
        d_rz = -10;
        // d_rz = -90;
      }
      shuffle_list_idx++;
    }
  } else{
     if(shuffle_list.length>0 && is_save==false){
      // 轉移狀態存檔
      // print(trans_table);
      // print( get_trans_stat() ) ;    
      // save_trans_table_to_file();
      // is_save = true;
     }
     key_events();
  }

  // 旋轉
  if (d_rx != 0 && d_ry == 0 && d_rz == 0) {
    turn("x");
  } else if (d_rx == 0 && d_ry != 0 && d_rz == 0) {
    turn("y");
  } else if (d_rx == 0 && d_ry == 0 && d_rz != 0) {
    turn("z");
  } else {
    //print("完成?" + complete());
  }

  // 顯示
  for (let c of cubes) {
    c.show();

    // print( c.cx+","+c.cy+","+c.cz+",")
    // if (c.cx == 20 && c.cy == 20 && c.cz == 20) {
    //   print("#" + c.outside_face_color_seg());
    // }
    // print( c.faces) ;
  }

  //print( get_seq()) ;
  // print("===============")
  // 取得鍵盤事件
  
}

function get_seq() {
  var seq = ["", "", "", "", "", "", "", ""]; // 8 個方塊的序列
  for (let c of cubes) {
    if (c.cx == 20 && c.cy == 20 && c.cz == 20) {
      seq[0] = c.outside_face_color_seg();
    }
    if (c.cx == 20 && c.cy == 20 && c.cz == -20) {
      seq[1] = c.outside_face_color_seg();
    }
    if (c.cx == 20 && c.cy == -20 && c.cz == 20) {
      seq[2] = c.outside_face_color_seg();
    }
    if (c.cx == 20 && c.cy == -20 && c.cz == -20) {
      seq[3] = c.outside_face_color_seg();
    }
    if (c.cx == -20 && c.cy == 20 && c.cz == 20) {
      seq[4] = c.outside_face_color_seg();
    }
    if (c.cx == -20 && c.cy == 20 && c.cz == -20) {
      seq[5] = c.outside_face_color_seg();
    }
    if (c.cx == -20 && c.cy == -20 && c.cz == 20) {
      seq[6] = c.outside_face_color_seg();
    }
    if (c.cx == -20 && c.cy == -20 && c.cz == -20) {
      seq[7] = c.outside_face_color_seg();
    }
  }
  var s = "";
  for (var item of seq) {
    s = s + item;
  }

  return s;
}

function log_trans_status() {
   
  
  // 產生方塊顏色序列標籤
  var new_seq = get_seq();
  if (trans_ori_seq.length > 0 && trans_axis.length>0) { // 有前一個狀態
    // 紀錄轉換狀態
    if (trans_table[trans_ori_seq] == null) {
      //p.to['x+']="RYRR.."
      trans_table[trans_ori_seq] = new TransStatus();
    }
    trans_table[trans_ori_seq].to[trans_axis] = new_seq;
    
    //print(trans_ori_seq+" >>> "+trans_axis+" >>> "+new_seq)
  }

  trans_ori_seq = new_seq;
}

// 儲存轉換表紀錄
function save_trans_table(){
  
  var data={
      raw:trans_table ,
      stat: get_trans_stat()
  };
  
  let dstr = JSON.stringify(data);
  localStorage.setItem('transtable',dstr) ;
  print( "DATA SAVED!!!")
}


async function saveFile( content ) {
  try {
    // create a new handle
    const newHandle = await window.showSaveFilePicker();

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    // write our file
    await writableStream.write(content);

    // close the file and write the contents to disk.
    await writableStream.close();
  } catch (err) {
    console.error(err.name, err.message);
  }
}

function save_trans_table_to_file(){
  
  var data={
      raw:trans_table ,
      stat: get_trans_stat()
  };
  
  let dstr = JSON.stringify(data);
  
  saveFile(dstr) ;
  
  print( "DATA SAVED!!!")
}


function load_trans_table_file(f_name){
  var file_name ="" ;
  fetch(f_name)
    .then((response) => response.json())
    .then((json) => {
      console.log( json) ;
      trans_table = json.raw ;
    console.log("DATA LOADED FROM FILE!!");
    });
}

function load_trans_table_from_site(){
  fetch('/rubik-s-cube-solving/log_261897.log')
  .then((response) => response.json())
  .then((json) => {
    console.log( json) ;
    trans_table = json.raw ;
    trans_table_bakeup = JSON.parse(JSON.stringify(trans_table));
  console.log("DATA LOADED FROM FILE!!");
  });
}

// 讀取轉換表紀錄
function load_trans_table(){
    
  let dstr = localStorage.getItem('transtable') ;
  if( dstr != null ){
      let data = JSON.parse( dstr) ;
      trans_table = data.raw ;
      print("==========================")
      print(trans_table) ;
      print("==========================")
  }  
  print( "DATA LOADED!!!")
}
// 顯示轉換表統計結果
function get_trans_stat(){
  let n = 0 ;
  let e = 0 ;
  let cp_e = 0; // 紀錄有相連成功面的筆數
  let cp= 'YRBYRPYSBYSPGRBGRPGSBGSP';
//print("------------------------------")
  for( let it in trans_table ){
      //console.log(it);
      n++;
      for( let itt in trans_table[it].to ){
        //console.log(itt+" ==> "+trans_table[it].to[itt]) ;
        if( trans_table[it].to[itt].length>0){
          e++;
          if( it==cp || trans_table[it].to[itt]==cp ){
            cp_e++;
          }
        }
      }
  }  

  return { node:n , edge:e , edge_cmp:cp_e} ;
  
}



function get_complete_seq_position_array() {
  let t = 'YRBYRPYSBYSPGRBGRPGSBGSP';
  var result = {} ;
  for( var i=0 ; i<t.length ; i++){
    var c = t[i] ;
    if( result[c]==null){
      result[c]=[]
    }
    result[c].push(i);
  }
  var arr = [] ;
  for( let color in result ){
    //console.log(result[color]) ;
    arr.push( result[color]) ;
  }

  return arr;
}

// 檢查是否是完成的序列
function check_complete_seq( seq ){
  //       0123456789

  for( let face of complete_arr ){
    let color = '' ;
    for( let pos of face ){
      if( color =='' ){
        color = seq[pos] ;
      }else{
        if( color!=seq[pos]){
          return false ;
        }
      }
    }
  }

  return true ;


}

function count_complete_seq(){
  var total = 0;
  for( let seq in trans_table ){
    if( check_complete_seq(seq)){
      total++;
    }    
  }
  return total ;

}


function solve(){
  //load_trans_table_file('log_261897.log');
  let cp= 'YRBYRPYSBYSPGRBGRPGSBGSP';
  let start_seq = get_seq();
  if(trans_table[start_seq]==null ){
    warning_info='Data not found!';
    return ;
  }
  trans_table[start_seq].res=[];
  let to_do = [] ;
  to_do.push( start_seq ) ;

  while(to_do.length>0){
    // 拿出一個工作
    let seq = to_do[0];
    // 刪掉第一個工作
    to_do.splice(0,1);

    // 找後面的項目
    for( let itt in trans_table[seq].to ){
      //console.log(itt+" ==> "+trans_table[it].to[itt]) ;
      if( trans_table[seq].to[itt].length>0){
        if( trans_table[seq].to[itt]==cp ){
          // 找到解答
          console.log("==========SOLUTION==================");
          trans_table[seq].res.push(itt);
          console.log(trans_table[seq].res);
          console.log("==========--------==================");
          // result to shuffle : + >> - / - >> +
          // shuffle_list = trans_table[seq].res;
          shuffle_list = trans_table[seq].res;
          // for( var r of trans_table[seq].res ){            
          //   shuffle_list.push(r);
          // }          
          shuffle_list_idx=0;
          return ;
        }else{
          // 還沒有解答 
          let now_seq = trans_table[seq].to[itt] ;
          // 已經有被走過，不重複做
          if( trans_table[now_seq].res !=null ){ 
            continue;
          }
          // 1. 把目前的解法記下
          let pre = trans_table[seq].res.concat() ; // 前面的轉法
          
          pre.push( itt) ; // 這一次的轉法
          trans_table[now_seq].res = pre ; 
          // 如果找太久沒有答案
          if( pre.length>=20 ){ 
            continue ; // 不再做
          }
          // 2. 加入工作清單
          to_do.push( now_seq ) ;
        }
      }
    }

  }

  // restore trans_table
  trans_table = JSON.parse(JSON.stringify(trans_table_bakeup));


}

function solve_quick(){
  //load_trans_table_file('log_261897.log');
  let cp= 'YRBYRPYSBYSPGRBGRPGSBGSP';
  let start_seq = get_seq();
  if(trans_table[start_seq]==null ){
    print("fail:"+start_seq);
    return false ;
  }
  trans_table[start_seq].res=[];
  let to_do = [] ;
  to_do.push( start_seq ) ;

  while(to_do.length>0){
    // 拿出一個工作
    let seq = to_do[0];
    // 刪掉第一個工作
    to_do.splice(0,1);

    // 找後面的項目
    for( let itt in trans_table[seq].to ){
      //console.log(itt+" ==> "+trans_table[it].to[itt]) ;
      if( trans_table[seq].to[itt].length>0){
        if( trans_table[seq].to[itt]==cp ){
          // 找到解答
          
          return true;
        }else{
          // 還沒有解答 
          let now_seq = trans_table[seq].to[itt] ;
          // 已經有被走過，不重複做
          if( trans_table[now_seq].res !=null ){ 
            continue;
          }
          // 1. 把目前的解法記下
          let pre = trans_table[seq].res.concat() ; // 前面的轉法
          
          pre.push( itt) ; // 這一次的轉法
          trans_table[now_seq].res = pre ; 
          // 如果找太久沒有答案
          if( pre.length>=20 ){ 
            continue ; // 不再做
          }
          // 2. 加入工作清單
          to_do.push( now_seq ) ;
        }
      }
    }

  }

  // restore trans_table
  trans_table = JSON.parse(JSON.stringify(trans_table_bakeup));

  return false ;
}


//BRGYRPYSBYSPGBSRBYRPGGSP
