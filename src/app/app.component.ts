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
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  autoScale = true;
  colorScheme = {
    domain: ['#2E3346', '#839FBA', '#EDF5EE', '#985289', '#7B335E']
  };
  fourths = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'F#', 'B', 'E', 'A', 'D', 'G'];

  private keyStats: Array<any>;
  private signatures: Array<any>;
  private times: Array<any>;
  private styles: Array<any>;
  private composers: Array<any>;
  private lengths: Array<any>;
  private densities: Array<any>;
  private diversities: Array<any>;

  constructor() {
    this.keyStats = this.getKeyStats();
    this.signatures = this.getSignatures(this.keyStats);
    this.chords = this.getChords();
    this.times = this.getTimeSignatures();
    this.styles = this.getStyles();
    this.composers = this.getComposers();
    this.lengths = this.getLengths();
    this.densities = [{
      name: 'Chord Density',
      series: this.getDensities()
    }];
    this.diversities = [{
      name: 'Different Chords',
      series: this.getDiversities()
    }];
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

  flattenChords(song) {
    return song.music.measures.reduce((_chords, measure) => {
      return _chords.concat(measure);
    }, []);
  }

  getChords() {
    let chords = [];
    songs.songs.forEach((song) => {
      chords = chords.concat(this.flattenChords(song));
    });
    return this.countPrimitiveValues(chords);
  }

  getStyles() {
    const styles = songs.songs.map((song) => {
      return song.style;
    });
    return this.countPrimitiveValues(styles);
  }

  getComposers() {
    const styles = songs.songs.map((song) => {
      return song.composer;
    });
    return this.countPrimitiveValues(styles);
  }

  getLengths() {
    const lengths = songs.songs.map((song) => {
      return song.music.measures.length;
    });
    return this.countPrimitiveValues(lengths);
  }

  getDensities() {
    //calculates chords/measure density of songs
    const complexities = songs.songs.map((song) => {
      return Math.round(this.flattenChords(song).length / song.music.measures.length * 10) / 10;
    }).sort();
    return this.countPrimitiveValues(complexities);
  }

  getDiversities() {
    //calculates number of different chords per song
    const diversities = songs.songs.map((song) => {
      return this.countPrimitiveValues(this.flattenChords(song)).length;
    }).sort();
    return this.countPrimitiveValues(diversities);
  }

  countPrimitiveValues(array, flip: boolean = false) {
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
    if (flip) {
      values.map((value) => {
        value.name = [value.value, value.name = value.value][0];
      });
    }
    values.sort((a, b) => {
      return a.value > b.value ? -1 : 1;
    });
    return values;
  }
}
