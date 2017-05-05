import { MusicBrainPage } from './app.po';

describe('music-brain App', () => {
  let page: MusicBrainPage;

  beforeEach(() => {
    page = new MusicBrainPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
