

RemoteControl = function()
{
	THREE.Object3D.call(this);

	this.onoff = null;
	this.webcam = null;
	this.buttons = [];
	// TODO: add 9 channels
	this.channels = [{vid:"videos/money_for_nothing.mp4",length:243000},
					 {vid:"videos/different_pulses.mp4",length:270000},
					 {vid:"videos/computer_graphics.mp4", length:60000},
					 {vid:"videos/protection.mp4", length:393000},
					 {vid:"videos/crazy.mp4",length:183000},
					 {vid:"videos/xx.mp4",length:217000},
					 {vid:"videos/goodbye_blue_sky.mp4",length:126000},
					 {vid:"videos/stuck_in_the_middle.mp4",length:207000},
					 ];

	this.videoLength = [
						, ]
}
RemoteControl.prototype = Object.create(THREE.Object3D.prototype);

RemoteControl.prototype.init = function()
{
	// main remote
	var geo = new THREE.CubeGeometry( 15, 2, 60, 2, 1, 3);
	var mesh = new THREE.Mesh(geo, resMgr.materials.black);
	this.add(mesh);

	// on/off buttons
	geo = new THREE.CubeGeometry(5, 1, 4, 1, 1, 1);
	this.onoff = new THREE.Mesh(geo, resMgr.materials.red);
	this.onoff.position.set(-3, 0.7, -25);
	this.add(this.onoff);
	this.onoff.handleMouseDown = function()
	{
		if (this.material.emissive.r == 0)
		{
			this.material.emissive = new THREE.Color(0x552222);
		}
		else {
			this.material.emissive = new THREE.Color(0x0);
		}
		this.position.y -= 0.1;
		videoScreen.toggleOn();
	}
	this.onoff.handleMouseUp = function()
	{
		// this.material.emissive = new THREE.Color(0x0);
		this.position.y += 0.1;
	}

	// channels buttons
	geo = new THREE.CubeGeometry(5, 1, 4, 1, 1, 1);
	for (var i=0; i<8; i++)
	{
		var x = i%2;
		var y = Math.floor(i/2);
		var btn = new THREE.Mesh(geo, resMgr.materials.lightGray.clone());
		btn.position.set(-3 + x*6.2, 0.7, -15 + y*7);
		btn.index = i;
		btn.handleMouseDown = function()
		{
			remote.releaseAll();
			this.material.emissive = new THREE.Color(0x444444);			
			this.position.y -= 0.1;
			videoScreen.setVideoSource(remote.channels[this.index].vid);
		}
		btn.handleMouseUp = function()
		{
			// this.material.emissive = new THREE.Color(0x0);			
			this.position.y += 0.1;
		}
		this.buttons.push(btn);
		this.add(btn);
	}

	// webcam button
	geo = new THREE.CubeGeometry(7, 1, 4, 1, 1, 1);
	this.webcam = new THREE.Mesh(geo, resMgr.materials.green)
	this.webcam.position.set(0, 0.7, 14);
	this.webcam.index = 8;
	this.webcam.handleMouseDown = function()
	{
		remote.releaseAll();
		this.material.emissive = new THREE.Color(0x225522);
		this.position.y -= 0.1;
		videoScreen.setVideoSource("webcam");
	}
	this.webcam.handleMouseUp = function()
	{
		this.position.y += 0.1;
	}
	this.buttons.push(this.webcam);
	this.add(this.webcam);
}

RemoteControl.prototype.releaseAll = function()
{
	// unset all channels
	for (var i=0; i<this.buttons.length; i++)
	{
		this.buttons[i].material.emissive = new THREE.Color(0x0);
	}
	this.webcam.material.emissive = new THREE.Color(0x0);
}