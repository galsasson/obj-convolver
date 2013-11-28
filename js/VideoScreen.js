navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

VideoScreen = function()
{
	this.prevFrame = null;
	THREE.Object3D.call(this);
}
VideoScreen.prototype = Object.create(THREE.Object3D.prototype);

VideoScreen.prototype.init = function()
{
	// create screen object
	var geo = new THREE.CubeGeometry( 320, 200, 10, 1, 1, 1);
	var mesh = new THREE.Mesh(geo, resMgr.materials.screenBack);
	mesh.position.z -= 5.5;
	mesh.castShadow = true;
	this.add(mesh);

	// create screen top and bottom panels
	geo = new THREE.CubeGeometry(320, 4, 2, 1, 1, 1);
	var topPanel = new THREE.Mesh(geo, resMgr.materials.screenBack);
	var bottomPanel = topPanel.clone();
	topPanel.position.y -= 98;
	bottomPanel.position.y += 98;
	this.add(topPanel);
	this.add(bottomPanel);

	// create right and left panels
	geo = new THREE.CubeGeometry(4, 192, 2, 1, 1, 1);
	var leftPanel = new THREE.Mesh(geo, resMgr.materials.screenBack);
	var rightPanel = leftPanel.clone();
	leftPanel.position.x -= 158;
	rightPanel.position.x += 158;
	this.add(leftPanel);
	this.add(rightPanel);

	// init video object
	this.video = document.createElement("video");
	this.video.width = 320;
	this.video.height = 240;
	this.video.autoplay = true;

	// create context to draw the video on
	this.pCanvas = document.createElement("canvas");
	this.pCanvas.width = 160;
	this.pCanvas.height = 120;
	this.pContext = this.pCanvas.getContext("2d");

	// create screen object
	this.videoMaterial = resMgr.materials.black;
	var screenGeo = new THREE.PlaneGeometry( 320, 200, 1, 1 );
	this.screenMesh = new THREE.Mesh(screenGeo, this.videoMaterial);
	this.screenMesh.name = "screen_panel";
	this.add(this.screenMesh);
}

VideoScreen.prototype.startLiveVideo = function()
{
	navigator.getUserMedia({audio: false, video: true}, startVideo, this.noVideo);	
}

VideoScreen.prototype.playVideo = function(filename)
{
	this.video.src = filename;
	this.startPlayback();
}

VideoScreen.prototype.startPlayback = function()
{

	// create video material
	this.videoTexture = new THREE.Texture(this.video);
	this.videoMaterial = new THREE.MeshLambertMaterial( {emissive: 0xffffff, map : this.videoTexture} );

	// recreate the screen (not sure why, but the video is not rendering if I don't do this)
	// remove old screen
	console.log("removing " + this.screenMesh.name);
	this.remove(this.screenMesh);
	var screenGeo = new THREE.PlaneGeometry( 320, 200, 1, 1 );
	this.screenMesh = new THREE.Mesh(screenGeo, this.videoMaterial);
	this.add(this.screenMesh);
}

VideoScreen.prototype.update = function()
{
	if (!this.video) {
		return;
	}

	if (this.video.readyState == this.video.HAVE_ENOUGH_DATA)
	{
		this.videoTexture.needsUpdate = true;
	}
}

VideoScreen.prototype.noVideo = function()
{
	console.log("no video");
}

function startVideo(stream)
{
	videoScreen.stream = stream;
	videoScreen.video.src = URL.createObjectURL(videoScreen.stream);
	videoScreen.startPlayback();
}

VideoScreen.prototype.readFrame = function()
{
  	try {
   		this.pContext.drawImage(this.video, 0, 0, this.pCanvas.width, this.pCanvas.height);
  	}
  	catch (e) {
   		return null;
  	}

  	return this.pContext.getImageData(0, 0, this.pCanvas.width, this.pCanvas.height);
}

VideoScreen.prototype.processVideo = function()
{
	if (!this.video) {
		return;
	}

	if (this.video.readyState != this.video.HAVE_ENOUGH_DATA) {
		return;
	}

	var frame = this.readFrame();

	// direct mapping between video and force
	var nPixels = frame.width*frame.height;
	var parToPix = Math.floor(nPixels / nParticles);
	var screenRed = 0;
	var screenGreen = 0;
	var screenBlue = 0;

	// go through the face particles
	for (var i=0; i<nParticles; i++)
	{
		var pixel = i*parToPix*4;

		var r = frame.data[pixel];
		var g = frame.data[pixel+1];
		var b = frame.data[pixel+2];

		screenRed += r;
		screenGreen += g;
		screenBlue += b;

		if (this.prevFrame) 
		{
			var pr = this.prevFrame.data[pixel];
			var pg = this.prevFrame.data[pixel+1];
			var pb = this.prevFrame.data[pixel+2];

			// Compute the difference of the red, green, and blue values
			var diffR = Math.abs(r - pr);
			var diffG = Math.abs(g - pg);
			var diffB = Math.abs(b - pb);

	      	var diffSum = diffR + diffG + diffB;

			mappingData[i] = diffSum/765;
		}
		else {
			// first frame
			mappingData[i] = 0;
		}
	}

	// now go through all of the shape particles
	var overallDiff = 0;
	var numShapePar = testObject.shapeParticles.length;
	parToPix = Math.floor(nPixels / numShapePar);
	for (var i=0; i<numShapePar; i++)
	{
		var pixel = i*parToPix*4;

		var r = frame.data[pixel];
		var g = frame.data[pixel+1];
		var b = frame.data[pixel+2];

		if (this.prevFrame) 
		{
			var pr = this.prevFrame.data[pixel];
			var pg = this.prevFrame.data[pixel+1];
			var pb = this.prevFrame.data[pixel+2];

			// Compute the difference of the red, green, and blue values
			var diffR = Math.abs(r - pr);
			var diffG = Math.abs(g - pg);
			var diffB = Math.abs(b - pb);

	      	var diffSum = diffR + diffG + diffB;

			shapeMappingData[i] = diffSum/765;
			overallDiff += mappingData[i];
		}
		else {
			// first frame
			shapeMappingData[i] = 0;
		}
	}

	// dont change the shape on cuts
	if (overallDiff > 500) {
		console.log("cut");
		// this might be a cut, don't treat it as movement
		for (var i=0; i<numShapePar; i++)
		{
			shapeMappingData[i] = 0;
		}
	}


	// set screen light color
	screenRed /= nParticles;
	screenGreen /= nParticles;
	screenBlue /= nParticles;
	screenLight.color = new THREE.Color(screenRed<<16 | screenGreen<<8 | screenBlue);

	this.prevFrame = frame;
}
