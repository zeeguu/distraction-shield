import test from 'ava';
import {
  stripOfFinalSlash,
  stripOfScheme,
  stripOfPort,
  stripOfFileName,
  stripOfAll
} from './urlFormatter';


test.beforeEach(t => {
  t.context.urlWithPort = "https://www.facebook.com/folder1/folder2/index.html:5000";
  t.context.urlWithFilename = "https://www.facebook.com/folder1/folder2/index.html";
  t.context.url = "https://www.facebook.com/";
  t.context.urlDomainOnly = "www.facebook.com"
  t.context.incompleteUrl = "facebook.com";
  t.context.urlStrippedAll = "www.facebook.com/folder1/folder2";
});

test('BlockedSite | should remove a final slash or leave the url intact', t => {
  let url = t.context.url;
  let lengthBefore = url.length;
  url = stripOfFinalSlash(url);
  let lengthAfter = url.length;
  t.truthy((lengthAfter === lengthBefore - 1) && (url[url.length - 1] !== '/'));

  url = t.context.incompleteUrl;
  lengthBefore = url.length;
  url = stripOfFinalSlash(url);
  lengthAfter = url.length;
  t.truthy((lengthAfter === lengthBefore) && (url[url.length - 1] !== '/'));
});

test('BlockedSite | should remove the scheme (*://) from the url or leave the url intact', t => {
  let url = t.context.url;
  let lengthBefore = url.length;
  url = stripOfScheme(url);
  let lengthAfter = url.length;
  t.truthy((lengthAfter < lengthBefore) && !(/:\/\//.test(url)));

  url = t.context.incompleteUrl;
  lengthBefore = url.length;
  url = stripOfScheme(url);
  lengthAfter = url.length;
  t.truthy((lengthAfter === lengthBefore) && !(/:\/\//.test(url)));
});

test('BlockedSite | should remove the port (:[0-9]{4}) from the url or leave the url intact', t => {
  let url = t.context.urlWithPort;
  let lengthBefore = url.length;
  url = stripOfPort(url);
  let lengthAfter = url.length;
  t.truthy((lengthAfter < lengthBefore) && !(/:[0-9]{4}/.test(url)));

  url = t.context.incompleteUrl;
  lengthBefore = url.length;
  url = stripOfPort(url);
  lengthAfter = url.length;
  t.truthy((lengthAfter === lengthBefore) && !(/:[0-9]{4}/.test(url)));
});

test('BlockedSite | should remove the filename or leave the url intact', t => {
  let url = t.context.urlWithFilename;
  let lengthBefore = url.length;
  url = stripOfFileName(url);
  let lengthAfter = url.length;
  t.truthy((lengthAfter < lengthBefore) && !(/[/]([\w]*\.[\w?=&]*$)/.test(url)));

  url = t.context.incompleteUrl;
  lengthBefore = url.length;
  url = stripOfFileName(url);
  lengthAfter = url.length;
  t.truthy((lengthAfter === lengthBefore) && !(/[/]([\w]*\.[\w?=&]*$)/.test(url)));
});

test('BlockedSite | should return url stripped of all and only the domain', t => {
  let result = stripOfAll(t.context.urlWithFilename);
  t.truthy(result[0] === t.context.urlStrippedAll);
  t.truthy(result[1] === t.context.urlDomainOnly);
});
