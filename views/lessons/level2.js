//////////////////
// 手本をうごかす
function clearTeachersGroup(){
  JCODE.clearGroup ("tehon",{shape:"sphere", color:'#ffffff', speed:2, scale:0.9, opacity:0.5, arrow:"always"});
}
function clearStudentsGroup(){
  JCODE.clearGroup ("playground",{shape:"sphere", color:'#ff0000', speed:1.2, arrow:"always"});
}

function runTeacherCode() {
  clearTeachersGroup();
  var obj = new JCODE.object3d({shape:"sphere", group:"tehon"});
  obj.moveForward(20);
}

function loadStudentCode() {
  loadBlocks(`

  <xml xmlns="http://www.w3.org/1999/xhtml">
  <variables>
    <variable type="" id="]Yj0xFn/sW%ut);}:cw)">obj</variable>
    <variable type="" id="_3D%MJ}UJqH7:S|Ah2.2">i</variable>
  </variables>
  <block type="controls_for" id=".fUGvEt3BQ,ma1Z[)fLJ" x="13" y="13">
    <field name="VAR" id="_3D%MJ}UJqH7:S|Ah2.2" variabletype="">i</field>
    <value name="FROM">
      <shadow type="math_number" id="29nQ8Ht%_A~)?ReIP)L]">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <value name="TO">
      <shadow type="math_number" id="}16JUyq4AVag}Mo##Bne">
        <field name="NUM">2</field>
      </shadow>
    </value>
    <value name="BY">
      <shadow type="math_number" id="1}3b*j39VhVZ6}s3mJ^5">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <statement name="DO">
      <block type="three_createNew" id="C%T2X^96V{Rzyo6VrgUI">
        <field name="VAR" id="]Yj0xFn/sW%ut);}:cw)" variabletype="">obj</field>
        <value name="VALUE">
          <shadow type="three_typeName" id="/Nlzo_D8mX+4M:Z6|Y/2">
            <field name="FIELDNAME">sphere</field>
          </shadow>
        </value>
        <next>
          <block type="three_setColor" id="[tfm_*QY;:^FDi77gQ|+">
            <field name="VAR" id="]Yj0xFn/sW%ut);}:cw)" variabletype="">obj</field>
            <value name="VALUE">
              <shadow type="colour_picker" id="K-xr@Cb3f=:Wrj,*urJ;">
                <field name="COLOUR">#ff0000</field>
              </shadow>
              <block type="colour_random" id="H]!CRy@~+B+CnXG@*.[h"></block>
            </value>
            <next>
              <block type="three_turnRight" id="R%ffdw,aK/dr*a{j.Nw=">
                <field name="VAR" id="]Yj0xFn/sW%ut);}:cw)" variabletype="">obj</field>
                <value name="VALUE">
                  <shadow type="three_angle" id="d#z9Ei5JS$|TD8fOPh#W">
                    <field name="FIELDNAME">90</field>
                  </shadow>
                </value>
                <next>
                  <block type="three_moveForward" id="Oq@jrX$sLYLV3w$sbw;d">
                    <field name="VAR" id="]Yj0xFn/sW%ut);}:cw)" variabletype="">obj</field>
                    <value name="VALUE">
                      <shadow type="math_number" id="$XS(y">
                        <field name="NUM">10</field>
                      </shadow>
                      <block type="math_arithmetic" id="2%)eto[qJR.xLh~jntHa">
                        <field name="OP">MULTIPLY</field>
                        <value name="A">
                          <shadow type="math_number" id="qWC~|c:#~izvpJ=4C$},">
                            <field name="NUM">1</field>
                          </shadow>
                          <block type="variables_get" id="v@6/*W3/3e#ofD{M">
                            <field name="VAR" id="_3D%MJ}UJqH7:S|Ah2.2" variabletype="">i</field>
                          </block>
                        </value>
                        <value name="B">
                          <shadow type="math_number" id="VEyD3Jc;{_e0w%zT4Y)C">
                            <field name="NUM">10</field>
                          </shadow>
                        </value>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>

`);
}

