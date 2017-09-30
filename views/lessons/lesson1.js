// Toolbox XMLを読み込んで、ユーザーのエリアに表示する
function loadToolbox(toolbox){

  Code.workspace.updateToolbox(toolbox);
  //workspace.updateToolbox(newTree);
  //var workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox});
}

// コードブロックXMLを読み込んで、ユーザーのエリアに表示する
function loadBlocks(code){
  Code.workspace.clear();
  Code.loadBlocks(code);
}

// インストラクションエリアを初期化する
function initInstruction() {
  $("#right-component").html("<div id='instructions'></div>");
}

// インストラクション要素を追加して、一番下にスクロールする
function appendInstruction(p) {
  $("#instructions").append(p);
  $('#right-component').animate({scrollTop: $('#right-component')[0].scrollHeight}, 'fast');
}

// html インストラクションを追加して、一番下にスクロールする
function print(h) {
  appendInstruction($("<p />").html(h));
}

function runNext(func) {
  $("#runButton").off("click");
  $('#runButton').on('click', function () {
    JCODE.clearGroup ('playground');
    Code.runJS();
    if (func) {func();}
  });
}

//////////////////
// 始まり
function lesson_start() {

  initInstruction(); // インストラクションの初期化
  loadToolbox($('#toolbox_all').prop('outerHTML'));

  print(`
  こんにちは、プログラミング<ruby>教育研究所
  <rp>(</rp><rt>きょういくけんきゅうじょ</rt><rp>)</rp></ruby>にようこそ。<br />
  `);
  print(`
  これから色々なオブジェクトを画面のなかでうごかします。<br />
  「はこ」を出すプログラムを用意しましたので、
  実行ボタン（<span style="color:red">赤い[ ▶ ]ボタン</span>）をおしてプログラムを動かしてください。
  `);

  loadBlocks(`
  <xml>
    <variables>
      <variable type="" id="*YKsc]3xQIgK|dKb_Bx.">obj</variable>
    </variables>
    <block type="three_createNew" id="iIe)+8=R%4^l4V-bIA[R" x="13" y="63">
      <field name="VAR" id="*YKsc]3xQIgK|dKb_Bx." variabletype="">obj</field>
      <value name="VALUE">
        <block type="three_typeName">
          <field name="FIELDNAME">box</field>
        </block>
      </value>
    </block>
  </xml>
  `);
  runNext(section2);
}

function section2(){
  print(`
  ハコが出ましたね。<br />
  オブジェクトは、いつも真ん中にでてきますので、おぼえておいてください。<br />
  ヒント：「たま」をだすこともできますよ。<br />
  よければ、
  <button onclick="section3();">次へ進む</button>をクリックしてください。
  `);
  runNext();
}

function section3() {
  print(`
  こんどは、ハコをうごかします。<br />
  「はこ」をうごかすプログラムを用意しましたので、また
  実行ボタンをおしてプログラムを動かしてください。<br />
  数字をかえると、うごく距離がかわるので、ためしてみよう。
  ヒント：マイナスの数字を入れると、後ろにうごきます。<br />
  いろいろやったら、
  <button onclick="section4();">次へ進む</button>をクリックしてください。
  `);
  var obj1 = new JCODE.object3d("box");
  obj1.setOpacity(0.5);
  obj1.moveForward(10);
  
  loadBlocks(`
  <xml>
    <variables>
      <variable type="" id="*YKsc]3xQIgK|dKb_Bx.">obj</variable>
    </variables>
    <block type="three_createNew" id="iIe)+8=R%4^l4V-bIA[R" x="13" y="63">
      <field name="VAR" id="*YKsc]3xQIgK|dKb_Bx." variabletype="">obj</field>
      <value name="VALUE">
        <block type="three_typeName">
          <field name="FIELDNAME">box</field>
        </block>
      </value>
      <next>
        <block type="three_moveForward" id="D-_pM5U9c8JrL%WEld?+">
          <field name="VAR" id="*YKsc]3xQIgK|dKb_Bx." variabletype="">obj</field>
          <value name="VALUE">
            <block type="math_number">
              <field name="NUM">10</field>
            </block>
          </value>
        </block>
      </next>
    </block>
  </xml>
  `);
  runNext();
}
function section4() {
  loadBlocks($('#code_start2').prop('outerHTML'));
  print(`
  こんどは、ハコを右や左に、すきな向きにうごかします。<br />
  たとえば、右にいくには、右にまがってから、前にすすみます。
  また実行ボタンをおしてプログラムを動かしてください。
  ヒント：キーボードの[Ctrl]をおしながら[C]と、[Ctrl]をおしながら[V]で、ブロックをコピー＆ペーストすることができます。<br />
  よければ、
  <button onclick="section5();">次へ進む</button>をクリックしてください。
  `);
  var obj = new JCODE.object3d("box");
  obj.setOpacity(0.5);
  obj.turnRight(90);
  obj.moveForward(20);
  obj.turnRight(90);
  obj.moveForward(20);
  loadBlocks(`
  <xml xmlns="http://www.w3.org/1999/xhtml">
  <variables>
    <variable type="" id="*YKsc]3xQIgK|dKb_Bx.">obj</variable>
  </variables>
  <block type="three_createNew" id="AalM,MMm;@hufL-G=PVE" x="13" y="63">
    <field name="VAR" id="*YKsc]3xQIgK|dKb_Bx." variabletype="">obj</field>
    <value name="VALUE">
      <block type="three_typeName" id="d+LKn(^)ambIiiiReqsP">
        <field name="FIELDNAME">box</field>
      </block>
    </value>
    <next>
      <block type="three_turnRight" id="X:Le5^gVu[{Aan}]e4=J">
        <field name="VAR" id="*YKsc]3xQIgK|dKb_Bx." variabletype="">obj</field>
        <value name="VALUE">
          <block type="three_angle" id="?)cfixviBf1f_+~x2t;D">
            <field name="FIELDNAME">90</field>
          </block>
        </value>
        <next>
          <block type="three_moveForward" >
            <field name="VAR" id="*YKsc]3xQIgK|dKb_Bx." variabletype="">obj</field>
            <value name="VALUE">
              <block type="math_number" id="ZQ-H.v^K[uYPmtv-rb5u">
                <field name="NUM">20</field>
              </block>
            </value>
            <next>
              <block type="three_turnRight">
                <field name="VAR" id="*YKsc]3xQIgK|dKb_Bx." variabletype="">obj</field>
                <value name="VALUE">
                  <block type="three_angle" id="b63+WY.Y5o[2.}*6?EFZ">
                    <field name="FIELDNAME">90</field>
                  </block>
                </value>
                <next>
                  <block type="three_moveForward" >
                    <field name="VAR" id="*YKsc]3xQIgK|dKb_Bx." variabletype="">obj</field>
                    <value name="VALUE">
                      <block type="math_number" id="rApl#,pFyTU:ttV6t]Mq">
                        <field name="NUM">20</field>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>
  `);

}
function section5() {
  loadBlocks($('#code_start2').prop('outerHTML'));
  print(`
  <button onclick="section5();">次へ進む</button>をクリックしてください。
  `);
}
 
// ここから開始します。
$(function(){
  Code.initBlockly($('#toolbox_all').prop('outerHTML'));
  setTimeout("lesson_start()", 1000);  
});
