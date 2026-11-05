import test from 'node:test';
import assert from 'node:assert/strict';
import {richLyricsSchema,richTextToPlainText} from '../lib/richLyrics.js';
const doc={type:'doc',content:[{type:'heading',attrs:{level:2},content:[{type:'text',text:'ভজন'}]},{type:'paragraph',content:[{type:'text',text:'হরে কৃষ্ণ',marks:[{type:'bold'},{type:'italic'}]},{type:'hardBreak'},{type:'text',text:'হরে রাম'}]}]};
test('formatted lyrics preserve Bengali text, verses and line breaks',()=>{assert.equal(richLyricsSchema.safeParse(doc).success,true);assert.equal(richTextToPlainText(doc),'ভজন\n\nহরে কৃষ্ণ\nহরে রাম')});
test('HTML nodes and javascript links cannot enter saved rich lyrics',()=>{assert.equal(richLyricsSchema.safeParse({type:'doc',content:[{type:'script',text:'alert(1)'}]}).success,false);const unsafe=structuredClone(doc);unsafe.content[1].content[0].marks=[{type:'link',attrs:{href:'javascript:alert(1)'}}];assert.equal(richLyricsSchema.safeParse(unsafe).success,false)});
test('oversized text nodes are rejected',()=>{const huge={type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'ক'.repeat(20001)}]}]};assert.equal(richLyricsSchema.safeParse(huge).success,false)});
