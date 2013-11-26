function ShapeParticle(pos, restPos, dir, mappingIndex)
{
	this.pos = pos;
	this.restPos = restPos.clone();
	this.direction = dir.clone();
	this.index = mappingIndex;
	this.displace = 0;
	this.extraVertex = [];

	this.vel = this.direction.clone().multiplyScalar(0.2);

	var color = 0;
	var rad = 5;

	this.update = function()
	{
		var force = mappingData[this.index];

		this.displace += force*0.4;
		this.pos.addVectors(this.restPos, this.direction.clone().multiplyScalar(this.displace));
	}

	this.addExtraVertex = function(revt)
	{
		this.extraVertex.push(vert);
	}

	this.isEquals = function(otherPar)
	{
		return this.restPos.equals(otherPar.restPos);
	}
}