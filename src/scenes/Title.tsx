import Phaser from 'phaser';
import config from '../config';
import Background from '../objects/Background';
import Button from '../objects/Button';
import Highscore from '../objects/Highscore';
import Score from "../objects/Score";

export default class Title extends Phaser.Scene {
    private score: number = 0;
    private disabled: boolean = false;
    private background: Background | null = null;
    private title: Phaser.GameObjects.Image | null = null;
    // private floor: Phaser.GameObjects.TileSprite | null = null;
    private playBtn: Phaser.GameObjects.Image | null = null;
    private error: Phaser.GameObjects.Text | null = null;
    private sub: Phaser.GameObjects.Text | null = null;
    private highVisible: boolean = false;
    constructor() {
        super('Title');
    }



    preload(): void {
       
        this.load.image('ship', 'assets/atlas/ship.png');
        this.load.image('bg1', 'assets/atlas/bg.jpg');
        this.load.image('logo', 'assets/atlas/logo.jpg');
        this.load.atlas('new', 'assets/atlas/atlas_0.png', 'assets/atlas/atlas_0.json')
        this.load.spritesheet('bullet', 'assets/atlas/bullet.png', {
            frameWidth: 64,
            frameHeight: 32
        });

    }

    create(): void {
        // this.disabled = false;
        
        // Set fade in
        this.highVisible=false;
        
        var sticker = this.add.image(config.scale.width / 2, config.scale.height / 2 , 'logo').setDepth(4).setScale(0.5).setOrigin(0.5);
        sticker.alpha = 0.8
        
        this.cameras.main.fadeIn(500);
        this.background = new Background(this.add)
        this.background.create()
        // this.add.image(500,200,'new','battle/btnCreate_0')

        // Add base
        // this.floor=this.add.tileSprite(0,config.scale.height,800,112,'base')
        if (navigator.userAgent.indexOf("Firefox") > 0) {
            this.add.image(config.scale.width / 2, config.scale.height*2 /3, 'new', 'battle/themePanel_1').setScale(3,1.3).setDepth(4)
             this.add.text(config.scale.width / 2, config.scale.height*2 /3-40, 'We\'re sorry !', {
                fontFamily: 'special',
                fontSize: '50px',
                color: '#FFFFFF',
            }).setDepth(4).setOrigin(0.5)
            this.add.text(config.scale.width / 2, config.scale.height*2 /3+30, 'This browser isn\'t supported yet !', {
                fontFamily: 'special',
                fontSize: '40px',
                color: '#FFFFFF',
            }).setDepth(4).setOrigin(0.5)
        }else{
            const element = this.add.dom(config.scale.width / 2, config.scale.height - 350).createFromHTML('<input class="playerInput" type="text" placeholder="Your Username" name="player">', 'form').setDepth(4);
        const input = document.querySelector('input');
        if (localStorage.getItem('telegram')) {
            input.value = localStorage.getItem('telegram');
        }
        input.addEventListener('focus', () => {
            if (this.error) this.error.destroy()
        })
        let play = new Button(this, config.scale.width / 2, config.scale.height - 220).setDepth(4)
        this.add.existing(play)
        let high = new Highscore(this, config.scale.width / 14, config.scale.height/8).setDepth(99).setVisible(this.highVisible)
        this.add.existing(high)
        let highBtn = new Button(this, config.scale.width / 2, config.scale.height - 120).setDepth(4)
        this.add.existing(highBtn)
        highBtn.setText('Highscore',()=>{
            this.highVisible=!this.highVisible
            high.setVisible(this.highVisible)
            element.setVisible(!this.highVisible)
        })
        play.setText('Play', () => {
            var letterNumber = /.*\B@(?=\w{5,64}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/;

            if (input?.value.trim() === "") {
                this.showError('username cannot be empty')
            } else if (!input?.value.match(letterNumber)) {
                this.showError('invalid telegram username')
            } else {
                // if (error) error.destroy()
                localStorage.setItem('telegram', input.value.trim())
                this.scene.start('GameScene');
                // game.state.start("Leaderboard")
            }
        })

        }
        
      
    }
    // var error = undefined

    showError(text: string) {
        if (this.error) this.error.destroy()
        this.error = this.add.text(config.scale.width / 2, config.scale.height - 35, text, {
            // resolution: 2,
            fontStyle: 'strong',
            font: '36px special',
            color: '#b11313',
        }).setDepth(5).setScale(1).setOrigin(0.5);


    }

    update(time: number, delta: number): void {
        this.background?.update()

    }
    
}