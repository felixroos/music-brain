import { Component } from '@angular/core';
import { songs } from '../assets/songs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css']
})
export class AppComponent {
  chords: any[];
  title = 'app works!';
  small: any[] = [1280, 768];

  colorScheme = {
    domain: ['#2E3346', '#839FBA', '#EDF5EE', '#985289', '#7B335E']
  };
  fourths = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'F#', 'B', 'E', 'A', 'D', 'G'];

  private keyStats: Array<any>;
  private signatures: Array<any>;
  private times: Array<any>;
  private styles: Array<any>;

  constructor() {
    this.keyStats = this.getKeyStats();
    this.signatures = this.getSignatures(this.keyStats);
    this.chords = this.getChords();
    this.times = this.getTimeSignatures();
    this.styles = this.getStyles();
  }

  getKeyStats() {
    const keys = songs.songs.map((song) => {
      return song.key;
    });
    return this.countPrimitiveValues(keys);
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

  getTimeSignatures() {
    const timeSignatures = songs.songs.map((song) => {
      return song.music.timeSignature;
    }); //TODO the data of time signatures is wrong (T44 everywhere)
    return this.countPrimitiveValues(timeSignatures);
  }

  getChords() {
    let chords = [];
    songs.songs.forEach((song) => {
      const songChords = song.music.measures.reduce((_chords, measure) => {
        return _chords.concat(measure);
      }, []);
      chords = chords.concat(songChords);
    });
    return this.countPrimitiveValues(chords);
  }

  getStyles() {
    const styles = songs.songs.map((song) => {
      return song.style;
    });
    return this.countPrimitiveValues(styles);
  }

  countPrimitiveValues(array) {
    const values = [];
    array.forEach((value) => {
      let match = values.find(v => v.name === value);
      if (!match) {
        match = {
          name: value,
          value: 0
        };
        values.push(match);
      }
      match.value += 1;
    });
    values.sort((a, b) => {
      return a.value > b.value ? -1 : 1;
    });
    return values;
  }
}
