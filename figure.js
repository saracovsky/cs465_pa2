var canvas;
var gl;
var program;

var colorUniformLocation;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
];

var torsoId = 0;
var headId = 1;
var head1Id = 1; //neck movement
//left leg1
var leftUpperLeg1Id = 2;
var leftMiddleLeg1Id = 3;
var leftLowerLeg1Id = 4;
//right leg1
var rightUpperLeg1Id = 5;
var rightMiddleLeg1Id = 6;
var rightLowerLeg1Id = 7;
//left leg2
var leftUpperLeg2Id = 8;
var leftMiddleLeg2Id = 9;
var leftLowerLeg2Id = 10;
//right leg2
var rightUpperLeg2Id = 11;
var rightMiddleLeg2Id = 12;
var rightLowerLeg2Id = 13;
//left leg3
var leftUpperLeg3Id = 14;
var leftMiddleLeg3Id = 15;
var leftLowerLeg3Id = 16;
//right leg3
var rightUpperLeg3Id = 17;
var rightMiddleLeg3Id = 18;
var rightLowerLeg3Id = 19;
//left leg4
var leftUpperLeg4Id = 20;
var leftMiddleLeg4Id = 21;
var leftLowerLeg4Id = 22;
//right leg4
var rightUpperLeg4Id = 23;
var rightMiddleLeg4Id = 24;
var rightLowerLeg4Id = 25;
//bottom
var bottomId = 26;

//SIZES OF THE FIGURE
var torsoHeight = 1.0;
var torsoWidth = 3.0;

var upperHeight = 3.0;
var lowerHeight = 2.0;
var middleHeight = 2.0;

var upperWidth = 0.5;
var lowerWidth = 0.5;
var middleWidth = 0.5;

var headHeight = 1.5;
var headWidth = 1.0;

var bottomWidth = 4.0;
var bottomHeight = 2.0;

var numNodes = 27;
//var numAngles = 11;
var angle = 45;

var theta = [
  0, // torso
  0, //head
  0,
  0,
  0, // left leg 1
  0,
  0,
  0, // rigth leg 1
  0,
  0,
  0, // left leg 2
  0,
  0,
  0, // right leg 2
  0,
  0,
  0, //left leg 3
  0,
  0,
  0, //right leg 3
  0,
  0,
  0, // letf leg 4
  0,
  0,
  0, // rigth leg 4
  0, //bottom
];

var initial_theta = [
  0, // torso
  0, //head
  0,
  0,
  0, // left leg 1
  0,
  0,
  0, // rigth leg 1
  0,
  0,
  0, // left leg 2
  0,
  0,
  0, // right leg 2
  0,
  0,
  0, //left leg 3
  0,
  0,
  0, //right leg 3
  0,
  0,
  0, // letf leg 4
  0,
  0,
  0, // rigth leg 4
  0, //bottom
];

var numVertices = 36;

var stack = [];

var figure = [];

for (var i = 0; i < numNodes; i++)
  figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//ADDED
var vBuffer, cBuffer;
var colors = [];
// RGBA colors
var vertexColors = [
  vec4(0.0, 0.0, 0.0, 1.0), // black
  vec4(1.0, 0.0, 0.0, 1.0), // red
  vec4(1.0, 1.0, 0.0, 1.0), // yellow
  vec4(0.0, 1.0, 0.0, 1.0), // green
  vec4(0.0, 0.0, 1.0, 1.0), // blue
  vec4(1.0, 0.0, 1.0, 1.0), // magenta
  vec4(1.0, 1.0, 1.0, 1.0), // white
  vec4(0.0, 1.0, 1.0, 1.0), // cyan
];

var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333, 1);
var numTimesToSubdivide = 3;
var index = 0;

var text = null;

//NOT: AŞAĞIDAKİ 3 FUNCTION KENDİ PROJEMDEN GELME İSMİNİ DEĞİŞTİREBİLİRSİN KILLANIRSAN. YUVARLAK YAPMAK İÇİN KULLANIYOLAR.

