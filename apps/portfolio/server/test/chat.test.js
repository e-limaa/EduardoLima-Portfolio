import test from 'node:test';
import assert from 'node:assert/strict';
import { runChat } from '../chat.js';

test('copied Responses tool flow uses stored history and knowledge without real provider traffic',async()=>{
  const originalFetch=globalThis.fetch;
  const originalKey=process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY='synthetic-test-key';
  const requests=[];
  globalThis.fetch=async(url,options)=>{
    assert.equal(url,'https://api.openai.com/v1/responses');
    const payload=JSON.parse(options.body);requests.push(payload);
    return Response.json(requests.length===1?{output:[{type:'function_call',name:'consultar_conhecimento',arguments:'{"query":"designer"}',call_id:'call1'}]}:{output:[{type:'message',content:[{type:'output_text',text:'Sou designer.'}]}]});
  };
  try {
    const output=await runChat({message:'Quem é você?',sessionId:'session123',repository:{history:async()=>[{role:'user',content:'Olá'},{role:'assistant',content:'Oi'}],knowledge:async()=>[{content:'designer senior'}]},signal:new AbortController().signal});
    assert.equal(output,'Sou designer.');
    assert.deepEqual(requests[0].input.map(item=>item.content),['Olá','Oi','Quem é você?']);
    const toolOutput=requests[1].input.find(item=>item.type==='function_call_output');
    assert.equal(toolOutput.call_id,'call1');assert.match(toolOutput.output,/designer senior/);
  } finally {globalThis.fetch=originalFetch;if(originalKey===undefined) delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=originalKey;}
});
test('SSE stream preserves split UTF-8 deltas and CRLF completion at EOF',async()=>{
  const originalFetch=globalThis.fetch;
  const originalKey=process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY='synthetic-test-key';
  const encoder=new TextEncoder();
  const data=encoder.encode('data: '+JSON.stringify({type:'response.output_text.delta',delta:'Olá'})+'\r\n\r\ndata: '+JSON.stringify({type:'response.completed',response:{output:[{type:'message',content:[{type:'output_text',text:'Olá'}]}]}}));
  globalThis.fetch=async()=>new Response(new ReadableStream({start(controller){for(const value of data) controller.enqueue(new Uint8Array([value]));controller.close();}}));
  try {
    const deltas=[];
    const output=await runChat({message:'Oi',sessionId:'session123',context:{history:[],knowledgeRows:[]},repository:{},signal:new AbortController().signal,onDelta:delta=>deltas.push(delta)});
    assert.equal(output,'Olá');assert.deepEqual(deltas,['Olá']);
  } finally {globalThis.fetch=originalFetch;if(originalKey===undefined) delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=originalKey;}
});
