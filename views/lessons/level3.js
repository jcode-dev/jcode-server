//////////////////
// 手本をうごかす

// 始まり
function clearStudentsGroup(){
  JCODE.clearGroup ("playground",{shape:"sphere", color:'#ff0000', speed:1.2, arrow:"during"});
}

function startLesson() {

  Code.workspace.clear();
  //Code.loadBlocks('');
  BlocklyStorage.restoreBlocks();

  document.getElementById("broadcasting-start1").play();
  print(`
  自由にすきなグラフィックスをつくろう。<br />
  下の「リフレッシュ」ボタンを押すと、すべてのオブジェクトをけして、画面をクリアできます。<br />
  `);
}
