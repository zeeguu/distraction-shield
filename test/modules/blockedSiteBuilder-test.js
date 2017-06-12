import test from 'ava';
import { createNewBlockedSite } from './blockedSiteBuilder';
import sinon from 'sinon';

test.todo('test the retrieval of a url and the formatting after that');

// test.before(t => {
//   global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
// });
//
// test('BlockedSiteBuilder | get complete url from hosting server', (t) => {
//   return createNewBlockedSite("facebook.com").then(
//     (blockedSite) => {
//       t.truthy(/http[s]?:[/]{2}([\w]*.)*/.test(blockedSite));
//     }, (error) => console.error(error));
// });
