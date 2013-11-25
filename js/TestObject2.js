TestObject2 = function()
{
	this.extrusionFaces = [];
	this.particles = [];
//	this.extrusionLengths = [];
	THREE.Object3D.call(this);
}
TestObject2.prototype = Object.create(THREE.Object3D.prototype);

TestObject2.prototype.init = function()
{
	var geo = new THREE.SphereGeometry(20, 12, 12);
	//var geo = new THREE.CylinderGeometry( 20, 20, 50, 30, 30, false);
	var mesh = new THREE.Mesh(geo, resMgr.materials.object);
	this.add(mesh);
	this.extrudeTriangles(geo);
	mesh.castShadow = true;
	mesh.receiveShadow = false;
}

TestObject2.prototype.update = function()
{
	for (var i=0; i<this.particles.length; i++)
	{
		this.particles[i].update();
	}

	// update normals and positions of the vertices
	for (var i=0; i<this.extrusionFaces.length; i++)
	{
		var face = this.extrusionFaces[i];
		face.geo.computeFaceNormals();
		face.geo.computeVertexNormals();
		face.geo.verticesNeedUpdate = true;
		face.geo.normalsNeedUpdate = true;
	}
}


TestObject2.prototype.extrudeTriangles = function(geo)
{

	var faces = geo.faces;
	var vertices = geo.vertices;

	for (var i=0; i<faces.length; i++)
	{
		var geo = this.extrudeFace(i, faces, vertices);
		var mesh = new THREE.Mesh(geo, resMgr.materials.object);

		//geo.computeFaceNormals();


		mesh.castShadow = true;
		this.add(mesh);
	}

	console.log("number of faces in object: " + this.extrusionFaces.length +
		", number of points: " + this.extrusionFaces.length*3);

}

TestObject2.prototype.extrudeFace = function(index, faces, vertices)
{
	var geo = new THREE.Geometry();

	var face = faces[index];


	var basev1 = vertices[face.a].clone();
	var basev2 = vertices[face.b].clone();
	var basev3 = vertices[face.c].clone();
	var normal = face.normal.clone();

	// dont extrude top and bottom
	// if (Math.abs(normal.y) > 0.99) {
	// 	return;
	// }

	var extrude1 = normal.clone();
	var extrude2 = normal.clone();
	var extrude3 = normal.clone();

//	normal.multiplyScalar(Math.random()*1);

//	extrude1.multiplyScalar(Math.random()*2);
//	extrude2.multiplyScalar(Math.random()*2);
//	extrude3.multiplyScalar(Math.random()*2);

	var extrudedFace = {};
	extrudedFace.v1 = basev1.clone();
	extrudedFace.v2 = basev2.clone();
	extrudedFace.v3 = basev3.clone();
	extrudedFace.normal = normal;
	extrudedFace.geo = geo;
	this.extrusionFaces[index] = extrudedFace;
	this.particles.push(new Particle(extrudedFace.v1, extrudedFace.v1, extrudedFace.normal, index*3));
	this.particles.push(new Particle(extrudedFace.v2, extrudedFace.v2, extrudedFace.normal, index*3+1));
	this.particles.push(new Particle(extrudedFace.v3, extrudedFace.v3, extrudedFace.normal, index*3+2));

	geo.vertices.push(basev1);
	geo.vertices.push(basev2);
	geo.vertices.push(basev3);
	geo.vertices.push(extrudedFace.v1);
	geo.vertices.push(extrudedFace.v2);
	geo.vertices.push(extrudedFace.v3);

	geo.faces.push(new THREE.Face3(0, 1, 2));

	geo.faces.push(new THREE.Face3(3, 2, 0));
	geo.faces.push(new THREE.Face3(2, 3, 5));

	geo.faces.push(new THREE.Face3(1, 5, 4));
	geo.faces.push(new THREE.Face3(1, 2, 5));

	geo.faces.push(new THREE.Face3(1, 4, 0));
	geo.faces.push(new THREE.Face3(0, 4, 3));

	geo.faces.push(new THREE.Face3(3, 4, 5));
	geo.computeFaceNormals();
	geo.dynamic = true;

	return geo;
}

