import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { donationRequestApi, fetchOfficialExchangeRates } from './scripts/server.js';

export default defineConfig({plugins:[react(),localExchangeRates(),localDonations(),localAnalytics()]});

function localExchangeRates(){
  return {name:'yedirenk-local-exchange-rates',configureServer(server){
    server.middlewares.use('/api/exchange-rates',async(req,res)=>{
      res.setHeader('Content-Type','application/json; charset=utf-8');
      res.setHeader('Cache-Control','no-store');
      if(req.method!=='GET'){res.statusCode=405;res.end(JSON.stringify({message:'Yöntem desteklenmiyor.'}));return}
      try{res.end(JSON.stringify(await fetchOfficialExchangeRates()))}
      catch(error){res.statusCode=503;res.end(JSON.stringify({message:error instanceof Error?error.message:'Resmî döviz kurları alınamadı.'}))}
    });
  }};
}

function localDonations(){
  const records=new Map();
  return {name:'yedirenk-local-donations',configureServer(server){
    server.middlewares.use('/api/public/online-donations',(req,res)=>{
      const chunks=[];
      let received=0;
      req.on('data',chunk=>{
        received+=chunk.length;
        if(received<=9_000_000) chunks.push(chunk);
      });
      req.on('end',async()=>{
        try{
          if(received>9_000_000){res.statusCode=413;res.end(JSON.stringify({message:'Bağış isteği çok büyük.'}));return}
          const raw=Buffer.concat(chunks);
          const origin=`http://${req.headers.host||'127.0.0.1:5173'}`;
          const request=new Request(`${origin}/api/public/online-donations`,{
            method:req.method,
            headers:{'Content-Type':req.headers['content-type']||'application/json',Origin:origin,'Content-Length':String(raw.length)},
            body:req.method==='POST'?raw:undefined,
          });
          const response=await donationRequestApi(request,{YEDIRENK_DONATIONS:{put:async(key,value)=>records.set(key,value)}});
          res.statusCode=response.status;
          response.headers.forEach((value,key)=>res.setHeader(key,value));
          res.end(await response.text());
        }catch(error){
          res.statusCode=500;
          res.setHeader('Content-Type','application/json; charset=utf-8');
          res.end(JSON.stringify({message:error instanceof Error?error.message:'Bağış kaydedilemedi.'}));
        }
      });
    });
  }};
}

function localAnalytics(){
  const events=[];
  return {name:'yedirenk-local-analytics',configureServer(server){
    server.middlewares.use('/api/analytics',(req,res)=>{
      if(req.method!=='POST'){res.statusCode=405;res.end(JSON.stringify({message:'Method not allowed'}));return}
      let raw='';req.on('data',chunk=>{if(raw.length<8192)raw+=chunk});req.on('end',()=>{try{const body=JSON.parse(raw);events.push({...body,ip:req.socket.remoteAddress||'127.0.0.1',userAgent:req.headers['user-agent']||'',timestamp:Date.now()});if(events.length>1000)events.shift();res.statusCode=202;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true}))}catch{res.statusCode=400;res.end(JSON.stringify({message:'Invalid JSON'}))}})
    });
    server.middlewares.use('/api/admin/analytics',(req,res)=>{res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify({events:[...events].reverse(),retentionDays:1,local:true}))});
  }};
}
