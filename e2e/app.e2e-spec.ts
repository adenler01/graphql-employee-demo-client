import { GclientPage } from './app.po';

describe('gclient App', () => {
  let page: GclientPage;

  beforeEach(() => {
    page = new GclientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
