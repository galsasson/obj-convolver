

RemoteControl = function()
{
	THREE.Object3D.call(this);

	this.buttons = [];
}
RemoteControl.prototype = Object.create(THREE.Object3D.prototype);

RemoteControl.prototype.init = function()
{
	// main remote
	var geo = new THREE.CubeGeometry( 10, 5, 30, 2, 1, 3);
	var mesh = new THREE.Mesh(geo, resMgr.materials.gray);
	this.add(mesh);

	// buttons

}