var level = 0;

// 始まり
function startLesson() {
  document.getElementById("broadcasting-start1").play();
  print(`
    白いたまは、お手本です。<br />
    お手本と同じ所に玉が止まるように、プログラムを直して、  
    下の「実行」ボタンを押して、プログラムを動かしてください。<br />
    白黒のタイルは、ひとつ10センチの大きさです。<br />
    もう一度、お手本のうごきを見るには <button onclick="runTeacherCode(`+level+`);">ここをクリック</button>して下さい。<br />
  `);
  clearStudentsGroup();
  var obj = new JCODE.object3d({shape:"sphere", group:"playground"});

  loadStudentCode();
  runTeacherCode(level);

  nextLesson(function (result) {
    switch (result.points) {
      case result.teachers:
        document.getElementById("people-people-stadium-cheer1").play();
        print(`おめでとうございます。<br />
          次のステージに進みます。
        `);
        level++;
        setTimeout(startLesson2,3000);
        break;
      case 0:
        document.getElementById("stupid4").play();
        print("プログラムを直して、 " + result.teachers + " こ のお手本のところに、うごかしてください。");
        break;
      default:
        document.getElementById("boyoyon1").play();
        print("おしい！ " + result.points + "こ がお手本とおなじところに うごきました。あと " + (result.teachers - result.points) + "こです。");
        break;
    }
  });
}
function loadBlocks(xml) {
  Code.workspace.clear();
  var xml = Blockly.Xml.textToDom(xml);
  Blockly.Xml.domToWorkspace(xml, Code.workspace);
}
// ここから開始します。
$(function(){
  setTimeout(startLesson, 100);  
});

function runTeacherCode(level) {

  console.log("level",level);
  var list = [
    [1, 0, 1, 2],
    [0, 0, 1, 2],
    [1, 0, 0, 2],
    [0, 0, 0, 2],
    [1, 0, 1, 3],
    [0, 0, 1, 4],
    [1, 0, 0, 3],
    [-2, 0, 1, 4],
    [-3, 0, 1, 5],
    [-3, 0, 1, 5],
    [-3, 0, 1, 5],
    [-3, 0, 1, 5],
    [-3, 0, 1, 5],
    [-3, 0, 1, 5],
    [-3, 0, 1, 5],
  ];

  var list1 = [
    [-3, 0, 1, 5],
  ];

  var l = list[level];

  clearTeachersGroup();

  for (i = 1; i <= l[3]; i++) {
    var obj = new JCODE.object3d({shape:"sphere", group:"tehon"});
    obj.moveForward(((l[0] || i) * 10));
    obj.turnRight((l[2] || i) * 90);
    obj.moveForward(((l[1] || i) * 10));
  }
 
}


function startLesson2() {

  print(`
  白いたまは、お手本です。<br />
  お手本と同じ所に玉が止まるように、プログラムを直して、  
  下の「実行」ボタンを押して、プログラムを動かしてください。<br />
  白黒のタイルは、ひとつ10センチの大きさです。<br />
  もう一度、お手本のうごきを見るには <button onclick="runTeacherCode(`+level+`);">ここをクリック</button>して下さい。<br />
`);
clearStudentsGroup(level);
  var obj = new JCODE.object3d({shape:"sphere", group:"playground"});

  runTeacherCode(level)
  
  nextLesson(function (result) {
    switch (result.points) {
      case result.teachers:
        document.getElementById("people-people-stadium-cheer1").play();
        print(`おめでとうございます。<br />
          次のステージに進みます。
        `);
        level++;
        setTimeout(startLesson2,3000);
        break;
      case 0:
        document.getElementById("stupid4").play();
        print("プログラムを直して、 " + result.teachers + " こ のお手本のところに、うごかしてください。");
        break;
      default:
        document.getElementById("boyoyon1").play();
        print("おしい！ " + result.points + "こ がお手本とおなじところに うごきました。あと " + (result.teachers - result.points) + "こです。");
        break;
    }
  });
}

