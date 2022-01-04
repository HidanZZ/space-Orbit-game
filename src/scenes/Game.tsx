import Phaser from 'phaser';
import config from '../config';
import {BASE_BITMASK, BIRD_BITMASK, DESTROY_BITMASK, POINT_BITMASK} from '../constants';
import Bird from '../objects/Bird';
import Score from '../objects/Score';
import LaserGroup from '../objects/Lasers';
import Background from '../objects/Background';

export default class GameScene extends Phaser.Scene {
    private title: Phaser.GameObjects.Image | null = null;
    private instruction: Phaser.GameObjects.Image | null = null;
    private background: Phaser.GameObjects.TileSprite | null = null;
    private floor: Phaser.GameObjects.TileSprite | null = null;
    private top: MatterJS.BodyType = null;
    private base: any = null;
    private isAlive: boolean = true;
    private isMoving: boolean = true;
    private bird: Bird | null = null;
    private cannonBg: Phaser.GameObjects.Image | null = null;
    private score: Score | null = null;
    private circle: Phaser.Geom.Circle | null = null;
    private group: Phaser.GameObjects.Group | null = null;
    private lasers: Phaser.GameObjects.Group | null = null;
    private spawn: Phaser.Time.TimerEvent| null = null;
    private bg: Background | null = null;
    private movers: Set<MatterJS.BodyType> = new Set();
    private center={};
    private level=0;
    private turn=false;
    constructor() {
        super('GameScene');
    }

    preload(): void {

    }

    create(): void {
        this.center={
            x:this.scale.width/2,
            y:this.scale.height/2,
            radius:this.scale.width/2-50
        };
        // Set fade in
        this.cameras.main.fadeIn(500);
        this.bg=new Background(this.add)
        this.bg.create()
        
        var continu = this.add.text(config.scale.width / 2, config.scale.height / 2 , 'Tap to play', {
            fontFamily: 'special',
            fontSize: '70px',
            color: '#FFFFFF',
        }).setDepth(6).setOrigin(0.5)
        this.tweens.add({
            targets: continu,
            yoyo: true,
            scale       : 1.2,
            ease        : 'Linear',
            duration: 1000,
            repeat: -1
        })

        let overlay=this.add.rectangle(0, 0, config.scale.width, config.scale.height,0x000000).setDepth(5).setOrigin(0).setAlpha(0.5);
        

        this.cannonBg=this.add.image(this.center.x, this.center.y,'new','theme_4/cannon/cannonBg').setOrigin(0.5, 0.5).setScale(2)
        this.add.image(this.center.x, this.center.y,'new','theme_4/cannon/cannon_0').setOrigin(0.5, 0.5)
        this.isAlive = true;
        this.isMoving = false;
        var score = -1;
        this.circle = new Phaser.Geom.Circle(this.center.x, this.center.y, this.center.radius);
        var r3 = this.add.circle(this.center.x, this.center.y, this.center.radius);

        r3.setStrokeStyle(2, 0xbfaa86);

        const t = this.physics.add.group({ key: 'new',frame:'theme_0/point', repeat: 25,setScale:{x:1.3,y:1.3} });

        this.group = this.physics.add.group({createCallback: (go) => {
            go.flipY= true
            // go.body.setSize(go.width * 0.6, go.height * 0.5)
            go.body.setCircle(go.width * 0.3).setOffset(go.width * 0.2,go.width *0.1)

        }});
        this.group.createFromConfig({
          key: 'ship',
          setXY:{ 
            x:400, y:200
          },
          setRotation: { value: Phaser.Math.PI2/2
          }
        });
        
       
        Phaser.Actions.PlaceOnCircle(t.getChildren(), this.circle);
        Phaser.Actions.PlaceOnCircle(this.group.getChildren(), this.circle);

        // Create pipes per time
        this.spawn=this.time.addEvent({
            delay: Phaser.Math.Between(500-((this.level*20)<=400?400:(this.level*20)),1000),
            callback: this.createBullet,
            repeat: -1,
            callbackScope: this
        })

        this.score = new Score(this, config.scale.width /2, 20);
                    this.add.existing(this.score);
                    this.score.setDepth(4);
                    this.score.setScore(0);
        // Click screen event
        this.lasers = new LaserGroup(this);

        this.input.on('pointerdown', () => {
            if (this.isAlive) {
                if (!this.isMoving) {
                    // Start play
                    this.isMoving = true;
                    overlay.setVisible(false);
                    continu.setVisible(false);
                }
               //turn
               this.group?.getChildren().forEach(d=>{
                    d.flipY = this.turn
              })
               
               this.turn=!this.turn
            }
        }, this)
        const collectCollider=this.physics.add.overlap(this.group, t, (object1, object2) => {
            score += 1
            this.score.setScore(score)
            collectCollider.active=false
            this.tweens.add({
                targets     : object2 ,
                scale       : 3,
                alpha:0,
                ease        : 'Linear',
                duration    : 200,
                onComplete:()=> {
            collectCollider.active=true
            object2.destroy()

                }
              });
              
            if(t.getChildren().length==1){
                this.cameras.main.once('camerafadeincomplete',  (camera) =>{
                   this.isMoving = true;
                    this.spawn=this.time.addEvent({
                        delay: Phaser.Math.Between(500-((this.level*20)<=400?400:(this.level*20)),1000),
                        callback: this.createBullet,
                        repeat: -1,
                        callbackScope: this
                    })

                });
                this.level++;
                this.isMoving= false;
                this.lasers.getChildren().forEach((child) =>{
                    child.body.reset(-100,-100)
                })
                this.spawn.destroy();
                this.cameras.main.fadeIn(400,255,255,255);
                t.createFromConfig({ key: 'new',frame:'theme_0/point', repeat: 25 ,setScale:{x:1.3,y:1.3}})
        Phaser.Actions.PlaceOnCircle(t.getChildren(), this.circle);

            }
            
        })
        const collider=this.physics.add.overlap(this.group,this.lasers,()=>{
           this.isAlive = false
           this.isMoving = false;
          collider.destroy()
         collectCollider.active=false
        this.tweens.add({
            targets     : this.group.getChildren() ,
            scale       : 10,
            alpha:0,
            ease        : 'Linear',
            duration    : 500,
            onComplete:()=>{
                this.cameras.main.fadeOut(1000,0,0,0);
                this.cameras.main.once('camerafadeoutcomplete',  (camera) =>{
                    this.scene.start('OverScene',{score:this.score?.getScore()});
                 });
            }
          });
            
        })

    }

    update(time: number, delta: number): void {
        this.bg?.update()
        if(this.isAlive){
            if(this.isMoving){
                this.group?.getChildren().forEach(d=>{
                    d.rotation=d.rotation+(this.turn?0.015:-0.015)
                    this.cannonBg.rotation+=(this.turn?0.015:-0.015)
                  })
                  
                    Phaser.Actions.RotateAroundDistance(this.group?.getChildren(), { x: this.center.x, y: this.center.y }, this.turn?0.015:-0.015, this.circle?.radius);
            }
        }
        
        
  
          
    }

    createBullet() {
        if(this.isMoving){
            this.group?.getChildren().forEach(d=>{
                
             this.lasers.fireLaser(this.center.x, this.center.y,d.rotation,this.turn);
           })
           
            this.spawn.reset({ delay: Phaser.Math.Between(500-((this.level*20)>=400?400:(this.level*20)),1000), callback: this.createBullet, callbackScope: this, repeat: 1});
        }
        


    }

   
}
