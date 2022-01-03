import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import OverScene from './scenes/Over';
import Title from "./scenes/Title";

function loadFont(name: string, url: string) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
      document.fonts.add(loaded);
  }).catch(function (error) {
      return error;
  });
}

loadFont('rainy', 'assets/font/rainyhearts.ttf');
loadFont('special', 'assets/font/specialagent.ttf');

new Phaser.Game(
  Object.assign(config, {
    scene: [Title,GameScene, OverScene]
  })
);
