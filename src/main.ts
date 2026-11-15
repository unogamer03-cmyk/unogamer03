import Phaser from 'phaser';
import { buildFishTextures, FISH_ART } from './art/fishArt';

class Preview extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor('#0b3a6e');
    buildFishTextures(this);
    FISH_ART.forEach((s, i) => {
      this.add.sprite(200 + (i % 4) * 380, 160 + Math.floor(i / 4) * 260, s.key).play(`${s.key}_swim`);
    });
    this.add.sprite(800, 720, 'shark').play('shark_swim');
  }
}
new Phaser.Game({ type: Phaser.AUTO, width: 1600, height: 900, parent: 'game', scene: [Preview] });
document.getElementById('boot')?.remove();
