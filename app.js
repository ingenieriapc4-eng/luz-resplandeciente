const get=(o,p)=>p==='.'?o:p.split('.').reduce((a,k)=>a==null?a:a[k],o);
const url=u=>/^(https?:)?\/\//i.test(u)?u:'https://'+u;
const rel=p=>String(p).replace(/^\/+/,'');
function bind(root,c){
 root.querySelectorAll('[data-f]').forEach(e=>{const v=get(c,e.dataset.f);if(v!=null)e.textContent=v});
 root.querySelectorAll('[data-img]').forEach(e=>{const v=get(c,e.dataset.img);if(v)e.src=rel(v);if(e.dataset.alt){const a=get(c,e.dataset.alt);if(a)e.alt=a}});
 root.querySelectorAll('[data-tel]').forEach(e=>{const v=get(c,e.dataset.tel);if(v)e.href='tel:+'+String(v).replace(/\D/g,'')});
 root.querySelectorAll('[data-href]').forEach(e=>{const v=get(c,e.dataset.href);if(v){e.href=e.dataset.pre?e.dataset.pre+v+(e.dataset.suf||''):url(v)}else{e.classList.add('off');e.removeAttribute('href')}});
}
function lists(d){
 document.querySelectorAll('template[data-list]').forEach(t=>{
  (get(d,t.dataset.list)||[]).forEach(it=>{const f=t.content.cloneNode(true);bind(f,it);t.parentNode.insertBefore(f,t)});
 });
}
function slot(id,u,kind){
 var url=u;
 const s=document.getElementById(id);
 if(!url){s.innerHTML='<p class="off"><i>Próximamente.</i></p>';return}
 url=/^(https?:|data:|media\/|\/)/i.test(url)?url:'https://'+url;
 let e,yt=url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
 if(kind==='video'&&/youtu/.test(url)&&yt){e=document.createElement('iframe');e.src='https://www.youtube.com/embed/'+yt[1];e.allowFullscreen=true;e.title='Video del ministerio'}
 else if(kind==='audio'&&/\.(mp3|aac|ogg)(\?|$)|stream|;$/i.test(url)){e=document.createElement('audio');e.controls=true;e.preload='none';e.src=url}
 else if(kind==='video'&&/\.(mp4|webm|mov)(\?|$)/i.test(url)){e=document.createElement('video');e.controls=true;e.preload='metadata';e.src=/^https?:/.test(url)?url:rel(url)}
 else{e=document.createElement('a');e.className='btn';e.href=url;e.target='_blank';e.rel='noopener';e.textContent=kind==='audio'?'Escuchar la radio':'Ver el video'}
 s.appendChild(e);
}
const M=[['Inicio','index'],['Quiénes somos',[['Pastores generales','pastores'],['Visión y misión','vision'],['Declaración de fe','fe']]],['Cobertura',[['Licencias','licencias'],['Deberes y obligaciones','deberes']]],['Recursos',[['Salvación','salvacion'],['Radio y video','radio-video'],['Contacto','contacto']]]];
function nav(cur){
 const li=M.map(([n,t])=>{
  if(typeof t==='string')return `<li><a href="${t}.html"${t===cur?' aria-current="page"':''}>${n}</a></li>`;
  return `<li class="sub${t.some(x=>x[1]===cur)?' on':''}"><a href="${t[0][1]}.html" aria-haspopup="true">${n} ▾</a><ul class="drop">${t.map(([a,b])=>`<li><a href="${b}.html"${b===cur?' aria-current="page"':''}>${a}</a></li>`).join('')}</ul></li>`}).join('');
 return `<div class="bar"><a class="brand" href="index.html"><img src="media/logo.jpg" alt=""><span>La Luz Resplandeciente</span></a><button class="burger" aria-label="Abrir menú" aria-expanded="false">☰</button><ul id="menu">${li}</ul></div>`;
}
const FOOT=`<h2 data-f="contacto.titulo"></h2><p><span data-f="contacto.nombre"></span><br><span data-f="contacto.direccion"></span></p><p class="tels"><template data-list="contacto.telefonos"><a data-f="texto" data-tel="texto"></a></template></p><div class="cta"><a class="btn" target="_blank" rel="noopener" data-href="contacto.whatsapp" data-pre="https://wa.me/" data-suf="?text=Hola%2C%20quisiera%20informaci%C3%B3n%20sobre%20la%20cobertura%20ministerial">Escribir por WhatsApp</a><a class="btn alt" data-href="contacto.email" data-pre="mailto:">Escribir por correo</a><a class="btn alt" target="_blank" rel="noopener" data-href="contacto.facebook">Facebook</a><a class="btn don" target="_blank" rel="noopener" data-href="contacto.donaciones">Donar al ministerio</a></div>`;
const cur=document.body.dataset.page,nv=document.getElementById('nav');
nv.innerHTML=nav(cur);
document.getElementById('contacto').innerHTML=FOOT;
const bt=nv.querySelector('.burger');
bt.onclick=()=>{const o=nv.classList.toggle('open');bt.setAttribute('aria-expanded',o)};
fetch('content/site.json',{cache:'no-cache'}).then(r=>r.json()).then(d=>{
 bind(document,d);lists(d);
 const h=document.querySelector('.banner h1');
 document.title=(h?h.textContent+' | ':'')+(d.titulo_pestana||d.titulo);
 if(document.getElementById('testSlot'))slot('testSlot',d.multimedia.video_archivo||d.multimedia.video_url,'video');
 if(document.getElementById('radioSlot')){slot('radioSlot',d.multimedia.radio_url,'audio');slot('videoSlot',d.multimedia.video_archivo||d.multimedia.video_url,'video')}
}).catch(()=>{document.body.insertAdjacentHTML('afterbegin','<p style="padding:2rem">No se pudo cargar el contenido. Si abrió el archivo directamente desde su computadora, publíquelo en GitHub Pages para verlo.</p>')});
