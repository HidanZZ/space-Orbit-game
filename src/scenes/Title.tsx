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
        for (var i = 0; i <= 9; i++) this.load.image(`score${i}`, `assets/sprite/${i}.png`);
        this.load.image('background', 'assets/sprite/bg5.png');
        this.load.image('base', 'assets/sprite/floorr.png');
        this.load.image('continue', 'assets/sprite/continue.png');
        this.load.image('instruction', 'assets/sprite/struct.png');
        this.load.image('title', 'assets/sprite/Title.png');
        this.load.image('leaderTitle', 'assets/sprite/leader.png');
        this.load.image('sticker', 'assets/sprite/sticker.png');
        this.load.image('pipe', 'assets/sprite/pipe-red.png');
        this.load.image('scoreBoard', 'assets/sprite/scoreboard1.png');
        this.load.image('bird1', 'assets/sprite/dog1.png');
        this.load.image('bird2', 'assets/sprite/dog2.png');
        this.load.image('bird3', 'assets/sprite/dog3.png');
        this.load.image('bird4', 'assets/sprite/dog4.png');
        this.load.image('play', 'assets/sprite/play.png');
        this.load.image('ship', 'assets/atlas/ship.png');
        this.load.image('bg1', 'assets/atlas/bg.jpg');
        this.load.image('logo', 'assets/atlas/logo.jpg');
        this.load.audio('fly', 'assets/audio/Wing.mp3');
        this.load.audio('score', 'assets/audio/Point.mp3');
        this.load.audio('hit', 'assets/audio/Hit.mp3');
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
                console.log("here")
                // if (error) error.destroy()
                localStorage.setItem('telegram', input.value.trim())
                this.scene.start('GameScene');
                // game.state.start("Leaderboard")
            }
        })

        // this.playBtn = this.add.image(config.scale.width / 2, config.scale.height  - 125, 'play').setInteractive({ useHandCursor: true }).setDepth(99).setOrigin(0.5, 0.5)
        //     .on('pointerdown', () => {
        //         var letterNumber = /.*\B@(?=\w{5,64}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/;

        //         if (input?.value.trim() === "") {
        //             this.showError('username cannot be empty')
        //         } else if (!input?.value.match(letterNumber)) {
        //             this.showError('invalid telegram username')
        //         } else {
        //             console.log("here")
        //             // if (error) error.destroy()
        //             localStorage.setItem('telegram', input.value.trim())
        //             this.scene.start('GameScene');
        //             // game.state.start("Leaderboard")
        //         }
        //     })

        this.time.delayedCall(1000, () => {
            
        });
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