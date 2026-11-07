import {createClient} from 'npm:@supabase/supabase-js@2.119.0';
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(x=>x.toString(16).padStart(2,'0')).join('');
const code=()=>Array.from(crypto.getRandomValues(new Uint8Array(32))).map(x=>x.toString(16).padStart(2,'0')).join('');
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'',allowed=origin==='https://fizyoappa.github.io'||/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
 const headers={'Access-Control-Allow-Origin':allowed?origin:'https://fizyoappa.github.io','Access-Control-Allow-Headers':'apikey,content-type,authorization,x-client-info','Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
 const out=(d:unknown,s=200)=>new Response(JSON.stringify(d),{headers,status:s});
 if(req.method==='OPTIONS')return out({ok:true});if(origin&&!allowed)return out({error:'İzin verilmeyen kaynak'},403);if(req.method!=='POST')return out({error:'POST gerekli'},405);
 try{
  const body=await req.json(),username=String(body.username||'').trim().toLowerCase();
  if(!/^[a-z0-9_]{3,30}$/.test(username))return out({error:'Kullanıcı adı 3–30 karakter; küçük Latin harfi, rakam veya alt çizgi olmalı.'},400);
  const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
  const {data:cfg}=await db.from('server_config').select('secret').eq('id','push').single();if(!cfg)return out({error:'Hesap servisi hazır değil'},503);
  const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||'unavailable';
  const rateKey=await hash(cfg.secret+ip);const {data:ok,error:rateError}=await db.rpc('consume_account_attempt',{p_key:rateKey});
  if(rateError||!ok)return out({error:'Çok sık deneme yapıldı. Daha sonra tekrar dene.'},429);
  const password=body.action==='recover'?body.newPassword:body.password;
  if(typeof password!=='string'||password.length<10||password.length>128)return out({error:'Şifre 10–128 karakter olmalı.'},400);
  if(body.action==='signup'){
   const {data,error}=await db.auth.admin.createUser({email:username+'@accounts.iyiadim.invalid',password,email_confirm:true,user_metadata:{username}});
   if(error||!data.user)return out({error:'Bu kullanıcı adı kullanılamıyor. Başka bir ad seç.'},409);
   const recoveryCode=code(),code_hash=await hash(cfg.secret+recoveryCode);
   const {error:insertError}=await db.from('account_recovery').insert({username,user_id:data.user.id,code_hash});
   if(insertError){await db.auth.admin.deleteUser(data.user.id);return out({error:'Kayıt tamamlanamadı. Tekrar dene.'},503)}
   return out({ok:true,recoveryCode});
  }
  if(body.action==='recover'){
   if(typeof body.recoveryCode!=='string'||!/^[0-9a-f]{64}$/.test(body.recoveryCode))return out({error:'Kurtarma bilgileri doğrulanamadı.'},400);
   const old=await hash(cfg.secret+body.recoveryCode);const {data:found}=await db.from('account_recovery').select('user_id').eq('username',username).eq('code_hash',old).maybeSingle();
   if(!found)return out({error:'Kurtarma bilgileri doğrulanamadı.'},400);
   // A recovery code remains valid; only the password changes. Store code privately.
   const {error}=await db.auth.admin.updateUserById(found.user_id,{password});if(error)return out({error:'Şifre güncellenemedi.'},503);
   return out({ok:true});
  }
  return out({error:'Geçersiz işlem'},400);
 }catch{return out({error:'Hesap servisine ulaşılamadı.'},503)}
});
