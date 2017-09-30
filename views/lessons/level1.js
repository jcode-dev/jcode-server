//////////////////
// 手本をうごかす
function runTeacherCode() {

  JCODE.clearGroup ("tehon");
    var obj = new JCODE.object3d({shape:"sphere", group:"tehon"});
    obj.setColor('#ffffff');
    obj.setSpeed(2);
    obj.setScale(0.9);
    obj.setOpacity(0.5);

    obj.moveForward(20);
}

function loadStudentCode() {
  loadBlocks(`

  <xml xmlns="http://www.w3.org/1999/xhtml">
  <variables>
    <variable type="" id="]Yj0xFn/sW%ut);}:cw)">obj</variable>
  </variables>
  <block type="three_createNew" id="C%T2X^96V{Rzyo6VrgUI" x="38" y="38">
    <field name="VAR" id="]Yj0xFn/sW%ut);}:cw)" variabletype="">obj</field>
    <value name="VALUE">
      <shadow type="three_typeName" id="/Nlzo_D8mX+4M:Z6|Y/2">
        <field name="FIELDNAME">sphere</field>
      </shadow>
    </value>
    <next>
      <block type="three_moveForward" id="Oq@jrX$sLYLV3w$sbw;d">
        <field name="VAR" id="]Yj0xFn/sW%ut);}:cw)" variabletype="">obj</field>
        <value name="VALUE">
          <shadow type="math_number" id="$XS(y">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
    </next>
  </block>
</xml>
  `);
}

// 始まり
function startLesson() {
  document.getElementById("broadcasting-start1").play();
  print(`
    白いたまは、お手本です。<br />
    お手本と同じ所に玉が止まるように、プログラムを直して、  
    下の<i class="material-icons md-18 orange600">play_circle_filled</i>ボタンを押して、プログラムを動かしてください。<br />
    白黒のタイルは、ひとつ10センチの大きさです。<br />
    もう一度、お手本のうごきを見るには <button onclick="runTeacherCode();">ここをクリック</button>して下さい。<br />
  `);
  JCODE.clearGroup ("playground");
  var obj = new JCODE.object3d({shape:"sphere", group:"playground"});

  runTeacherCode();
  loadStudentCode();
  
  nextLesson(function (result) {
    switch (result.points) {
      case result.teachers:
        document.getElementById("people-people-stadium-cheer1").play();
        print(`おめでとうございます。<br />
          次のステージに進みます。
        `);
        startLesson2();
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

function runTeacherCode2(len1, len2, a1) {
  
  JCODE.clearGroup ("tehon");
  var obj = new JCODE.object3d({shape:"sphere", group:"tehon"});
  obj.setColor('#ffffff');
  obj.setSpeed(2);
  obj.setScale(0.9);
  obj.setOpacity(0.5);

  obj.moveForward(len1);
  obj.turnRight(a1);
  obj.moveForward(len1);
  obj.turnRight(a1);
  obj.moveForward(len2);
 
}

function loadStudentCode2() {
  loadBlocks(`

  <xml xmlns="http://www.w3.org/1999/xhtml">
  <variables>
    <variable type="" id="]Yj0xFn/sW%ut);}:cw)">obj</variable>
  </variables>
  <block type="three_createNew" id="C%T2X^96V{Rzyo6VrgUI" x="38" y="38">
    <field name="VAR" id="]Yj0xFn/sW%ut);}:cw)" variabletype="">obj</field>
    <value name="VALUE">
      <shadow type="three_typeName" id="/Nlzo_D8mX+4M:Z6|Y/2">
        <field name="FIELDNAME">sphere</field>
      </shadow>
    </value>
    <next>
      <block type="three_moveForward" id="Oq@jrX$sLYLV3w$sbw;d">
        <field name="VAR" id="]Yj0xFn/sW%ut);}:cw)" variabletype="">obj</field>
        <value name="VALUE">
          <shadow type="math_number" id="$XS(y">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <next>
          <block type="three_turnRight" id="c+)pl6T5;C28RH?c!C:C">
            <field name="VAR" id="]Yj0xFn/sW%ut);}:cw)" variabletype="">obj</field>
            <value name="VALUE">
              <shadow type="three_angle" id="}lTo+Z/T4s5^p^W~]55b">
                <field name="FIELDNAME">90</field>
              </shadow>
            </value>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>
  `);
}

function startLesson2() {
  document.getElementById("broadcasting-start1").play();
  print(`
    こんどは、右にまがるを使って、うごかします。<br />
    お手本と同じ所に玉が止まるように、プログラムを直して、  
    下の<i class="material-icons md-18 orange600">play_circle_filled</i>ボタンを押して、プログラムを動かしてください。<br />
    もう一度、お手本のうごきを見るには <button onclick="runTeacherCode2();">ここをクリック</button>して下さい。<br />
  `);
  JCODE.clearGroup ("playground");
  var obj = new JCODE.object3d({shape:"sphere", group:"playground"});

  runTeacherCode2(20,30,90);
  loadStudentCode2();
  
  nextLesson(function (result) {
    switch (result.points) {
      case result.teachers:
        document.getElementById("people-people-stadium-cheer1").play();
        print(`おめでとうございます。<br />
          次のステージに進みます。
        `);
        startLesson3();
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

var globalPoints = 0;

function startLesson3() {
  document.getElementById("broadcasting-start1").play();
  print(`
    ここからは、コンピュータがたまをてきとうにうごかします。<br />
    １０面クリアしたら、もっと難しいレベルに進もう。<br />
    ちがうお手本を出すには <button onclick="startLesson3();">ここをクリック</button>して下さい。<br />
  `);
  JCODE.clearGroup ("playground");
  var obj = new JCODE.object3d({shape:"sphere", group:"playground"});

  runTeacherCode2((Math.floor(Math.random() * 3) + 1)*10, (Math.floor(Math.random() * 4) + 1)*10, Math.random()<0.5? 90:270);
  
  nextLesson(function (result) {
    switch (result.points) {
      case result.teachers:
        document.getElementById("people-people-stadium-cheer1").play();
        globalPoints++;
        print("おめでとうございます。 " + globalPoints + " 面をクリアしました。");
        startLesson3();
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
