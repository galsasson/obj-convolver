

RemoteControl = function()
{
	THREE.Object3D.call(this);

	this.onoff = null;
	this.buttons = [];
	this.channels = ["videos/bad_romance.mp4",
					 "videos/xbox_one.mp4",
					 "videos/computer_graphics.mp4",
					 "videos/macdonalds.mp4",
					 "videos/kanye_west.mp4",
					 "videos/family.MOV"];
}
RemoteControl.prototype = Object.create(THREE.Object3D.prototype);

RemoteControl.prototype.init = function()
{
	// main remote
	var geo = new THREE.CubeGeometry( 20, 8, 60, 2, 1, 3);
	var mesh = new THREE.Mesh(geo, resMgr.materials.lightGray);
	this.add(mesh);

	// on/off buttons
	geo = new THREE.CubeGeometry(5, 4, 4, 1, 1, 1);
	this.onoff = new THREE.Mesh(geo, resMgr.materials.red);
	this.onoff.position.set(-6, 3.5, -25);
	this.add(this.onoff);
	this.onoff.handleMouseDown = function()
	{
		this.material.emissive = new THREE.Color(0x552222);
		this.position.y -= 0.5;
		videoScreen.toggleOn();
	}
	this.onoff.handleMouseUp = function()
	{
		this.material.emissive = new THREE.Color(0x0);
		this.position.y += 0.5;
	}

	geo = new THREE.CubeGeometry(5, 4, 4, 1, 1, 1);
	for (var i=0; i<9; i++)
	{
		var x = i%3;
		var y = Math.floor(i/3);
		this.buttons[i] = new THREE.Mesh(geo, resMgr.materials.white.clone());
		this.buttons[i].position.set(-6 + x*6.2, 3.5, -15 + y*7);
		this.add(this.buttons[i]);
		this.buttons[i].index = i;

		this.buttons[i].handleMouseDown = function()
		{
			this.material.emissive = new THREE.Color(0x444444);			
			this.position.y -= 0.5;
			videoScreen.setVideoSource(remote.channels[this.index]);
		}
		this.buttons[i].handleMouseUp = function()
		{
			this.material.emissive = new THREE.Color(0x0);			
			this.position.y += 0.5;
		}
	}
}