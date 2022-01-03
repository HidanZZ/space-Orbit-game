import Phaser from 'phaser';
import config from '../config';
import Background from '../objects/Background';
import Score from "../objects/Score";

export default class OverScene extends Phaser.Scene {
    private score: number = 0;
    private disabled: boolean = false;
    private background: Background | null = null;
    private scoreBoard: Phaser.GameObjects.Image | null = null;
    private floor: Phaser.GameObjects.TileSprite | null = null;
    private scoreDis: Score | null = null;
    private highscoreDis: Score | null = null;
    private high: string | null = null;
    private url = `https://api-houssein.herokuapp.com/user/`;

    constructor() {
        super('OverScene');
    }

    init(data: {score: number}): void {
        this.score = data.score;
        this.high=localStorage.getItem('highscore')
        var player=localStorage.getItem('telegram')
        if (player && this.score!=0){
            this.postScore(player,this.score)

        }
        if (this.high){
            if (this.score>parseInt(this.high)){
                localStorage.setItem('highscore',this.score.toString())
                this.high=this.score.toString()

            }
        }else {
            localStorage.setItem('highscore',this.score.toString())
            this.high=this.score.toString()


        }

    }

    preload(): void {
        this.load.image('background', 'assets/sprite/background-day-extended.png');
        this.load.image('base', 'assets/sprite/base.png');
    }

    create(): void {
        this.disabled = false;

        // this.scoreBoard = this.add.image(config.scale.width / 2, config.scale.height / 2 -50, 'scoreBoard').setDepth(4);
        var continu = this.add.text(config.scale.width / 2, config.scale.height / 2 +100, 'Click to continue !', {
            fontFamily: 'special',
            fontSize: '70px',
            color: '#FFFFFF',
        }).setDepth(4).setOrigin(0.5)
        this.tweens.add({
            targets: continu,
            yoyo: true,
            scale       : 1.2,
            ease        : 'Linear',
            duration: 1000,
            repeat: -1
        })
        let textScene = this.add.text(config.scale.width /2-10, config.scale.height / 2 -100, 'Score', {
            fontFamily: 'special',
            fontSize: '70px',
            color: '#FFFFFF',
        }).setDepth(4).setOrigin(0.5)
        this.scoreDis = new Score(this, config.scale.width /2-20, config.scale.height / 2 -60);
        this.add.existing(this.scoreDis);
        this.scoreDis.setDepth(5);
        // this.scoreDis.setScale(1);
        this.scoreDis.setScore(this.score);
        // this.highscoreDis = new Score(this, config.scale.width - 50, config.scale.height / 2 -15);
        // this.add.existing(this.highscoreDis);
        // this.highscoreDis.setDepth(5);
        // this.highscoreDis.setScale(0.5);
        // if (this.high) {
        //     this.highscoreDis.setScore(parseInt(this.high));
        // }
        // Add background
        this.cameras.main.fadeIn(500);
        this.background = new Background(this.add)
        this.background.create()

        // Add texts

        // Return to game scene upon click
        this.input.once('pointerdown', () => {
            this.cameras.main.fadeOut(500);
            this.time.addEvent({
                delay: 0,
                callback: () => {
                    if (!this.disabled) {
                        this.disabled = true;
                        this.time.addEvent({
                            delay: 500,
                            callback: () => {
                                this.scene.start('Title');
                            },
                            callbackScope: this
                        })
                    }
                },
                callbackScope: this
            })
        }, this)
    }

    update(time: number, delta: number): void {
        this.background?.update()
    }
    async postScore(player:string, score:number) {
        return new Promise((resolve, reject) => {
            const entry = {score: score};

            fetch(this.url  + player, {
                method: 'PATCH',
                mode: 'cors',
                headers: {'Content-type': 'application/json;charset=UTF-8'},
                body: JSON.stringify(entry),
            })
                .then((result) => {
                    if (result.ok) return result.json();
                    throw new Error('An error ocurred');
                })
                .catch((error) => {
                    reject(error);
                })

        });
    }
}