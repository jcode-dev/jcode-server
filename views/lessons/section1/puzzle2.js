
//////////////////
// 手本をうごかす
  function tehon() {

    JCODE.clearGroup ("tehon");
    for (j = 0; j <= 2; j += 1) {
      var obj = new JCODE.object3d({shape:"pin", group:"tehon"});
      obj.setColor('#ff0000');
      obj.setSpeed(1.5);
      obj.setScale(0.9);
      obj.setOpacity(0.5);
      obj.moveForward(10);
      obj.lookUpward(90);
      obj.moveForward(j * 8);
      obj.lookUpward(-90);
    }
  }
  
// 始まり
function lesson_start() {
  document.getElementById("trumpet1").play();
  print(`
  赤いピンは、お手本です。<br />
  お手本と同じ所に玉が止まるように、プログラムを直して、  
  下の<i class="material-icons md-18 orange600">play_circle_filled</i>ボタンを押して、プログラムを動かしてください。<br />
  もう一度、お手本のうごきを見るには <button onclick="tehon();">ここをクリック</button>して下さい。<br />
  `);
  JCODE.clearGroup ("playground");
  var obj = new JCODE.object3d({shape:"pin", group:"playground"});

  tehon();

loadBlocks(`
<xml xmlns="http://www.w3.org/1999/xhtml">
<variables>
  <variable type="" id="CH6nnMYi]S9.Xy7R=$Fx">i</variable>
  <variable type="" id="OBu-_/,/b_t;6Rn%Kg,.">obj</variable>
</variables>
<block type="three_createNew" id="bp1*yxT8-S5U*#al}+m?" x="63" y="63">
  <field name="VAR" id="OBu-_/,/b_t;6Rn%Kg,." variabletype="">obj</field>
  <value name="VALUE">
    <shadow type="three_typeName" id="Uk9loR$O_z3$kg3JzC^R">
      <field name="FIELDNAME">box</field>
    </shadow>
    <block type="three_typeName" id="[{M)=YVidNaQ0.">
      <field name="FIELDNAME">pin</field>
    </block>
  </value>
  <next>
    <block type="three_lookUpward" id="+f]7b80Miz*F(W+([t;K">
      <field name="VAR" id="OBu-_/,/b_t;6Rn%Kg,." variabletype="">obj</field>
      <value name="VALUE">
        <shadow type="three_angle" id="%Gr^nsi:@Q@O!#wq">
          <field name="FIELDNAME">90</field>
        </shadow>
      </value>
      <next>
        <block type="three_moveForward" id="V1{l!dI*d*7v4ZK)#.C@">
          <field name="VAR" id="OBu-_/,/b_t;6Rn%Kg,." variabletype="">obj</field>
          <value name="VALUE">
            <shadow type="math_number" id="Cam/v3p,OP0pH:BPS[9w">
              <field name="NUM">10</field>
            </shadow>
          </value>
        </block>
      </next>
    </block>
  </next>
</block>
</xml>
  `);
  runNext(lesson_start2);
}

function lesson_start2(tokuten) {
  
  switch (tokuten) {
    case 3:
    document.getElementById("people-people-stadium-cheer1").play();
      print(`おめでとうございます。<br />
        次のステージに<a href="/lessons/puzzle3">進むには、ここをクリック</a>して下さい。
      `);
      break;
    case 0:
    document.getElementById("stupid4").play();
      print("プログラムをつかって、見本の白い玉のところに、うごかしてください。");
      break;
      default:
    document.getElementById("boyoyon1").play();
     print("おしい！ " + tokuten + "こ が見本とおなじところにうごきました。");
    break;
  }
}
