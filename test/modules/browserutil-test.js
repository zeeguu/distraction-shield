import test from 'ava';
import {
  isOpenTab,
  openTabSingleton
} from './browserutil';
import chrome from 'sinon-chrome';

test.before(() => {
  global.chrome = chrome;
  global.chrome.tabs.query.yields([{
      id: 1,
      title: 'Tab 1',
      url: 'https://www.facebook.com'
    },
    {
      id: 2,
      title: 'Tab 2',
      url: 'https://www.9gag.com'
    },
  ]);
});

test('tabutil | should singleton open tab', t => {
  let url = 'https://www.google.com';
  t.truthy(global.chrome.tabs.create.notCalled, 'tabs.create should not be called');
  openTabSingleton(url);

  t.truthy(global.chrome.tabs.query.calledOnce);
  t.truthy(global.chrome.tabs.create.calledOnce, 'tabs.create should be called');


  url = 'https://www.facebook.com';
  openTabSingleton(url);
  t.truthy(global.chrome.tabs.update.calledOnce, 'tabs.update should be called once');

});

test('tabutil | should find the id of an open tab or return false', t => {
  let urlOpenTab = 'https://www.facebook.com';
  let urlNotOpenTab = 'https://www.google.com';

  isOpenTab(urlNotOpenTab, (result) => {
    t.truthy(result === false);
  });
  isOpenTab(urlOpenTab, (result) => {
    t.truthy(result === 1);
  });
});


test.after(() => {
  global.chrome.flush();
});
