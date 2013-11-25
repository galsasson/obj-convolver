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
var testObject = {};
var videoScreen;

// mapping between video and force
var mappingData = [];

var spotLight;
var roomSpotLight;

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
        
    camera.position.set(258, 190, 1087);
    camera.lookAt(-100, 80, 0);
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener( 'change', render );

    // add lights
    initSceneLights();

    // scene specific stuff (add objects)
    populateScene();

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

//***************************************************************************//
// Populate the scene with lights                                            //
//***************************************************************************//
function initSceneLights()
{
    // Create an ambient and a directional light to show off the object
    // var dirLight = [];
    var ambLight = new THREE.AmbientLight( 0x444444 ); // soft white light
    scene.add( ambLight );

    spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.angle = Math.PI/4;
    spotLight.exponent = 30;
    spotLight.position.set(-40, 150, 650);
    spotLight.target.position.set(0, 30, 500);
    spotLight.castShadow = true;
    spotLight.shadowCameraFar = 500;
//    spotLight.shadowCameraVisible = true;
    scene.add(spotLight);


    var spot2 = new THREE.SpotLight(0xffffff, 0.2);
    spot2.angle = Math.PI/2;
    spot2.exponent = 50;
    spot2.position.set(0, 2000, 200);
    spot2.target.position.set(0, 0, 200);
    scene.add(spot2);

    // dirLight[0] = new THREE.DirectionalLight( 0xffffff, 1);
    // dirLight[0].position.set(0, 1, 1);
    // dirLight[1] = new THREE.DirectionalLight( 0xbbbbbb, 1);
    // dirLight[1].position.set(0, -1, -1);

    // scene.add( dirLight[0] );
    // scene.add( dirLight[1] );
}

//***************************************************************************//
// Populate the scene object with our objects                                //
//***************************************************************************//
function populateScene()
{
    resMgr = new ResourceManager();

    // load resources
    resMgr.initMaterials();

    room = new Room();
    room.init();
    scene.add(room);

    testObject = new TestObject2();
    testObject.init();
    testObject.position.set(0, 40, 500);
    scene.add(testObject);

    videoScreen = new VideoScreen();
    videoScreen.init();
    videoScreen.position.set(0, 100, -200);
    scene.add(videoScreen);
}

function addGui()
{
/*
    var gui = new dat.GUI();
    var f1 = gui.addFolder('HEAD GEOMETRY');
    f1.add(genome, 'headBaseRadius', 5, 35).onChange(onGeometryChanged);
    var tmpF = f1.addFolder('Head Scale Vector');
    tmpF.add(genome.headJointsScaleFactor, 'x', 0.7, 1.2).onChange(onGeometryChanged);
    tmpF.add(genome.headJointsScaleFactor, 'y', 0.7, 1.2).onChange(onGeometryChanged);
    tmpF.add(genome.headJointsScaleFactor, 'z', 0.7, 1.2).onChange(onGeometryChanged);
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
var t= -2 * Math.PI;
function run()
{
    var deltaMS = clock.getDelta()*1000;

    render();

    if (animating)
    {
        videoScreen.update();
        videoScreen.processVideo();
        testObject.update();
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
        animating = !animating;        
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

