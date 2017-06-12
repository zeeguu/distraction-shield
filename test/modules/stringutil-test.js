import test from 'ava';
import {
  wildcardStrComp
} from './stringutil';

test('stringutil | compare if a string is a substr of another string ', t => {
    let str = "https://www.facebook.com/events/887318548075668/";
    let rule ="facebook";
    let exp1 =  new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
    t.is(wildcardStrComp(str, rule),exp1);
});
