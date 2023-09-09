var myFont;
// var rxyz = [
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 0],
// ];
// var ry = [0, 0, 0, 0, 0, 0, 0, 0];
// var rz = [0, 0, 0, 0, 0, 0, 0, 0];
// var dx = 0;
// var dy = 0;
// var dz = 0;
// var adx = 0; // 每次轉動角度
// var ady = 0;
// var adz = 0;
// var rx = 0;
//   ry = 0;
//   rz = 0;

class Cube {
  constructor(cx, cy, cz, sz) {
    this.faces = [];
    this.colors = [];

    let len = sz / 2;
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
cal_center(){
  var n =0;
  var ax =0;
  var ay=0;
  var az=0;
  for (var face of this.faces) {     
      for (var vx of face) {
        ax+=vx[0];
        ay+=vx[1];
        az+=vx[2];
        n++;
        }
  }
   this.cx = ax/n;
   this.cy = ay/n;
   this.cz = az/n;
}
  
  show() {
    let i = 0;
    for (var face of this.faces) {
      beginShape();
      let c = this.colors[i];
      fill(c[0], c[1], c[2]);
      for (var vx of face) {
        vertex(vx[0], vx[1], vx[2]);
      }
      endShape();
      i++;
    }
  }
  
  update( rx , ry , rz ){
    // print( this.faces[0]) ;
    for (var face of this.faces) {     
      for (var vx of face) {
        //vertex(vx[0], vx[1], vx[2]);
        var after_loc  = this.cal_location([vx[0], vx[1], vx[2],1],0,0,0,rx,ry,rz ) ;
        vx[0] = after_loc[0] ;
        vx[1] = after_loc[1] ;
        vx[2] = after_loc[2] ;
      }      
    }
    // print( this.faces[0]) ;
    // print("==================");
    this.cal_center();
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
    return [round(r1[0]),round( r1[1]), round(r1[2])];
  }
}


var c1 = new Cube( -20,-20, -20 , 40 ) ;
var c2 = new Cube( -20 , 20, -20 , 40 ) ;
var c3 = new Cube( -20 , -20, 20 , 40 ) ;
var c4 = new Cube( 20 , 20, -20 , 40 ) ;
var c5 = new Cube( -20 , 20, 20 , 40 ) ;
var c6 = new Cube( 20 , -20, 20 , 40 ) ;
var c7 = new Cube( 20 , -20, -20 , 40 ) ;
var c8 = new Cube( 20 , 20, 20 , 40 ) ;

var cubes=[];
cubes.push(c1);
cubes.push(c2);
cubes.push(c3);
cubes.push(c4);
cubes.push(c5);
cubes.push(c6);
cubes.push(c7);
cubes.push(c8);




function preload() {
  myFont = loadFont("montserrat.regular.ttf");
}

function setup() {
  createCanvas(400, 400, WEBGL);
  angleMode(DEGREES);
  textFont(myFont);
  textSize(16);
}





function turn_around() {
  dx += adx;
  dy += ady;
  dz += adz;

  dx = rotate_right(dx);
  dy = rotate_right(dy);
  dz = rotate_right(dz);

  if (dx % 90 == 0) {
    adx = 0;
  }
  if (dy % 90 == 0) {
    ady = 0;
  }
  if (dz % 90 == 0) {
    adz = 0;
  }

  print("dx,dy,dz ==> " + dx + " , " + dy + " , " + dz);
}

function key_events() {
  if (keyIsPressed) {
    //print(keyCode);
    switch (keyCode) {
      case 81: //q
        turn_type = "X";
        break;
      case 87: //w
        turn_type = "Y";
        break;
      case 69: //e
        turn_type = "Z";
        break;
      case 65: //a
        //if (dx == 0 && dy == 0 && dz == 0) {
        adx = 6;

        //}
        break;
      case 83: //s
        //if (dx == 0 && dy == 0 && dz == 0) {
        ady = 6;

        //}
        break;
      case 68: //d
        //if (dx == 0 && dy == 0 && dz == 0) {
        adz = 6;

        //}
        break;
    }
  }
}


function turnX(cubes){
  
  for(let item of cubes){
    if(item.cx>0){
      item.update(5,0,0);
    }
  }
}
function turnY(cubes){
  
  for(let item of cubes){
    if(item.cy>0){
      item.update(0,5,0);
    }
  }
}
function turnZ(cubes){
  
  for(let item of cubes){
    if(item.cz>0){
      item.update(0,0,5);
    }
  }
}

function draw() {
  // 背景色
  background(200);
  // 滑鼠控制
  orbitControl(2, 2, 2);

  push(); // 結界-start
  fill(50); // 設定填滿色彩
  text("1 (1,1)", 40, 50); // 寫 X,Y,Z
  text("2 (1,-1)", 40, -50); // 寫 X,Y,Z
  text("3 (-1,1)", -80, 50); // 寫 X,Y,Z
  text("4 (-1,-1)", -80, -50); // 寫 X,Y,Z
  pop(); // 結界-end


  //turnX(cubes);
//  turnY(cubes);
 turnZ(cubes);
  
  
  c1.show();
  c2.show();
  c3.show();
  c4.show();
  c5.show();
  c6.show();
  c7.show();
  c8.show();
  //key_events();
  //turn_around();
}

