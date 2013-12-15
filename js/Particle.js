function Particle(pos, restPos, dir, mappingIndex)
{
	this.pos = pos;
	this.restPos = restPos;
	this.direction = dir.clone();
	this.index = mappingIndex;

	this.staticLength = 0.2;
	this.length = 0;
	this.acc = 0;
	this.vel = 0;

	var color = 0;
	var rad = 5;

	this.update = function()
	{

		var force = mappingData[this.index]*10;
		
		if (testObject.showFaceMovement) {
			this.vel = force;
		}
		else {
			this.vel = 0;
		}

		this.length += this.vel * reversedScale;
		this.staticLength += mappingData[this.index]/15 * reversedScale;

		// friction
		this.length *= 0.8;

		// // clear the force
		// mappingData[this.index] = 0;
		// if (force)
		// {
			// var vel = this.direction.clone().multiplyScalar(5);
			// this.pos.add(this.direction.clone().multiplyScalar(force/50));
			this.pos.addVectors(this.restPos.clone(), this.direction.clone().multiplyScalar(this.staticLength+this.length));
		// }

	}

	this.reset = function()
	{
		this.staticLength = 0.2;
	}
}
