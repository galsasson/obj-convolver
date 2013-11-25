function Particle(pos, restPos, dir, mappingIndex)
{
	this.pos = pos;
	this.restPos = restPos.clone();
	this.direction = dir.clone();
	this.index = mappingIndex;

	this.vel = this.direction.clone().multiplyScalar(0.2);

	var color = 0;
	var rad = 5;

	this.update = function()
	{
		var force = mappingData[this.index]/255;
		if (force)
		{
			var vel = this.direction.clone().multiplyScalar(5);
			this.pos.add(this.direction.clone().multiplyScalar(force/50));
		}

//		this.pos.addVectors(this.restPos, this.direction.clone().multiplyScalar(force));
	}	
}