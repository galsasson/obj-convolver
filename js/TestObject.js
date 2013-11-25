TestObject = function()
{
	this.particles = [];
	THREE.Object3D.call(this);
}
TestObject.prototype = Object.create(THREE.Object3D.prototype);

TestObject.prototype.init = function()
{
	var geo = new THREE.SphereGeometry(20, 32, 32);

	this.initParticles(geo);
	this.putBoxesOnParticles();
}

TestObject.prototype.initParticles = function(geo)
{
	var faces = geo.faces;
	var vertices = geo.vertices;

	// add only unique vertices to points
	var pCount = 0;
	for (var i=0; i<vertices.length-10; i++)
	{
		if (!this.alreadyExists(vertices[i])) {
			var v = vertices[i];
			var d = vertices[i].clone().normalize();
			this.particles[pCount++] = new Particle(v.x, v.y, v.z, d.x, d.y, d.z);
		}
	}
}

TestObject.prototype.putBoxesOnParticles = function()
{
	// put box on every point
	for (var i=0; i<this.particles.length; i++)
	{
		this.particles[i].addAsMesh(this);
	}	
}

TestObject.prototype.alreadyExists = function(vertex)
{
	for (var i=0; i<this.particles.length; i++)
	{
		if (this.particles[i].pos.x == vertex.x &&
			this.particles[i].pos.y == vertex.y &&
			this.particles[i].pos.z == vertex.z) {
			return true;
		}
	}
	return false;		
}

TestObject.prototype.update = function()
{
	var newParticles = [];
	for (var i=0; i<this.particles.length; i++)
	{
		this.particles[i].update();
		if (this.particles.length < 2000) {
			this.particles[i].addNewParticle(newParticles, this);
		}
	}

	for (var i=0; i<newParticles.length; i++)
	{
		this.particles.push(newParticles[i]);
	}

	console.log(newParticles.length);
}

TestObject.prototype.extrudeTriangles = function()
{
//	var geo = new THREE.SphereGeometry(20, 16, 16);
	// var geo = new THREE.CylinderGeometry( 5, 20, 100, 32, 50);
	var geo = this.children[0].geometry;
	var faces = geo.faces;
	var vertices = geo.vertices;

	for (var i=0; i<faces.length; i++)
	{
		var geo = this.extrudeFace(i, faces, vertices);
		var mesh = new THREE.Mesh(geo, resMgr.materials.white);
		this.add(mesh);
	}
}

TestObject.prototype.extrudeFace = function(index, faces, vertices)
{
	var geo = new THREE.Geometry();

	var face = faces[index];

	var v1 = vertices[face.a].clone();
	var v2 = vertices[face.b].clone();
	var v3 = vertices[face.c].clone();
	var normal = face.normal.clone();

	// dont extrude top and bottom
	if (Math.abs(normal.y) > 0.9) {
		return;
	}

	var extrude1 = normal.clone();
	var extrude2 = normal.clone();
	var extrude3 = normal.clone();

	if (Math.random() < index*0.0001) {
		// if (Math.random() < 0.3) {
		// 	normal.multiplyScalar(4+Math.random()*2);		
		// }
		// else {
			normal.multiplyScalar(2+Math.random()*2);		
		// }
	}
	else {
		normal.multiplyScalar(Math.random());
	}

	extrude1.multiplyScalar(Math.random()*1);
	extrude2.multiplyScalar(Math.random()*1);
	extrude3.multiplyScalar(Math.random()*1);

	geo.vertices.push(v1);
	geo.vertices.push(v2);
	geo.vertices.push(v3);
	geo.vertices.push(v1.clone().add(extrude1.add(normal)));
	geo.vertices.push(v2.clone().add(extrude2.add(normal)));
	geo.vertices.push(v3.clone().add(extrude3.add(normal)));

	geo.faces.push(new THREE.Face3(0, 1, 2));

	geo.faces.push(new THREE.Face3(3, 2, 0));
	geo.faces.push(new THREE.Face3(2, 3, 5));

	geo.faces.push(new THREE.Face3(1, 5, 4));
	geo.faces.push(new THREE.Face3(1, 2, 5));

	geo.faces.push(new THREE.Face3(1, 4, 0));
	geo.faces.push(new THREE.Face3(0, 4, 3));

	geo.faces.push(new THREE.Face3(3, 4, 5));
	geo.computeFaceNormals();

	return geo;
}

// function getExtrudedFace(index, mesh)
// {

// 	var geo = new THREE.Geometry();

// 	var face = faces[index];

// 	var v1 = vertices[face.a].clone();
// 	var v2 = vertices[face.b].clone();
// 	var v3 = vertices[face.c].clone();
// 	var normal = face.normal.clone();
// 	normal.multiplyScalar(Math.random()*30+5);

// 	geo.vertices.push(v1);
// 	geo.vertices.push(v2);
// 	geo.vertices.push(v3);
// 	geo.vertices.push(v1.clone().add(normal));
// 	geo.vertices.push(v2.clone().add(normal));
// 	geo.vertices.push(v3.clone().add(normal));

// 	geo.faces.push(new THREE.Face3(0, 1, 2));

// 	geo.faces.push(new THREE.Face3(3, 2, 0));
// 	geo.faces.push(new THREE.Face3(2, 3, 5));

// 	geo.faces.push(new THREE.Face3(1, 5, 4));
// 	geo.faces.push(new THREE.Face3(1, 2, 5));

// 	geo.faces.push(new THREE.Face3(1, 4, 0));
// 	geo.faces.push(new THREE.Face3(0, 4, 3));

// 	geo.faces.push(new THREE.Face3(3, 4, 5));
// 	geo.computeFaceNormals();

// 	return geo;
// }

