//////////////////
// 手本をうごかす
function runTeacherCode() {

  JCODE.clearGroup ("tehon");
  for (i = 1; i <= 5; i++) {
    var obj = new JCODE.object3d({shape:"sphere", group:"tehon"});
    obj.setColor('#ffffff');
    obj.setSpeed(4);
    obj.setScale(0.9);
    obj.setOpacity(0.5);
    obj.moveForward(-20);
    obj.turnRight(90);
    obj.moveForward(-30);
    obj.moveForward((i * 10));
  }
}

function loadStudentCode() {
  loadBlocks(`
  <xml xmlns="http://www.w3.org/1999/xhtml">
    <variables>
      <variable type="" id="CH6nnMYi]S9.Xy7R=$Fx">i</variable>
      <variable type="" id="OBu-_/,/b_t;6Rn%Kg,.">obj</variable>
    </variables>
    <block type="controls_for" id="6o-RJj+*]!v,wRmG=HPc" x="38" y="38">
      <field name="VAR" id="CH6nnMYi]S9.Xy7R=$Fx" variabletype="">i</field>
      <value name="FROM">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="TO">
        <shadow type="math_number" id=".7~yLj]Q#8|I$JC$qTB#">
          <field name="NUM">5</field>
        </shadow>
      </value>
      <value name="BY">
        <shadow type="math_number" >
          <field name="NUM">1</field>
        </shadow>
      </value>
      <statement name="DO">
        <block type="three_createNew" id="iIe)+8=R%4^l4V-bIA[R">
          <field name="VAR" id="OBu-_/,/b_t;6Rn%Kg,." variabletype="">obj</field>
          <value name="VALUE">
            <block type="three_typeName" id="[{M)=YVidNaQ0.">
              <field name="FIELDNAME">sphere</field>
            </block>
          </value>
          <next>
            <block type="three_moveForward" id="DS,t%=dfW@x-n?6TgknJ">
              <field name="VAR" id="OBu-_/,/b_t;6Rn%Kg,." variabletype="">obj</field>
              <value name="VALUE">
                <block type="math_number" id="$i#%a=5{,|;sL(W#|">
                  <field name="NUM">-10</field>
                </block>
              </value>
              <next>
                <block type="three_turnRight" id="X:Le5^gVu[{Aan}]e4=J">
                  <field name="VAR" id="OBu-_/,/b_t;6Rn%Kg,." variabletype="">obj</field>
                  <value name="VALUE">
                    <block type="three_angle" id="?)cfixviBf1f_+~x2t;D">
                      <field name="FIELDNAME">90</field>
                    </block>
                  </value>
                  <next>
                    <block type="three_moveForward" id="D-_pM5U9c8JrL%WEld?+">
                      <field name="VAR" id="OBu-_/,/b_t;6Rn%Kg,." variabletype="">obj</field>
                      <value name="VALUE">
                        <block type="math_arithmetic" id="1TIGok;}U3tRy=yMOSs}">
                          <field name="OP">MULTIPLY</field>
                          <value name="A">
                            <shadow type="math_number" id="?s~nF8IaZ^F(onoJqp}7">
                              <field name="NUM">1</field>
                            </shadow>
                            <block type="variables_get" id="/U44-0IT8!0su!sbYqkQ">
                              <field name="VAR" id="CH6nnMYi]S9.Xy7R=$Fx" variabletype="">i</field>
                            </block>
                          </value>
                          <value name="B">
                            <shadow type="math_number" id="@_-_QYC*Ir#wq93qn%-8">
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

// 始まり
function startLesson() {
  document.getElementById("broadcasting-start1").play();
  print(`
    白いたまは、お手本です。<br />
    お手本と同じ所に玉が止まるように、プログラムを直して、  
    下の<i class="material-icons md-18 orange600">play_circle_filled</i>ボタンを押して、プログラムを動かしてください。<br />
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
          次のステージに<a href="/lessons/puzzle2">進むには、ここをクリック</a>して下さい。
        `);
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
