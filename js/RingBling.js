RingBling = function()
{
	THREE.Object3D.call(this);

	this.ringl = null;
	this.ringr = null;
}
RingBling.prototype = Object.create(THREE.Object3D.prototype);

RingBling.prototype.init = function()
{
	this.ringl = new Ring();
	this.ringl.init();
	this.ringr = new Ring();
	this.ringr.init();
	this.add(this.ringl);
	this.add(this.ringr);
}

RingBling.prototype.updateGeometry = function(that)
{
	that.ringl.updateGeometry(that.ringl);
	that.ringr.updateGeometry(that.ringr);

	// put rings end to end
	that.ringl.position.set(0, 0, that.ringl.stride/2);
	that.ringr.position.set(0, 0, that.ringr.stride/2);
}


RingBling.prototype.update = function()
{
	// update shape
	/*
	for (var i=0; i<this.shapeParticles.length; i++)
	{
		this.shapeParticles[i].update();
	}

	// update extruded triangles
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

	// scale object to a fixed size
	var max = this.getMax();
	var scale = this.size/max;
	this.scale.set(scale, scale, scale);
	reversedScale = max/this.size;

	// console.log(max);
	*/
}

RingBling.prototype.reset = function()
{
	/*
	// update shape
	for (var i=0; i<this.shapeParticles.length; i++)
	{
		shapeMappingData[i] = 0;
		this.shapeParticles[i].reset();
	}

	// update extruded triangles
	for (var i=0; i<this.particles.length; i++)
	{
		mappingData[i] = 0;
		this.particles[i].reset();
	}
	*/
}


RingBling.prototype.extrudeTriangles = function(geo)
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
	}

}

RingBling.prototype.extrudeFace = function(index, faces, vertices)
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

RingBling.prototype.makeIntoNeckless = function()
{
	var torusGeo = new THREE.TorusGeometry( radius, tube, segmentsR, segmentsT, arc );
}

RingBling.prototype.getMax = function()
{
	//var max = new THREE.Vector3(0, 0, 0);
	var max = 0;

	for (var c=0; c<this.children.length; c++)
	{
		var child = this.children[c];
		var verts = child.geometry.vertices;
		for (var i=0; i<verts.length; i++)
		{
			if (Math.abs(verts[i].x) > max) {
				max = Math.abs(verts[i].x);
			}
			if (Math.abs(verts[i].y) > max) {
				max = Math.abs(verts[i].y);
			}
			if (Math.abs(verts[i].z) > max) {
				max = Math.abs(verts[i].z);
			}
		}

		// console.log(maxX);

		// return Math.max(max.x, max.y, max.z);
		return max;
	}
}

RingBling.prototype.toggleFaces = function()
{
	this.showFaces = !this.showFaces;
	for (var i=1; i<this.children.length; i++)
	{
		this.children[i].visible = this.showFaces;
	}
}

RingBling.prototype.toggleFaceMovement = function()
{
	this.showFaceMovement = !this.showFaceMovement;
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



