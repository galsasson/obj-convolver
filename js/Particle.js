function Particle(pos, restPos, dir, mappingIndex)
{
	this.pos = pos;
	this.restPos = restPos;
	this.direction = dir.clone();
	this.index = mappingIndex;

	this.length = 0;
	this.acc = 0;
	this.vel = 0;

	var color = 0;
	var rad = 5;

	this.update = function()
	{

		var force = mappingData[this.index]*10;
		this.vel = force;
		this.length += this.vel;

		// friction
		this.length *= 0.8;

		// // clear the force
		// mappingData[this.index] = 0;
		// if (force)
		// {
			// var vel = this.direction.clone().multiplyScalar(5);
			// this.pos.add(this.direction.clone().multiplyScalar(force/50));
			this.pos.addVectors(this.restPos.clone(), this.direction.clone().multiplyScalar(this.length));
		// }

	}	
}