import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({plugins:[react(),localAnalytics()]});

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
