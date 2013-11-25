function Particle(pos, restPos, dir)
{
	this.pos = pos;
	this.restPos = restPos.clone();
	this.direction = dir.clone();

	this.vel = this.direction.clone().multiplyScalar(0.2);

	var color = 0;
	var rad = 5;

	this.update = function()
	{
	//	this.pos.add(new THREE(.Vector3( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5));
		// this.controlVertex.set(this.restPos.x, this.restPos.y, this.restPos.z);
		this.pos.addVectors(this.restPos, this.direction.clone().multiplyScalar(Math.random()*5));
		//this.controlVertex.add(this.vel);
	}	
}