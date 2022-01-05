import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  // backgroundColor: '#33A5E7',
  scale: {
    width: 700,
    height: 1000,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  dom: {
    createContainer: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};