function triangle(a, b, c) {
  //console.log(pointsArray);
  pointsArray.push(a);
  pointsArray.push(b);
  pointsArray.push(c);

  index += 3;
}

function divideTriangle(a, b, c, count) {
  if (count > 0) {
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);

    ab = normalize(ab, true);
    ac = normalize(ac, true);
    bc = normalize(bc, true);

    divideTriangle(a, ab, ac, count - 1);
    divideTriangle(ab, b, bc, count - 1);
    divideTriangle(bc, c, ac, count - 1);
    divideTriangle(ab, bc, ac, count - 1);
  } else {
    triangle(a, b, c);
  }
}

function tetrahedron(a, b, c, d, n) {
  divideTriangle(a, b, c, n);
  divideTriangle(d, c, b, n);
  divideTriangle(a, d, b, n);
  divideTriangle(a, c, d, n);
}

//-------------------------------------------

function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}

//--------------------------------------------

function createNode(transform, render, sibling, child) {
  var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
  };
  return node;
}

//CREATION OF NODE TREE FOR SPIDER
function initNodes(Id) {
  var m = mat4();

  switch (Id) {
    case torsoId:
      m = translate(0, 0, 0);
      m = mult(m, rotate(theta[torsoId], 0, 1, 0));
      figure[torsoId] = createNode(m, torso, null, bottomId);
      break;

    case bottomId:
      m = translate(0.0, 1.5, -3.5);
      m = mult(m, rotate(30, 1, 0, 0));
      figure[bottomId] = createNode(m, bottom, headId, null);
      break;

    case headId:
    case head1Id:
      m = translate(0.0, (torsoHeight / 2) * headHeight, 2);
      m = mult(m, rotate(theta[head1Id], 1, 0, 0));
      m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
      figure[headId] = createNode(m, head, leftUpperLeg1Id, null);
      break;

    // left_1
    case leftUpperLeg1Id: // 5
      m = translate(-(torsoWidth / 2), 0.1 * upperHeight, torsoWidth / 2);
      m = mult(m, rotate(angle, 0, 1, 1));
      m = mult(m, rotate(theta[leftUpperLeg1Id], 0, 0, 1));
      figure[leftUpperLeg1Id] = createNode(
        m,
        leftUpperLeg,
        rightUpperLeg1Id,
        leftMiddleLeg1Id
      ); // 17, 6
      break;
    case leftMiddleLeg1Id: // 6
      m = translate(0.0, upperHeight, 0.0);
      m = mult(m, rotate(2 * angle, 0, 0, 1));
      m = mult(m, rotate(theta[leftMiddleLeg1Id], 1, 0, 0));
      figure[leftMiddleLeg1Id] = createNode(
        m,
        leftMiddleLeg,
        null,
        leftLowerLeg1Id
      ); // 7
      break;
    case leftLowerLeg1Id: // 7
      m = translate(0.0, middleHeight, 0.0);
      m = mult(m, rotate(angle, 0, 0, 1));
      m = mult(m, rotate(theta[leftLowerLeg1Id], 0, 0, 1));
      figure[leftLowerLeg1Id] = createNode(m, leftLowerLeg, null, null);
      break;

    // right_1
    case rightUpperLeg1Id: // 8
      m = translate(torsoWidth / 2, 0.1 * upperHeight, torsoWidth / 2);
      m = mult(m, rotate(-angle, 0, 1, 1));
      m = mult(m, rotate(theta[rightUpperLeg1Id], 0, 0, 1));
      figure[rightUpperLeg1Id] = createNode(
        m,
        rightUpperLeg,
        leftUpperLeg2Id,
        rightMiddleLeg1Id
      ); // 20, 9
      break;
    case rightMiddleLeg1Id: // 9
      m = translate(0.0, upperHeight, 0.0);
      m = mult(m, rotate(-(2 * angle), 0, 0, 1));
      m = mult(m, rotate(theta[rightMiddleLeg1Id], 1, 0, 0));
      figure[rightMiddleLeg1Id] = createNode(
        m,
        rightMiddleLeg,
        null,
        rightLowerLeg1Id
      ); // 10
      break;
    case rightLowerLeg1Id: // 10
      m = translate(0.0, middleHeight, 0.0);
      m = mult(m, rotate(-angle, 0, 0, 1));
      m = mult(m, rotate(theta[rightLowerLeg1Id], 0, 0, 1));
      figure[rightLowerLeg1Id] = createNode(m, rightLowerLeg, null, null);
      break;

    // left_2
    case leftUpperLeg2Id: // 11
      m = translate(-(torsoWidth / 2), 0.1 * upperHeight, torsoWidth * 0.16);
      m = mult(m, rotate(angle, 0, 1, 1));
      m = mult(m, rotate(theta[leftUpperLeg2Id], 0, 0, 1));
      figure[leftUpperLeg2Id] = createNode(
        m,
        leftUpperLeg,
        rightUpperLeg2Id,
        leftMiddleLeg2Id
      ); // 23, 12
      break;
    case leftMiddleLeg2Id: // 12
      m = translate(0.0, upperHeight, 0.0);
      m = mult(m, rotate(2 * angle, 0, 0, 1));
      m = mult(m, rotate(theta[leftMiddleLeg2Id], 1, 0, 0));
      figure[leftMiddleLeg2Id] = createNode(
        m,
        leftMiddleLeg,
        null,
        leftLowerLeg2Id
      ); // 13
      break;
    case leftLowerLeg2Id: // 13
      m = translate(0.0, middleHeight, 0.0);
      m = mult(m, rotate(angle, 0, 0, 1));
      m = mult(m, rotate(theta[leftLowerLeg2Id], 0, 0, 1));
      figure[leftLowerLeg2Id] = createNode(m, leftLowerLeg, null, null);
      break;

    // right_2
    case rightUpperLeg2Id: // 14
      m = translate(torsoWidth / 2, 0.1 * upperHeight, torsoWidth * 0.16);
      m = mult(m, rotate(-angle, 0, 1, 1));
      m = mult(m, rotate(theta[rightUpperLeg2Id], 0, 0, 1));
      figure[rightUpperLeg2Id] = createNode(
        m,
        rightUpperLeg,
        leftUpperLeg3Id,
        rightMiddleLeg2Id
      ); // 26, 15
      break;
    case rightMiddleLeg2Id: // 15
      m = translate(0.0, upperHeight, 0.0);
      m = mult(m, rotate(-(2 * angle), 0, 0, 1));
      m = mult(m, rotate(theta[rightMiddleLeg2Id], 1, 0, 0));
      figure[rightMiddleLeg2Id] = createNode(
        m,
        rightMiddleLeg,
        null,
        rightLowerLeg2Id
      ); // 16
      break;
    case rightLowerLeg2Id: // 16
      m = translate(0.0, middleHeight, 0.0);
      m = mult(m, rotate(-angle, 0, 0, 1));
      m = mult(m, rotate(theta[rightLowerLeg2Id], 0, 0, 1));
      figure[rightLowerLeg2Id] = createNode(m, rightLowerLeg, null, null);
      break;

    // left_3
    case leftUpperLeg3Id: // 17
      m = translate(-(torsoWidth / 2), 0.1 * upperHeight, -(torsoWidth * 0.16));
      m = mult(m, rotate(angle, 0, -1, 1));
      m = mult(m, rotate(theta[leftUpperLeg3Id], 0, 0, 1));
      figure[leftUpperLeg3Id] = createNode(
        m,
        leftUpperLeg,
        rightUpperLeg3Id,
        leftMiddleLeg3Id
      ); // 5, 18
      break;
    case leftMiddleLeg3Id: // 18
      m = translate(0.0, upperHeight, 0.0);
      m = mult(m, rotate(2 * angle, 0, 0, 1));
      m = mult(m, rotate(theta[leftMiddleLeg3Id], 1, 0, 0));
      figure[leftMiddleLeg3Id] = createNode(
        m,
        leftMiddleLeg,
        null,
        leftLowerLeg3Id
      ); // 19
      break;
    case leftLowerLeg3Id: // 19
      m = translate(0.0, middleHeight, 0.0);
      m = mult(m, rotate(angle, 0, 0, 1));
      m = mult(m, rotate(theta[leftLowerLeg3Id], 0, 0, 1));
      figure[leftLowerLeg3Id] = createNode(m, leftLowerLeg, null, null);
      break;

    // right_3
    case rightUpperLeg3Id: // 20
      m = translate(torsoWidth / 2, 0.1 * upperHeight, -(torsoWidth * 0.16));
      m = mult(m, rotate(-angle, 0, -1, 1));
      m = mult(m, rotate(theta[rightUpperLeg3Id], 0, 0, 1));
      figure[rightUpperLeg3Id] = createNode(
        m,
        rightUpperLeg,
        leftUpperLeg4Id,
        rightMiddleLeg3Id
      ); // 8, 21
      break;
    case rightMiddleLeg3Id: // 21
      m = translate(0.0, upperHeight, 0.0);
      m = mult(m, rotate(-(2 * angle), 0, 0, 1));
      m = mult(m, rotate(theta[rightMiddleLeg3Id], 1, 0, 0));
      figure[rightMiddleLeg3Id] = createNode(
        m,
        rightMiddleLeg,
        null,
        rightLowerLeg3Id
      ); // 22
      break;
    case rightLowerLeg3Id: // 22
      m = translate(0.0, middleHeight, 0.0);
      m = mult(m, rotate(-angle, 0, 0, 1));
      m = mult(m, rotate(theta[rightLowerLeg3Id], 0, 0, 1));
      figure[rightLowerLeg3Id] = createNode(m, rightLowerLeg, null, null);
      break;

    // left_4
    case leftUpperLeg4Id: // 23
      m = translate(-(torsoWidth / 2), 0.1 * upperHeight, -(torsoWidth / 2));
      m = mult(m, rotate(angle, 0, -1, 1));
      m = mult(m, rotate(theta[leftUpperLeg4Id], 0, 0, 1));
      figure[leftUpperLeg4Id] = createNode(
        m,
        leftUpperLeg,
        rightUpperLeg4Id,
        leftMiddleLeg4Id
      ); // 11, 24
      break;
    case leftMiddleLeg4Id: // 24
      m = translate(0.0, upperHeight, 0.0);
      m = mult(m, rotate(2 * angle, 0, 0, 1));
      m = mult(m, rotate(theta[leftMiddleLeg4Id], 1, 0, 0));
      figure[leftMiddleLeg4Id] = createNode(
        m,
        leftMiddleLeg,
        null,
        leftLowerLeg4Id
      ); // 25
      break;
    case leftLowerLeg4Id: // 25
      m = translate(0.0, middleHeight, 0.0);
      m = mult(m, rotate(angle, 0, 0, 1));
      m = mult(m, rotate(theta[leftLowerLeg4Id], 0, 0, 1));
      figure[leftLowerLeg4Id] = createNode(m, leftLowerLeg, null, null);
      break;

    // right_4
    case rightUpperLeg4Id: // 26
      m = translate(torsoWidth / 2, 0.1 * upperHeight, -(torsoWidth / 2));
      m = mult(m, rotate(-angle, 0, -1, 1));
      m = mult(m, rotate(theta[rightUpperLeg4Id], 0, 0, 1));
      figure[rightUpperLeg4Id] = createNode(
        m,
        rightUpperLeg,
        null,
        rightMiddleLeg4Id
      ); // 14, 27
      break;
    case rightMiddleLeg4Id: // 27
      m = translate(0.0, upperHeight, 0.0);
      m = mult(m, rotate(-(2 * angle), 0, 0, 1));
      m = mult(m, rotate(theta[rightMiddleLeg4Id], 1, 0, 0));
      figure[rightMiddleLeg4Id] = createNode(
        m,
        rightMiddleLeg,
        null,
        rightLowerLeg4Id
      ); // 28
      break;
    case rightLowerLeg4Id: // 28
      m = translate(0.0, middleHeight, 0.0);
      m = mult(m, rotate(-angle, 0, 0, 1));
      m = mult(m, rotate(theta[rightLowerLeg4Id], 0, 0, 1));
      figure[rightLowerLeg4Id] = createNode(m, rightLowerLeg, null, null);
      break;
  }
}

