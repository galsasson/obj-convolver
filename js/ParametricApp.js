var renderer = null;
var scene = null;

var controls = null;
var camera = null;

var clock = null;

var animating = true;

var resMgr = null;

var keyPressed = [];

var exporter = {};

var room;
var testObject = null;
var videoScreen = null;
var remote = null;

// mapping between video and forcePerParticle
var nParticles = 0;
var mappingData = [];
var shapeMappingData = [];

var spotLight;
var roomSpotLight;
var screenLight;

//***************************************************************************//
// initialize the renderer, scene, camera, and lights                        //
//***************************************************************************//
function onLoad()
{
    // Grab our container div
    var container = document.getElementById("container");

    // Create the Three.js renderer, add it to our div
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0);
    renderer.shadowMapEnabled = true;
    container.appendChild( renderer.domElement );

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Put in a camera
    camera = new THREE.PerspectiveCamera( 20, 
        window.innerWidth / window.innerHeight, 1, 10000 );
        
    camera.position.set(1115, 373, 1282);
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener( 'change', render );
    // console.log(controls);
    controls.target.set(154, 115, 337);

    // add lights
    initSceneLights();

    // load resources (after all resouces will load, calls populateScene)
    loadResources(populateScene);

    // Add a mouse up handler to toggle the animation
    addInputHandler();
    window.addEventListener( 'resize', onWindowResize, false );

    // add gui
    addGui();

    clock = new THREE.Clock();

    // init keyPressed
    for (var i=0; i<255; i++)
    {
        keyPressed[i] = false;
    }

    // Run our render loop
	run();
}

function loadResources(whenFinished)
{
    resMgr = new ResourceManager();
    resMgr.initMaterials();
    resMgr.loadResources(whenFinished);
}

//***************************************************************************//
// Populate the scene with lights                                            //
//***************************************************************************//
function initSceneLights()
{
    // Create an ambient and a directional light to show off the object
    // var dirLight = [];
    var ambLight = new THREE.AmbientLight( 0x222222 ); // soft white light
    scene.add( ambLight );

    // object spotlight
    spotLight = new THREE.SpotLight(0xFFFFEE, 0.6);
    spotLight.angle = Math.PI/2;
    spotLight.exponent = 30;
    spotLight.position.set(-200, 337, 1015);
    spotLight.target.position.set(-98, 82, 522);
    spotLight.castShadow = true;
    spotLight.shadowCameraFar = 1500;
    // spotLight.shadowCameraVisible = true;
    scene.add(spotLight);

    // screen spotlight
    screenLight = new THREE.SpotLight(0x000000, 1);
    screenLight.angle = 0.12;
    screenLight.exponent = 206;
    screenLight.position.set(0, 361, -1691);
    screenLight.target.position.set(0, -100, 800);
    scene.add(screenLight);



    var spot2 = new THREE.SpotLight(0xffffff, 0.2);
    spot2.angle = Math.PI/2;
    spot2.exponent = 50;
    spot2.position.set(0, 2000, 200);
    spot2.target.position.set(0, 0, 200);
    scene.add(spot2);
}

//***************************************************************************//
// Populate the scene object with our objects                                //
//***************************************************************************//
function populateScene()
{

    room = new Room();
    room.init();
    scene.add(room);

    testObject = new TestObject2();
    testObject.init();
    testObject.position.set(0, 80, 500);
    scene.add(testObject);

    videoScreen = new VideoScreen();
    videoScreen.init();
    videoScreen.position.set(0, 100, -220);
    scene.add(videoScreen);

    remote = new RemoteControl();
    remote.init();
    remote.position.set(88, 25, 435);
    scene.add(remote);

}

function addGui()
{
    var gui = new dat.GUI();
    var f = gui.addFolder('Screen light position');
    f.add(spotLight.position, 'x', -200, 200);
    f.add(spotLight.position, 'y', -100, 1000);
    f.add(spotLight.position, 'z', 0, 2000);
    var f2 = gui.addFolder('Screen light target');
    f2.add(spotLight.target.position, 'x', -100, 100);
    f2.add(spotLight.target.position, 'y', -100, 1000);
    f2.add(spotLight.target.position, 'z', 0, 2000);
    gui.add(spotLight, 'exponent', 0, 1000);
    gui.add(spotLight, 'angle', 0, Math.PI/2);
    gui.add(spotLight, 'shadowCameraFar', 500, 2000);
/*
    var f4 = f1.addFolder('EYE GEOMETRY');
    f4.add(genome, 'eyeRadius', 0, 10).onChange(onGeometryChanged);
    f4.add(genome, 'eyeLidRadius', 0, 13).onChange(onGeometryChanged);
    f4.add(genome, 'topLidAngle', 0, 2*Math.PI).onChange(onGeometryChanged);
    f4.add(genome, 'bottomLidAngle', 0, 2*Math.PI).onChange(onGeometryChanged);

    var f2 = gui.addFolder('TENTACLE GEOMETRY');
    f2.add(genome, 'tentBaseRadius', 0, 20).onChange(onGeometryChanged);
    f2.add(genome, 'numTents', 0, 32).onChange(onGeometryChanged);
    f2.add(genome, 'numJoints', 0, 50).onChange(onGeometryChanged);

    tmpF = f2.addFolder('Joint Scale Vector');
    tmpF.add(genome.jointScaleVector, 'x', 0.7, 1.3).onChange(onGeometryChanged);
    tmpF.add(genome.jointScaleVector, 'y', 0.7, 1.3).onChange(onGeometryChanged);
    tmpF.add(genome.jointScaleVector, 'z', 0.7, 1.3).onChange(onGeometryChanged);
    f2.add(genome, 'numSpikesPerJoint', 0, 10).onChange(onGeometryChanged);
    f2.add(genome, 'spikesArcStart', 0.0, 2*Math.PI).onChange(onGeometryChanged);
    f2.add(genome, 'spikesArcEnd', 0.0, 2*Math.PI).onChange(onGeometryChanged);
    tmpF = f2.addFolder("Spike Scale Vector");
    tmpF.add(genome.spikeScale, 'x', 0.7, 1.3).onChange(onGeometryChanged);
    tmpF.add(genome.spikeScale, 'y', 0.7, 1.3).onChange(onGeometryChanged);
    tmpF.add(genome.spikeScale, 'z', 0.7, 1.3).onChange(onGeometryChanged);
    f2.add(genome, 'tentColorInc', 0, 10).onChange(onGeometryChanged);
    f2.add(genome, 'tentColorBW').onChange(onGeometryChanged);

    var f3 = gui.addFolder('ANIMATION');
    f3.add(genome, 'tentFactor1', 0, 100);
    f3.add(genome, 'tentFactor2', 0, 50);
    f3.add(genome, 'tentFactor3', 0, 50);
    f3.add(genome, 'tentFactor4', 0, 50);

    var f5 = gui.addFolder('GEOMETRY DETAILS');
    f5.add(genome, 'sphereDetail', 0, 40).onChange(onGeometryChanged);
    f5.add(genome, 'cylinderDetail', 0, 40).onChange(onGeometryChanged);
    f5.add(genome, 'eyeDetails', 0, 20).onChange(onGeometryChanged);
*/
}

