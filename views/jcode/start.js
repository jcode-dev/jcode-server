inst = new JCODE.instruction();
inst.html('こんにちは、プログラミング<ruby>教育研究所<rp>(</rp><rt>きょういくけんきゅうじょ</rt><rp>)</rp></ruby>にようこそ。<br />');
inst = new JCODE.instruction('こんなふうに、プログラムで、たまを動かしてみよう');

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

var obj = new JCODE.object3d("sphere");
for (var count = 0; count < 4; count++) {
  obj.moveForward(10);
  obj.turnRight(90);
}