function traverse(Id) {
  if (Id == null) return;
  stack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
  figure[Id].render();
  if (figure[Id].child != null) traverse(figure[Id].child);
  modelViewMatrix = stack.pop();
  if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * torsoHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(torsoWidth * 0.8, torsoHeight * 1.4, torsoWidth * 0.8)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 24; i < index; i++) gl.drawArrays(gl.TRIANGLES, i, 3);
}

function bottom() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * torsoHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(torsoWidth * 0.8, torsoHeight * 1.4, torsoWidth * 0.8)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 24; i < index; i++) gl.drawArrays(gl.TRIANGLES, i, 3);
}

function head() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.5));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(headWidth * 1.5, headHeight, headWidth * 1.3)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 24; i < index; i++) gl.drawArrays(gl.TRIANGLES, i, 3);
}

//LEFT LEG

function leftUpperLeg() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * upperHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperWidth, upperHeight, upperWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftMiddleLeg() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * middleHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(middleWidth, middleHeight, middleWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftLowerLeg() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * lowerHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerWidth, lowerHeight, lowerWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//RIGHT LEG

function rightUpperLeg() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * upperHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperWidth, upperHeight, upperWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightMiddleLeg() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * middleHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(middleWidth, middleHeight, middleWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightLowerLeg() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * lowerHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerWidth, lowerHeight, lowerWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function quad(a, b, c, d) {
  pointsArray.push(vertices[a]);
  pointsArray.push(vertices[b]);
  pointsArray.push(vertices[c]);
  pointsArray.push(vertices[d]);
}

function cube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

//ADDED FOR ANIMATION----------------------
function save_animation() {
  var filename = "animationfile" + ".txt";

  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(theta)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function openFile(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function () {
    text = reader.result;
    console.log(reader.result.substring(0, 200));
    array = reader.result.substring(0, 200).split(",");
    console.log("6", array[1]);
    console.log(array);
  };
  reader.readAsText(input.files[0]);
}
function play_animation() {
  console.log(theta);
  if (text != null) {
    console.log(theta);
    var counter = 0;

    theta = array;
    setTimeout(function () {
      initNodes(torsoId);
    }, counter + 100);
    //initNodes(torsoId);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(head1Id);
    }, counter);
    //initNodes(head1Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftUpperLeg1Id);
    }, counter);
    //initNodes(leftUpperLeg1Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftMiddleLeg1Id);
    }, counter);
    //initNodes(leftMiddleLeg1Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftLowerLeg1Id);
    }, counter);
    //initNodes(leftLowerLeg1Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftUpperLeg2Id);
    }, counter);
    //initNodes(leftUpperLeg2Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftMiddleLeg2Id);
    }, counter);
    //initNodes(leftMiddleLeg2Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftLowerLeg2Id);
    }, counter);
    //initNodes(leftLowerLeg2Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftUpperLeg3Id);
    }, counter);
    //initNodes(leftUpperLeg3Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftMiddleLeg3Id);
    }, counter);
    //initNodes(leftMiddleLeg3Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftLowerLeg3Id);
    }, counter);
    //nitNodes(leftLowerLeg3Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftUpperLeg4Id);
    }, counter);
    //initNodes(leftUpperLeg4Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftMiddleLeg4Id);
    }, counter);
    //initNodes(leftMiddleLeg4Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(leftLowerLeg4Id);
    }, counter);
    //initNodes(leftLowerLeg4Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(rightUpperLeg1Id);
    }, counter);
    //initNodes(rightUpperLeg1Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(rightMiddleLeg1Id);
    }, counter);
    //initNodes(rightMiddleLeg1Id);
    counter = counter + 100;
    setTimeout(function () {
      initNodes(rightLowerLeg1Id);
    }, counter);

    //Burda resetliyorum
    counter = counter + 100;
    setTimeout(function () {
      theta[0] = 0;
      initNodes(torsoId);
    }, counter + 100);
    //initNodes(torsoId);
    counter = counter + 100;
    setTimeout(function () {
      theta[1] = 0;
      theta[2] = 0;
      initNodes(head1Id);
    }, counter);
    //initNodes(head1Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[3] = 0;
      initNodes(leftUpperLeg1Id);
    }, counter);
    //initNodes(leftUpperLeg1Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[4] = 0;
      initNodes(leftMiddleLeg1Id);
    }, counter);
    //initNodes(leftMiddleLeg1Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[5] = 0;
      initNodes(leftLowerLeg1Id);
    }, counter);
    //initNodes(leftLowerLeg1Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[6] = 0;
      initNodes(leftUpperLeg2Id);
    }, counter);
    //initNodes(leftUpperLeg2Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[7] = 0;
      initNodes(leftMiddleLeg2Id);
    }, counter);
    //initNodes(leftMiddleLeg2Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[8] = 0;
      initNodes(leftLowerLeg2Id);
    }, counter);
    //initNodes(leftLowerLeg2Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[9] = 0;
      initNodes(leftUpperLeg3Id);
    }, counter);
    //initNodes(leftUpperLeg3Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[10] = 0;
      initNodes(leftMiddleLeg3Id);
    }, counter);
    //initNodes(leftMiddleLeg3Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[11] = 0;
      initNodes(leftLowerLeg3Id);
    }, counter);
    //nitNodes(leftLowerLeg3Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[12] = 0;
      initNodes(leftUpperLeg4Id);
    }, counter);
    //initNodes(leftUpperLeg4Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[13] = 0;
      initNodes(leftMiddleLeg4Id);
    }, counter);
    //initNodes(leftMiddleLeg4Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[14] = 0;
      initNodes(leftLowerLeg4Id);
    }, counter);
    //initNodes(leftLowerLeg4Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[15] = 0;
      initNodes(rightUpperLeg1Id);
    }, counter);
    //initNodes(rightUpperLeg1Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[17] = 0;
      initNodes(rightMiddleLeg1Id);
    }, counter);
    //initNodes(rightMiddleLeg1Id);
    counter = counter + 100;
    setTimeout(function () {
      theta[18] = 0;
      initNodes(rightLowerLeg1Id);
    }, counter);
  }

  //initNodes(rightLowerLeg1Id);
  //bunu bütün şeyler için çağırırsanız hepsini updateliyo.
  //aralara da setTimeout(3000) koyarsan delay yapıyor daha yavaş oluyo.
}
//theta[torsoId] =-25;
//render();
//setTimeout(render, 3000);

