navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

VideoScreen = function()
{
	THREE.Object3D.call(this);
}
VideoScreen.prototype = Object.create(THREE.Object3D.prototype);

VideoScreen.prototype.init = function()
{
	// screen object
	var geo = new THREE.CubeGeometry( 320, 200, 10, 1, 1, 1);
	var mesh = new THREE.Mesh(geo, resMgr.materials.screenBack);
	mesh.position.z -= 5.5;
	this.add(mesh);

	// screen top and bottom panels
	geo = new THREE.CubeGeometry(320, 4, 2, 1, 1, 1);
	var topPanel = new THREE.Mesh(geo, resMgr.materials.screenBack);
	var bottomPanel = topPanel.clone();
	topPanel.position.y -= 98;
	bottomPanel.position.y += 98;
	this.add(topPanel);
	this.add(bottomPanel);

	// right and left panels
	geo = new THREE.CubeGeometry(4, 192, 2, 1, 1, 1);
	var leftPanel = new THREE.Mesh(geo, resMgr.materials.screenBack);
	var rightPanel = leftPanel.clone();
	leftPanel.position.x -= 158;
	rightPanel.position.x += 158;
	this.add(leftPanel);
	this.add(rightPanel);

	navigator.getUserMedia({audio: true, video: true}, startVideo, this.noVideo);
}

VideoScreen.prototype.createScreen = function(stream)
{
	// init the video object
	this.stream = stream;
	this.video = document.createElement("video");
	this.video.width = 320;
	this.video.height = 240;
	this.video.autoplay = true;
	this.video.src = URL.createObjectURL(this.stream);

	// create context to draw the video on
	this.pCanvas = document.createElement("canvas");
	this.pCanvas.width = 160;
	this.pCanvas.height = 120;
	this.pContext = this.pCanvas.getContext("2d");

	// create video material
	this.videoTexture = new THREE.Texture(this.video);
	this.videoMaterial = new THREE.MeshLambertMaterial( {emissive: 0xffffff, map : this.videoTexture} );

	// create screen object
	var screenGeo = new THREE.PlaneGeometry( 320, 200, 1, 1 );
	var screenMesh = new THREE.Mesh(screenGeo, this.videoMaterial);
	this.add(screenMesh);

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
	videoScreen.createScreen(stream);
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

	this.processedData = {};
	var frame = this.readFrame();

	// direct mapping between video and force
	var nPixels = frame.width*frame.height;
	var parToPix = Math.floor(nPixels / nParticles);
	for (var i=0; i<nParticles; i++)
	{
		var pixel = i*parToPix*4;
		mappingData[i] = (frame.data[pixel]+frame.data[pixel+1]+frame.data[pixel+2])/3;
	}
	//mappingData = frame.data;
	// console.log(frame.data[0]);
}


