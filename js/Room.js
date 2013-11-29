Room = function()
{
	THREE.Object3D.call(this);
}
Room.prototype = Object.create(THREE.Object3D.prototype);

Room.prototype.init = function()
{
	// floor
	var geo = new THREE.PlaneGeometry( 2000, 2000, 60, 60);
	var mesh = new THREE.Mesh(geo, resMgr.materials.walls);
	mesh.rotation.x = -Math.PI/2;
	mesh.position.z += 400;
	mesh.receiveShadow = true;
	mesh.castShadow = false;
	this.add(mesh);

	// back wall
	geo = new THREE.PlaneGeometry( 2000, 600, 20, 20);
	mesh = new THREE.Mesh(geo, resMgr.materials.walls);
	mesh.receiveShadow = true;
	mesh.position.y += 300;
	mesh.position.z -= 300;
	this.add(mesh);

	// left wall
	geo = new THREE.PlaneGeometry( 1400, 600, 20, 20);
	mesh = new THREE.Mesh(geo, resMgr.materials.lightGray);
	mesh.rotation.y = Math.PI/2;
	mesh.position.set(-400, 300, 400);
	this.add(mesh);

	// stool
	geo = new THREE.CubeGeometry( 200, 30, 200, 1, 1, 1);
	mesh = new THREE.Mesh(geo, resMgr.materials.white);
	mesh.position.set(0, 8, 500);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	this.add(mesh);

	// rc stand
	geo = this.getRCStandGeo();
	mesh = new THREE.Mesh(geo, resMgr.materials.rcstand);
	mesh.position.set(120, -30, 560);
	mesh.castShadow = true;
	this.add(mesh);

}

Room.prototype.getRCStandGeo = function()
{
	var geo = new THREE.Geometry();
	geo.vertices.push(new THREE.Vector3(-8, 0, -20));
	geo.vertices.push(new THREE.Vector3(8, 0, -20));
	geo.vertices.push(new THREE.Vector3(8, 0, 20));
	geo.vertices.push(new THREE.Vector3(-8, 0, 20));

	geo.vertices.push(new THREE.Vector3(-8, 65, -20));
	geo.vertices.push(new THREE.Vector3(8, 65, -20));
	geo.vertices.push(new THREE.Vector3(8, 50, 20));
	geo.vertices.push(new THREE.Vector3(-8, 50, 20));

	// geo.faces.push(new THREE.Face3( 0, 1, 2));
	// geo.faces.push(new THREE.Face3( 0, 2, 3));
	geo.faces.push(new THREE.Face3( 2, 7, 3));
	geo.faces.push(new THREE.Face3( 7, 2, 6));
	geo.faces.push(new THREE.Face3( 3, 4, 0));
	geo.faces.push(new THREE.Face3( 3, 7, 4));
	geo.faces.push(new THREE.Face3( 0, 5, 1));
	geo.faces.push(new THREE.Face3( 4, 5, 0));
	geo.faces.push(new THREE.Face3( 1, 6, 2));
	geo.faces.push(new THREE.Face3( 5, 6, 1));
	geo.faces.push(new THREE.Face3( 6, 4, 7));
	geo.faces.push(new THREE.Face3( 6, 5, 4));

	geo.computeFaceNormals();
	geo.computeVertexNormals();

	return geo;
}
