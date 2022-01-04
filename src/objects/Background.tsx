

export default class Background 
{
	constructor(add) {
		this.add = add;
	}
   create(){
	this.bg1 = this.add.tileSprite(0,
		0,
		0,
		0,
		'bg1'
	).setOrigin(0).setScale(0.7)
   }
   update(){
	this.bg1.tilePositionX += 0.2
   }

}