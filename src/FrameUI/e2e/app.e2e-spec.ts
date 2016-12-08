import { FrameUiPage } from './app.po';

describe('frame-ui App', function() {
  let page: FrameUiPage;

  beforeEach(() => {
    page = new FrameUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
