
$.ajax({
    url: "/home/toolbox.xml",
    type:'GET',
    timeout:10000,
}).done(function(data) {
  // setup Toolbox
  Code.initBlockly(data);
}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
  alert("読み込みに失敗しました。");
});

inst = new JCODE.instruction('こんなふうに、プログラムで、たまを動かしてみよう');

var obj = new JCODE.object3d("sphere");
for (var count = 0; count < 4; count++) {
  obj.moveForward(10);
  obj.turnRight(90);
}