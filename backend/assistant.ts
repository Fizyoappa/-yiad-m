import { createClient } from 'npm:@supabase/supabase-js@2.119.0';
const model = new Supabase.ai.Session('gte-small');
const seeds = [
 ['profile','Profilimi tanılarımı yaşımı bilgilerimi düzenlemek kaydetmek istiyorum hesap profili diagnosis profile personal information','Profilimi nasıl doldururum?'],
 ['meds','İlaçlarımı haplarımı saatlerini hatırlatıcıyı eklemek aldım kaydı medicines medication schedule reminder','İlaç nasıl eklerim?'],
 ['water','Su içtim bardağı saymak sıvı hedefi susadım water drink glasses hydration','Su nasıl kaydederim?'],
 ['exercises','Egzersiz hareket antrenman kuvvet denge kütüphane nereden başlarım exercise movement balance library','Egzersize nasıl başlarım?'],
 ['motivation','Moralim bozuk yorgunum motivasyona desteğe ihtiyacım var motive encouragement tired sad support','Biraz motivasyon isterim'],
 ['tracking','Takibim rapor grafik gelişim günler ağrı yorgunluk kaydetme progress tracking report diary','Gelişim raporumu nasıl görürüm?'],
 ['account','Üye olmak giriş yapmak şifremi unuttum buluta kayıt sign in signup login account password','Nasıl giriş yaparım?'],
 ['offline','İnternet yok çevrimdışı telefona yükle ana ekrana ekle offline install app phone','Çevrimdışı nasıl kullanırım?']
];
let cached: Promise<number[][]> | undefined;
const normalize=(s:string)=>s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
Deno.serve(async(req)=>{
 const origin=req.headers.get('origin')||'';
 const allowed=origin==='https://fizyoappa.github.io'||/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
 const cors={'Access-Control-Allow-Origin':allowed?origin:'https://fizyoappa.github.io','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Vary':'Origin'};
 const result=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json'}});
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(origin&&!allowed)return result({error:'Origin not allowed'},403);
 if(req.method!=='POST')return result({error:'POST required'},405);
 const token=(req.headers.get('authorization')||'').replace(/^Bearer /,'');
 const client=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
 const {data:{user},error}=await client.auth.getUser(token);if(error||!user)return result({error:'Sign in required'},401);
 try{
  const {question}=await req.json();if(typeof question!=='string'||!question.trim()||question.length>500)return result({error:'Invalid question'},400);
  const {data: permitted,error:rateError}=await client.rpc('consume_assistant_request',{p_user:user.id});
  if(rateError||!permitted)return result({error:'Rate limit; try again later'},429);
  const q=normalize(question);
  if(/gog(us|sum)|bayil|nefes.*(darl|alam)|ani.*(gucsuz|konusma)|112|acil/.test(q))return result({intent:'emergency',prompt:question,mode:'safety-rule'});
  // Embeddings select an approved guide topic; no model-generated medical advice.
  cached??=Promise.all(seeds.map(async(s)=>Array.from(await model.run(s[1],{mean_pool:true,normalize:true})) as number[])).catch(e=>{cached=undefined;throw e});
  const [vectors,v]=await Promise.all([cached,model.run(question,{mean_pool:true,normalize:true})]);
  const scored=vectors.map((a,i)=>({i,score:a.reduce((sum,x,k)=>sum+x*Number(v[k]),0)})).sort((a,b)=>b.score-a.score);
  const best=scored[0];
  if(!Number.isFinite(best.score)||best.score<.53)return result({intent:'unknown',mode:'gte-small-semantic',prompt:'Bilinmeyen bir uygulama sorum var',confidence:best.score});
  return result({intent:seeds[best.i][0],prompt:seeds[best.i][2],mode:'gte-small-semantic',confidence:best.score});
 }catch{return result({error:'AI guide temporarily unavailable'},503)}
});
