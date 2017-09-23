inst = new JCODE.instruction();
inst.html('こんにちは、プログラミング<ruby>教育研究所<rp>(</rp><rt>きょういくけんきゅうじょ</rt><rp>)</rp></ruby>にようこそ。<br />');
inst = new JCODE.instruction('この<button>ボタン</button>を押してみて');

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

var obj = new JCODE.obj("pin");
for (var count = 0; count < 3; count++) {
  obj.turnRight(90);
}
