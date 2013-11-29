TestObject2 = function()
{
	THREE.Object3D.call(this);

	this.extrusionFaces = [];
	this.particles = [];
	this.shapeParticles = [];
}
TestObject2.prototype = Object.create(THREE.Object3D.prototype);

TestObject2.prototype.init = function()
{
	this.geo = new THREE.OctahedronGeometry( 20, 2 );
	// this.geo = new THREE.TetrahedronGeometry( 20, 3 );
	// this.geo = new THREE.SphereGeometry(20, 12, 12);
	// this.geo = new THREE.CylinderGeometry( 20, 20, 50, 18, 18, false);
	// this.geo = new THREE.CubeGeometry( 20, 20, 20, 12, 12, 12);
	// this.geo = new THREE.PlaneGeometry( 40, 40, 12, 12 );
	var mesh = new THREE.Mesh(this.geo, resMgr.materials.object);
	this.add(mesh);
	this.extrudeTriangles(this.geo);
	mesh.castShadow = true;
	mesh.receiveShadow = false;

	console.log("number of faces in object: " + this.extrusionFaces.length +
		", number of points: " + this.extrusionFaces.length*3);
	console.log("number of shape particles: " + this.shapeParticles.length);
	console.log("number of face particles: " + this.particles.length);
}

TestObject2.prototype.update = function()
{
	for (var i=0; i<this.shapeParticles.length; i++)
	{
		this.shapeParticles[i].update();		
	}

	for (var i=0; i<this.particles.length; i++)
	{
		this.particles[i].update();
	}

	this.geo.computeFaceNormals();
	this.geo.computeVertexNormals();
	this.geo.verticesNeedUpdate = true;
	this.geo.normalsNeedUpdate = true;


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

	// create shape particles
	var index=0;
	for (var i=0; i<vertices.length; i++)
	{
		// if the same vertex was already added to a different particle get its index
		var vert = vertices[i];
		var added = false;
		for (var j=0; j<this.shapeParticles.length; j++) {
			if (equals(vert, this.shapeParticles[j].restPos)) {
				this.shapeParticles[j].addVertex(vert);
				added = true;
				//index = this.shapeParticles[j].index;
			}
		}
		if (!added) {
			var par = new ShapeParticle(vert, vert.clone().normalize(), index++);	// (restPos, direction, mapping index)
			par.addVertex(vert);
			this.shapeParticles.push(par);
		}
	}

	for (var i=0; i<faces.length; i++)
	{
		var geo = this.extrudeFace(i, faces, vertices);
		var mesh = new THREE.Mesh(geo, resMgr.materials.object);
		mesh.castShadow = true;
		this.add(mesh);
	}

	for (var i=0; i<this.extrusionFaces.length*3; i++)
	{
		mappingData[i] = 0;
		staticExtrusion[i] = 2;
	}

}

TestObject2.prototype.extrudeFace = function(index, faces, vertices)
{
	var geo = new THREE.Geometry();

	var face = faces[index];

	var basev1 = vertices[face.a];
	var basev2 = vertices[face.b];
	var basev3 = vertices[face.c];
	var normal = face.normal.clone();

	// if the same vertex was already added to a different particle get its index
	var index1=index*3;
	var index2=index*3+1;
	var index3=index*3+2;

	var extrudedFace = {};
	extrudedFace.v1 = basev1.clone();
	extrudedFace.v2 = basev2.clone();
	extrudedFace.v3 = basev3.clone();
	extrudedFace.normal = normal;
	extrudedFace.geo = geo;
	this.extrusionFaces[index] = extrudedFace;
	this.particles.push(new Particle(extrudedFace.v1, basev1, extrudedFace.normal, index*3));
	this.particles.push(new Particle(extrudedFace.v2, basev2, extrudedFace.normal, index*3+1));
	this.particles.push(new Particle(extrudedFace.v3, basev3, extrudedFace.normal, index*3+2));
	nParticles += 3;

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

function equals(v1, v2)
{
	if (Math.abs(v1.x - v2.x) < 0.001 &&
		Math.abs(v1.y - v2.y) < 0.001 &&
		Math.abs(v1.z - v2.z) < 0.001) {
		return true;
	}
	else {
		return false;
	}
}

