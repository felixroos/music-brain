import { Component } from '@angular/core';
import { songs } from '../assets/songs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  data = [
    {
      'name': 'Germany',
      'value': 8940000
    },
    {
      'name': 'USA',
      'value': 5000000
    },
    {
      'name': 'France',
      'value': 7200000
    }
  ];
  small: any[] = [1280, 768];

  colorScheme = {
    domain: ['#2E3346', '#839FBA', '#EDF5EE', '#985289', '#7B335E']
  };

  keys = songs.songs.map((song) => {
    return song.key;
  });

  fourths = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'F#', 'B', 'E', 'A', 'D', 'G'];

  private keyStats: Array<any>;
  private signatures: Array<any>;

  constructor() {
    this.keyStats = this.getKeyStats();
    this.signatures = this.getSignatures(this.keyStats);
  }

  getKeyStats() {
    const keys = [];
    this.keys.forEach((key) => {
      let k = keys.find(_key => _key.name === key);
      if (!k) {
        k = {
          name: key,
          value: 0
        };
        keys.push(k);
      }
      k.value += 1;
      return keys;
    });
    keys.sort((a, b) => a.value > b.value ? -1 : 1);
    return keys;
  }

  getSignatures(keyStats) {
    const signatures = [];
    keyStats.forEach((key) => {
      const isMinor = key.name.indexOf('-') !== -1;
      const root = key.name.replace('-', '');
      let index = this.fourths.indexOf(root);
      if (isMinor) {
        index = (index + 3) % this.fourths.length;
      }
      let signature = '';
      if (index > 6) {
        index = this.fourths.length - index;
        signature = index + '#';
      } else {
        signature = index + 'b';
      }
      let s = signatures.find(_s => _s.name === signature);
      if (!s) {
        s = {
          name: signature,
          value: 0
        };
        signatures.push(s);
      }
      s.value += key.value;
    });
    signatures.sort((a, b) => {
      return a.value > b.value ? -1 : 1;
    });
    return signatures;
  }
}
