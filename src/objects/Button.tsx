import Phaser from "phaser";

export default class Button extends Phaser.GameObjects.Container {
    private text: string = '';

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        
    }

    public setText(text: string,fct) {
        let bg=this.scene.add.image(0,0,'new','commonUI/btnMiddle_1').setDepth(this.depth).setInteractive({ useHandCursor: true }).on('pointerdown',fct)
        
        this.text = text;
        this.removeAll(true);
        var temp = `${this.text}`;
        let textScene=this.scene.add.text(0,0,temp,{
            fontFamily:'special',
            fontSize:'50px',
            color:'#FFFFFF',
        }).setDepth(this.depth).setOrigin(0.5);
        this.add([bg,textScene]);
        // for (var i = temp.length - 1; i >= 0; i--) {
        //     let image = this.scene.add.image(-(temp.length - i - 1) * 24, 0, `score${temp[i]}`);
        //     image.setDepth(this.depth);
        //     this.add(image);
        // }
    }

    public getScore(): string { return this.text; }
}