//***************************************************************************//
// render loop                                                               //
//***************************************************************************//

function run()
{
    var deltaMS = clock.getDelta()*1000;

    render();

    if (animating)
    {
        if (videoScreen) {
            videoScreen.update();
            videoScreen.processVideo();
        }

        if (testObject) {
            testObject.update();
        }
        // console.log("Position: " + camera.position.x + "x" + camera.position.y + "x" + camera.position.z);
        // console.log("Target: " + controls.target.x + "x" + controls.target.y + "x" + controls.target.z);
    }

    // Ask for another frame
    requestAnimationFrame(run);
    controls.update();
}

// Render the scene
function render()
{
    renderer.render(scene, camera);    
}

//***************************************************************************//
// User interaction                                                          //
//***************************************************************************//
function addInputHandler()
{
    var dom = renderer.domElement;
    dom.addEventListener('mouseup', onMouseUp, false);
    dom.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
}

function onKeyDown(evt)
{
    var keyCode = getKeyCode(evt);
    keyPressed[keyCode] = true;

    console.log(keyCode);

    if (keyCode == 32) {
        if (animating) {
            videoScreen.video.pause();
        }
        else {
            videoScreen.video.play();
        }
        animating = !animating;        
    }
    else if (keyCode == 49) // 1
    {
        videoScreen.startLiveVideo();
    }
    else if (keyCode == 50) // 2
    {
        videoScreen.playVideo("videos/bad_romance.mp4");
    }
    else if (keyCode == 51) // 3
    {
        videoScreen.playVideo("videos/xbox_one.mp4");
    }
    else if (keyCode == 52) // 4
    {
        videoScreen.playVideo("videos/computer_graphics.mp4");
    }
    else if (keyCode == 53) // 5
    {
        videoScreen.playVideo("videos/macdonalds.mp4");
    }
    else if (keyCode == 54) // 6
    {
        videoScreen.playVideo("videos/kanye_west.mp4");
    }
    else if (keyCode == 55) // 7
    {
        videoScreen.playVideo("videos/family.MOV");
    }
    else if (keyCode == 69) // 'e'
    {
        // if (keyPressed[keyCode] == false) {
            keyPressed[keyCode] = true;
            // export to STL
            console.log("exporting stl");
            testObject.updateMatrixWorld(true);
            exporter = new THREE.STLExporter();
            exporter.exportScene(testObject);
            exporter.sendToServer();
        // }
    }
}

function onKeyUp(evt)
{
    var keyCode = getKeyCode(evt);

    keyPressed[keyCode] = false;
}

function onMouseDown(event)
{
    event.preventDefault();
}

function onMouseUp(event)
{
    event.preventDefault();
}

function onMouseMove(event)
{
    event.preventDefault();
    if (dragging) {
        var x = prevMouse.x - event.x;
        var y = prevMouse.y - event.y;
        camera.rotation.y -= x/1000;

        prevMouse.x = event.x;
        prevMouse.y = event.y;
    }
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function getKeyCode(evt)
{
    if (window.event != null) 
        return window.event.keyCode;
    else
        return evt.which;
}

function map(i, sStart, sEnd, tStart, tEnd)
{
    var v = i-sStart;
    if (v>=0) {
        if (i < sStart) {
            return tStart;
        } else if (i > sEnd) {
            return tEnd;
        }
    } else {
        if (i > sStart) {
            return tStart;
        } else if (i < sEnd){
            return tEnd;
        }
    }
    var sRange = sEnd - sStart;
    if (sRange == 0) {
        return tStart;
    }

    var tMax = tEnd - tStart;
    return tStart + v / sRange * tMax;
}

function getFuncVal(t)
{
    return new THREE.Vector3(
        Math.sin(t*Math.cos(t)),
        Math.cos(t*Math.sin(t)),
        Math.cos(t*Math.tan(t))
        );
}

function clip(x, bottom, top)
{
    if (!clip) {
        return x;
    }

    if (x < bottom) {
        x = bottom;
    }
    else if (x > top) {
        x = top;
    }

    return x;
}

