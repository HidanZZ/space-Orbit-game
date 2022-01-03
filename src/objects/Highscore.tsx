import Phaser from "phaser";
import config from '../config';

export default class Highscore extends Phaser.GameObjects.Container {
    // private url: string = '';
    private url = `https://api-houssein.herokuapp.com/user/`;
    private bg :Phaser.GameObjects.Image

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
         this.bg = this.scene.add.image(0,0, 'new', 'battle/circuitPanel_0').setDepth(4).setScale(1.5).setOrigin(0)
         let textScene = this.scene.add.text(this.bg.width *1.5/ 2, this.bg.height*1.5-70, 'Highscores', {
            fontFamily: 'special',
            fontSize: '70px',
            color: '#FFFFFF',
        }).setDepth(4).setOrigin(0.5)
        this.add([this.bg,textScene])

        this.getScores().then((result: any[]) => {
            let prevRank;
            let prevName;
            let prevScore;

            for (let i = 0; i <= 9; i += 1) {
                const {
                    name,
                    score
                } = result[i];
                console.log(result[i]);
                
                const rank = this.rankText((i + 1).toString());
                const name1 = this.nameText(name);
                const scoreN = this.scoreText(score);
                this.add([rank, name1, scoreN])

                if (i >= 1) {
                    rank.y = prevRank.y + 40;
                    name1.y = prevName.y + 40;
                    scoreN.y = prevScore.y + 40;
                }

                prevRank = rank;
                prevName = name1;
                prevScore = scoreN;
            }

           
        });
        
    }

    public setText(text: string,fct) {
        // let bg=this.scene.add.image(0,0,'new','commonUI/btnMiddle_1').setDepth(this.depth).setInteractive({ useHandCursor: true }).on('pointerdown',fct)
        
        // this.text = text;
        // this.removeAll(true);
        // var temp = `${this.text}`;
        // let textScene=this.scene.add.text(0,0,temp,{
        //     fontFamily:'special',
        //     fontSize:'50px',
        //     color:'#FFFFFF',
        // }).setDepth(this.depth).setOrigin(0.5);
        // this.add([bg,textScene]);
        // for (var i = temp.length - 1; i >= 0; i--) {
        //     let image = this.scene.add.image(-(temp.length - i - 1) * 24, 0, `score${temp[i]}`);
        //     image.setDepth(this.depth);
        //     this.add(image);
        // }
    }
    async getScores(): Promise {
        return new Promise((resolve, reject) => {
            var scoreArray = [];

            fetch(this.url, {
                    mode: 'cors'
                })
                .then(result => result.json())
                .catch(error => {
                    reject(error);
                })
                .then((result) => {
                    result.forEach((res) => {
                        const name = res.address
                        const score = res.score
                        scoreArray.push({
                            name,
                            score
                        });
                    });
                    const scoreSorted = scoreArray.sort((a, b) => {
                        a = parseInt(a.score, 10);
                        b = parseInt(b.score, 10);
                        if (a < b) {
                            return 1;
                        }
                        if (a > b) {
                            return -1;
                        }
                        return 0;
                    });

                    resolve(scoreSorted);
                });
        });
    }


    rankText(rank: string) {
        return this.scene.make.text({
            x: 60,
            y:this.bg.height / 4 - 40,
            text: rank + ' - ',
            style: {
                // fontStyle:'strong',
                fontSize: '35px',
                color: '#fff',
                fontFamily: 'special',
            },
        }).setOrigin(0.5, 0.5).setDepth(99);
    }

    nameText(player: string) {
        return this.scene.make.text({
            x: this.bg.width / 2 +100,
            y: this.bg.height / 4 - 40,
            text: player,

            style: {
                // fontStyle:'strong',
                fontSize: '35px',
                color: '#fff',
                fontFamily: 'special',
            },
        }).setOrigin(0.5, 0.5).setDepth(99);
    }

    scoreText(score: string) {
        return this.scene.make.text({
            x: this.bg.width +130,
            y: this.bg.height / 4 - 40,
            text: score,
            style: {
                // fontStyle:'strong',
                fontSize: '35px',
                fill: '#fff',
                fontFamily: 'special',
            },
        }).setOrigin(0.5, 0.5).setDepth(99);
    }
}