//---------------------------------------

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //Önemli
  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");

  //ADDED
  colorUniformLocation = gl.getUniformLocation(program, "u_color");

  gl.useProgram(program);

  instanceMatrix = mat4();

  projectionMatrix = ortho(-10.0, 10.0, -10.0, 10.0, -10.0, 10.0);
  modelViewMatrix = mat4();

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "modelViewMatrix"),
    false,
    flatten(modelViewMatrix)
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "projectionMatrix"),
    false,
    flatten(projectionMatrix)
  );

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

  cube();

  tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  document.getElementById("slider0").onchange = function () {
    theta[torsoId] = event.srcElement.value;
    initNodes(torsoId);
  };
  document.getElementById("slider1").onchange = function () {
    theta[head1Id] = event.srcElement.value;
    initNodes(head1Id);
  };

  //LEFT LEG 1 SLIDERS
  document.getElementById("slider2").onchange = function () {
    theta[leftUpperLeg1Id] = event.srcElement.value;
    initNodes(leftUpperLeg1Id);
  };
  document.getElementById("slider3").onchange = function () {
    theta[leftMiddleLeg1Id] = event.srcElement.value;
    initNodes(leftMiddleLeg1Id);
  };
  document.getElementById("slider4").onchange = function () {
    theta[leftLowerLeg1Id] = event.srcElement.value;
    initNodes(leftLowerLeg1Id);
  };
  //LEFT LEG 2 SLIDERS
  document.getElementById("slider5").onchange = function () {
    theta[leftUpperLeg2Id] = event.srcElement.value;
    initNodes(leftUpperLeg2Id);
  };
  document.getElementById("slider6").onchange = function () {
    theta[leftMiddleLeg2Id] = event.srcElement.value;
    initNodes(leftMiddleLeg2Id);
  };
  document.getElementById("slider7").onchange = function () {
    theta[leftLowerLeg2Id] = event.srcElement.value;
    initNodes(leftLowerLeg2Id);
  };
  //LEFT LEG 3 SLIDERS
  document.getElementById("slider8").onchange = function () {
    theta[leftUpperLeg3Id] = event.srcElement.value;
    initNodes(leftUpperLeg3Id);
  };
  document.getElementById("slider9").onchange = function () {
    theta[leftMiddleLeg3Id] = event.srcElement.value;
    initNodes(leftMiddleLeg3Id);
  };
  document.getElementById("slider10").onchange = function () {
    theta[leftLowerLeg3Id] = event.srcElement.value;
    initNodes(leftLowerLeg3Id);
  };
  //LEFT LEG 4 SLIDERS
  document.getElementById("slider11").onchange = function () {
    theta[leftUpperLeg4Id] = event.srcElement.value;
    initNodes(leftUpperLeg4Id);
  };
  document.getElementById("slider12").onchange = function () {
    theta[leftMiddleLeg4Id] = event.srcElement.value;
    initNodes(leftMiddleLeg4Id);
  };
  document.getElementById("slider13").onchange = function () {
    theta[leftLowerLeg4Id] = event.srcElement.value;
    initNodes(leftLowerLeg4Id);
  };

  //RIGHT LEG 1 SLIDERS
  document.getElementById("slider14").onchange = function () {
    theta[rightUpperLeg1Id] = event.srcElement.value;
    initNodes(rightUpperLeg1Id);
  };
  document.getElementById("slider15").onchange = function () {
    theta[rightMiddleLeg1Id] = event.srcElement.value;
    initNodes(rightMiddleLeg1Id);
  };
  document.getElementById("slider16").onchange = function () {
    theta[rightLowerLeg1Id] = event.srcElement.value;
    initNodes(rightLowerLeg1Id);
  };
  //RIGHT LEG 2 SLIDERS
  document.getElementById("slider17").onchange = function () {
    theta[rightUpperLeg2Id] = event.srcElement.value;
    initNodes(rightUpperLeg2Id);
  };
  document.getElementById("slider18").onchange = function () {
    theta[rightMiddleLeg2Id] = event.srcElement.value;
    initNodes(rightMiddleLeg2Id);
  };
  document.getElementById("slider19").onchange = function () {
    theta[rightLowerLeg2Id] = event.srcElement.value;
    initNodes(rightLowerLeg2Id);
  };
  //RIGHT LEG 3 SLIDERS
  document.getElementById("slider20").onchange = function () {
    theta[rightUpperLeg3Id] = event.srcElement.value;
    initNodes(rightUpperLeg3Id);
  };
  document.getElementById("slider21").onchange = function () {
    theta[rightMiddleLeg3Id] = event.srcElement.value;
    initNodes(rightMiddleLeg3Id);
  };
  document.getElementById("slider22").onchange = function () {
    theta[rightLowerLeg3Id] = event.srcElement.value;
    initNodes(rightLowerLeg3Id);
  };
  //RIGHT LEG 4 SLIDERS
  document.getElementById("slider23").onchange = function () {
    theta[rightUpperLeg4Id] = event.srcElement.value;
    initNodes(rightUpperLeg4Id);
  };
  document.getElementById("slider24").onchange = function () {
    theta[rightMiddleLeg4Id] = event.srcElement.value;
    initNodes(rightMiddleLeg4Id);
  };
  document.getElementById("slider25").onchange = function () {
    theta[rightLowerLeg4Id] = event.srcElement.value;
    initNodes(rightLowerLeg4Id);
  };

  for (i = 0; i < numNodes; i++) initNodes(i);

  render();
};

var render = function () {
  gl.clear(gl.COLOR_BUFFER_BIT);
  play_animation();
  traverse(torsoId);
  requestAnimFrame(render);
};
