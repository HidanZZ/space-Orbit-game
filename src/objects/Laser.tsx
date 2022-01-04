import Phaser from "phaser";
import config from '../config';

export default class Laser extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'bullet');
		this.createAnims()
        this.anims.play('shoot',true)
		this.game = scene
	}
	fire(x, y,rot,turn) {
		this.body.reset(x, y);
		// this.body.setSize(this.width*0.6, this.height*0.8);
		this.body.setCircle(this.width * 0.2).setOffset(this.width * 0.3,this.width * 0)
		this.setScale(1.5)
		this.setActive(true);
		this.setVisible(true);
		const rand=rot+Phaser.Math.PI2/2+ (!turn? Phaser.Math.Between(-1000*Phaser.Math.PI2/8,0)/1000:Phaser.Math.Between(0,1000*Phaser.Math.PI2/8)/1000)
		// this.body.rotation = rand;
		this.rotation=rand
		this.game.physics.velocityFromRotation( rand,400 ,
			this.body.velocity)
		console.log('rot',1*Phaser.Math.PI2/16);
			
		// this.setVelocityY(-500);
	}
	createAnims(){
        this.anims.create({
            key: 'shoot',
            frames: this.anims.generateFrameNumbers('bullet', {

                start: 0,
                end: 4,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }
	preUpdate(time, delta) {
		super.preUpdate(time, delta);
 
		if (this.y <= 0 || this.y >= config.scale.height || this.x >= config.scale.width || this.x<= 0) {
			this.setActive(false);
			this.setVisible(false);
		}
	}
}