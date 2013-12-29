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

var pressedObjects = [];

var reversedScale = 1;

var highRes = true;

var camAngles = [{'x': 88.2, 'y':107.7, 'z':923.8, 'tx':45.5, 'ty':69.9, 'tz':483.5},
                 {'x': 1173.9, 'y':236.6, 'z':1538.5, 'tx':107.2, 'ty':109.7, 'tz':223.7},
                 {'x': 426.9, 'y':178.8, 'z':70.3, 'tx':0, 'ty':80, 'tz':500},
                 {'x': -871.9, 'y':576.4, 'z':1625.6, 'tx':55.8, 'ty':104, 'tz':172.9}
                 ];
var camPosTarget = null;
var camTargetTarget = null;
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
    renderer.shadowMapSoft = true;
    container.appendChild( renderer.domElement );

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Put in a camera
    camera = new THREE.PerspectiveCamera( 20, 
        window.innerWidth / window.innerHeight, 1, 10000 );
        
    camera.position.set(camAngles[0].x, camAngles[0].y, camAngles[0].z);
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener( 'change', render );
    // console.log(controls);
    controls.target.set(camAngles[0].tx, camAngles[0].ty, camAngles[0].tz);

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
    var ambLight = new THREE.AmbientLight( 0x333333 ); // soft white light
    scene.add( ambLight );

    // object spotlight
    spotLight = new THREE.SpotLight(0xFFFFEE, 1);
    spotLight.angle = Math.PI/2;
    spotLight.exponent = 30;
    spotLight.position.set(-200, 337, 1015);
    spotLight.target.position.set(-98, 82, 522);
    spotLight.castShadow = true;
    spotLight.shadowCameraFar = 1500;
    // spotLight.shadowCameraVisible = true;
    scene.add(spotLight);

    // screen spotlight
    screenLight = new THREE.SpotLight(0x000000, 3.5);
    screenLight.angle = 0.27;
    screenLight.exponent = 103;
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
    testObject.rotation.x = Math.PI/2;
    testObject.position.set(0, 80, 500);
    scene.add(testObject);

    videoScreen = new VideoScreen();
    videoScreen.init();
    videoScreen.position.set(0, 120, -280);
    scene.add(videoScreen);

    remote = new RemoteControl();
    remote.init();
    remote.rotation.x = 0.37;
    remote.position.set(120, 29, 560);
    scene.add(remote);

}

function addGui()
{
    // var gui = new dat.GUI();
    // gui.add(screenLight, 'angle', 0, 3.14);
    // gui.add(screenLight, 'exponent', 0, 500);
    // gui.add(screenLight, 'intensity', 0, 4);
    // f.add(remote.position, 'z', 400, 700);
    // gui.add(remote.rotation, 'x', 0, Math.PI/6);
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
    }

    // change camera view angles
    if (camPosTarget != null) {
        camera.position.lerp(camPosTarget, 0.1);
        if (camPosTarget.clone().sub(camera.position).length() < 0.1) {
            camPosTarget = null;
        }
    }
    if (camTargetTarget != null) {
        controls.target.lerp(camTargetTarget, 0.1);
        if (camTargetTarget.clone().sub(controls.target).length() < 0.1) {
            camTargetTarget = null;
        }
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
    else if (keyCode >= 48 &&
             keyCode < 48+camAngles.length) {
        var angle = keyCode-48;
        setCameraAngle(angle);
    }
    else if (keyCode == 67) // 'c'
    {
        console.log(camera.position);
        console.log(controls.target);
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
    else if (keyCode == 70) {   // 'f'
        testObject.toggleFaces();
    }
    else if (keyCode == 77) {   // 'm'
        testObject.toggleFaceMovement();
    }
    else if (keyCode == 82) {   // 'r'
        resetObject();
    }
    else if (keyCode == 65) {   // 'a'
        nextClip();
        nextViewAngle();
    }
}

var currentClip = 0;
var currentViewAngle = 0;

function nextClip()
{
    currentClip++;
    if (currentClip >= 8) {
        currentClip = 0;
    }

    if (videoScreen.on) {
        setTimeout(screenToggle, 0);
    }
    setTimeout(resetObject, 200);
    setTimeout(selectChannel, 400);
    setTimeout(screenToggle, 600);
    setTimeout(nextClip, remote.channels[currentClip].length + 5000);   
}

function nextViewAngle()
{
    setTimeout(function() {setCameraAngle(0);}, 0);
    setTimeout(function() {setCameraAngle(1);}, 20000);
    setTimeout(function() {setCameraAngle(2);}, 40000);
    setTimeout(function() {setCameraAngle(0);}, 50000);
    setTimeout(function() {setCameraAngle(3);}, 60000);
    setTimeout(nextViewAngle, 85000);
}

function setCameraAngle(angle)
{
    camPosTarget = new THREE.Vector3(camAngles[angle].x, camAngles[angle].y, camAngles[angle].z);
    camTargetTarget = new THREE.Vector3(camAngles[angle].tx, camAngles[angle].ty, camAngles[angle].tz);
}

function resetObject()
{
    testObject.reset();
    videoScreen.prevFrame = null;    
}

function screenToggle()
{
    remote.onoff.handleMouseDown();
    remote.onoff.handleMouseUp();
}

function selectChannel()
{
    remote.buttons[currentClip].handleMouseDown();
    remote.buttons[currentClip].handleMouseUp();
}

function onKeyUp(evt)
{
    var keyCode = getKeyCode(evt);

    keyPressed[keyCode] = false;
}

function onMouseDown(event)
{
    event.preventDefault();

    // stop flying
    camPosTarget = null;
    camTargetTarget = null;

    // check intersections with interactive objects
    var vector = new THREE.Vector3(
        ( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
        camera.near);
    var projector = new THREE.Projector();
    projector.unprojectVector( vector, camera );

    var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize(), 0, 2000);
    var intersections = ray.intersectObject(remote, true);
    if (intersections.length == 0) {
        return;
    }

    var object = intersections[0].object;
    if (object.handleMouseDown != null)
    {
        object.handleMouseDown();
        pressedObjects.push(object);        
    }

    // console.log(result);
}

function onMouseUp(event)
{
    event.preventDefault();

    while (pressedObjects.length > 0)
    {
        var obj = pressedObjects.pop();
        if (obj.handleMouseUp != null) {
            obj.handleMouseUp();
        }
    }
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

