//////////////////
// 手本をうごかす

// 始まり

function startLesson() {

  //document.getElementById("broadcasting-start1").play();
  print(`
  自由にすきなグラフィックスをつくろう。<br />
  下の「リフレッシュ」ボタンを押すと、すべてのオブジェクトをけして、画面をクリアできます。<br />
  `);
}

// ここから開始します。
$(function(){
  JCODE.scene.add(JCODE.createFloor());  // 床を書く
  JCODE.scene.add(JCODE.createSkydome());  //スカイドームの利用
  setTimeout(startLesson, 100);  
});

function snow() {

  var geometry = new THREE.Geometry();
  var vertex = new THREE.Vector3(0, 0, 0);
  geometry.vertices.push( vertex );
  for ( i = 0; i < 2000; i ++ ) {
    var vertex = new THREE.Vector3(0, 40, 0);
    geometry.vertices.push( vertex );
  }

  var textureLoader = new THREE.TextureLoader();
  var sprite2 = textureLoader.load( "/three/examples/textures/sprites/snowflake2.png" );
  var material = new THREE.PointsMaterial({
    opacity: 0.9,
    fog: false,
    map:sprite2, 
    size:2,
    blending:THREE.AdditiveBlending, depthTest:true, transparent:true });
  material.color.setHSL( 0.95, 0, 0.8 );

  var particles = new THREE.Points( geometry, material );
  JCODE.scene.add( particles );

  function random2(base, spread)
  {
    return base + ((Math.random() - 0.5) * spread);
  }

  function velocity() {

    var v = geometry.vertices.find(function(x) {
      return !x.velocity;
    });
    if (v) {
      v.x = random2( 0, 80);
      v.y = random2(40, 20);
      v.z = random2( 0, 80);
      v.velocity = new THREE.Vector3(random2(0, 50), random2(-60, 20), random2(0, 50));
    }

  }
  setInterval(velocity, 20);

  function render() {
    
    var delta = 0.001;
    geometry.vertices.forEach(function(v) {
      if (v.velocity) {
        v.x = v.x + (v.velocity.x) * delta;
        v.y = v.y + (v.velocity.y) * delta;
        v.z = v.z + (v.velocity.z) * delta;
        if (v.y < 0.5) {
          //v.y = 40;
          v.velocity.x = 0;
          v.velocity.y = 0;
          v.velocity.z = 0;
        }
      }
    });
    geometry.verticesNeedUpdate = true;

  }
  JCODE.render.push(render);

}

