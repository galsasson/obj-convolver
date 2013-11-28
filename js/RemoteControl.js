

RemoteControl = function()
{
	THREE.Object3D.call(this);

	this.buttons = [];
}
RemoteControl.prototype = Object.create(THREE.Object3D.prototype);

RemoteControl.prototype.init = function()
{
	// main remote
	var geo = new THREE.CubeGeometry( 20, 8, 60, 2, 1, 3);
	var mesh = new THREE.Mesh(geo, resMgr.materials.gray);
	this.add(mesh);

	// on/off buttons
	geo = new THREE.CubeGeometry(8, 4, 4, 1, 1, 1);
	this.buttons[0] = new THREE.Mesh(geo, resMgr.materials.red);
	this.buttons[0].position.set(-4.5, 3.5, -25);
	this.add(this.buttons[0]);

	geo = new THREE.CubeGeometry(5, 4, 4, 1, 1, 1);
	for (var i=0; i<9; i++)
	{
		var x = i%3;
		var y = Math.floor(i/3);
		this.buttons[i+1] = new THREE.Mesh(geo, resMgr.materials.white);
		this.buttons[i+1].position.set(-6 + x*6.2, 3.5, -15 + y*7);
		this.add(this.buttons[i+1]);
	}
}