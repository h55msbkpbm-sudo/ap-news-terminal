window.AP_WIRE_BOOTED=true;
const RSS_FEEDS=[
  {source:'AP',url:'https://rsshub.app/apnews/topics/apf-topnews'},
  {source:'Reuters',url:'https://feeds.reuters.com/reuters/topNews'},
  {source:'Bloomberg',url:'https://feeds.bloomberg.com/markets/news.rss'},
  {source:'Yahoo',url:'https://news.yahoo.com/rss/'},
  {source:'BBC',url:'https://feeds.bbci.co.uk/news/rss.xml'},
  {source:'AFP',url:'https://www.france24.com/en/rss'},
  {source:'STAT',url:'https://www.statnews.com/feed/'},
  {source:'FiercePharma',url:'https://www.fiercepharma.com/rss/xml'},
  {source:'Nikkei',url:'https://asia.nikkei.com/rss/feed/nar'},
  {source:'SCMP',url:'https://www.scmp.com/rss/91/feed'},
  {source:'ASCO Post',url:'https://ascopost.com/rss/'},
  {source:'ASCO Daily News',url:'https://dailynews.ascopubs.org/rss/'},
  {source:'ESMO Daily',url:'https://dailyreporter.esmo.org/rss'},
  {source:'HK01',url:'https://www.hk01.com/rss'}
];
const PROXIES=[
  u=>'https://api.allorigins.win/raw?url='+encodeURIComponent(u),
  u=>'https://corsproxy.io/?'+encodeURIComponent(u),
  u=>'https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(u)
];
let activeSource='ALL';
let stories=(typeof SEEDED!=='undefined'?SEEDED.slice():[]);
function formatPrice(p){return p>=1000?p.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):p.toFixed(2)}
function renderTicker(){
  const el=document.getElementById('ticker'); if(!el) return; let html='';
  if(typeof STOCKS==='undefined') return;
  for(let i=0;i<8;i++){
    STOCKS.forEach(s=>{
      const cls=s.pct>=0?'up':'down'; const sign=s.pct>=0?'+':'';
      html+='<span class="ticker-item"><span class="sym">'+s.sym+'</span>'+formatPrice(s.price)+' <span class="'+cls+'">'+sign+s.chg.toFixed(2)+' ('+sign+s.pct.toFixed(2)+'%)</span></span>';
    });
  }
  el.innerHTML=html;
}
function updateClock(){
  const now=new Date();
  const opts={timeZone:'America/New_York',weekday:'short',month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true};
  const el=document.getElementById('clock');
  if(el) el.textContent=now.toLocaleString('en-US',opts)+' EDT';
}
function sourceOrder(){
  const present=new Set(stories.map(s=>s.source));
  return ['ALL'].concat((typeof SOURCE_ORDER!=='undefined'?SOURCE_ORDER:[]).filter(s=>present.has(s)));
}
function sourceCounts(){const c={ALL:stories.length};stories.forEach(s=>{c[s.source]=(c[s.source]||0)+1});return c}
function renderChips(){
  const counts=sourceCounts();
  const row=document.getElementById('chipRow'); if(!row) return;
  row.innerHTML=sourceOrder().map(src=>{
    const n=counts[src]||0; const active=src===activeSource?' active':'';
    return '<button type="button" class="chip'+active+'" data-src="'+src+'">'+src+'<span class="n">'+n+'</span></button>';
  }).join('');
}
function esc(t){return String(t||'').replace(/[&<>"']/g,m=>({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[m]))}
function renderFeed(){
  const feed=document.getElementById('feed'); if(!feed) return;
  const list=stories.filter(s=>activeSource==='ALL'||s.source===activeSource).sort((a,b)=>(b.ts||'').localeCompare(a.ts||''));
  if(!list.length){feed.innerHTML='<div class="empty">No verified wires for '+esc(activeSource)+'.</div>';return;}
  feed.innerHTML=list.map(s=>{
    const h=s.url?'<a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.headline)+'</a>':esc(s.headline);
    return '<article class="story" data-source="'+esc(s.source)+'"><div class="story-top"><div class="kicker">'+esc(s.kicker)+'</div><span class="source-chip">'+esc(s.source)+'</span></div><h2 class="headline">'+h+'</h2><div class="meta"><span class="byline">'+esc(s.byline)+'</span></div><div class="dateline">'+esc(s.dateline)+'</div><p class="lead">'+esc(s.lead)+'</p></article>';
  }).join('');
}
function setMeta(t){const el=document.getElementById('refreshMeta'); if(el) el.textContent=t}
function textOf(el,names){
  for(const n of names){
    const node=el.querySelector(n);
    if(node && node.textContent && node.textContent.trim()) return node.textContent.trim();
  }
  return '';
}
function parseRss(xmlText,source){
  const out=[];
  try{
    const doc=new DOMParser().parseFromString(xmlText,'text/xml');
    const items=[...doc.querySelectorAll('item, entry')].slice(0,8);
    items.forEach((item,i)=>{
      const title=textOf(item,['title']);
      let link=textOf(item,['link']);
      if(!link){
        const href=item.querySelector('link');
        if(href && href.getAttribute('href')) link=href.getAttribute('href').trim();
      }
      const desc=textOf(item,['description','summary','content']).replace(/<[^>]+>/g,'').trim();
      const pub=textOf(item,['pubDate','published','updated','dc\\:date']);
      if(!title) return;
      const d=pub?new Date(pub):null;
      if(!d||Number.isNaN(d.getTime())) return;
      out.push({id:'rss-'+source+'-'+i+'-'+d.getTime(),source:source,kicker:'Wire',headline:title,byline:(typeof BYLINE!=='undefined'&&BYLINE[source])||source.toUpperCase(),dateline:pub,lead:desc?desc.slice(0,280):'Live RSS item from '+source+'.',url:link||'',ts:d.toISOString()});
    });
  }catch(e){}
  return out;
}
function fetchWithTimeout(url,ms){
  const ctrl=new AbortController();
  const t=setTimeout(()=>ctrl.abort(),ms);
  return fetch(url,{cache:'no-store',signal:ctrl.signal}).finally(()=>clearTimeout(t));
}
async function fetchFeed(feed){
  for(const wrap of PROXIES){
    try{
      const res=await fetchWithTimeout(wrap(feed.url),7000);
      if(!res.ok) continue;
      const text=await res.text();
      if(!text||text.length<40) continue;
      const parsed=parseRss(text,feed.source);
      if(parsed.length) return parsed;
    }catch(e){}
  }
  return [];
}
async function refreshHeadlines(){
  const btn=document.getElementById('refreshBtn');
  if(!btn||btn.classList.contains('busy')||typeof SEEDED==='undefined') return;
  btn.disabled=true; btn.classList.add('busy'); btn.textContent='Refreshing…';
  setMeta('Refreshing — merging allowed RSS if reachable. Verified seeded wires stay. Tape remains DELAYED Mon 31 AP closes.');
  const results=await Promise.allSettled(RSS_FEEDS.map(fetchFeed));
  const incoming=[]; const hit=[];
  results.forEach((r,i)=>{ if(r.status==='fulfilled' && r.value.length){ incoming.push.apply(incoming,r.value); hit.push(RSS_FEEDS[i].source+' '+r.value.length);} });
  const seen=new Set(SEEDED.flatMap(s=>[s.headline.toLowerCase(),(s.url||'').toLowerCase()].filter(Boolean)));
  const extras=[];
  incoming.forEach(item=>{ const k=item.headline.toLowerCase(); const u=(item.url||'').toLowerCase(); if(seen.has(k)||(u&&seen.has(u))) return; seen.add(k); if(u) seen.add(u); extras.push(item); });
  stories=extras.concat(SEEDED);
  const stamp=new Date().toLocaleString('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  if(extras.length) setMeta('Refresh '+stamp+' EDT — merged '+extras.length+' dated RSS item(s) ['+hit.join(', ')+'] on top of '+SEEDED.length+' verified wires. Tape remains DELAYED Mon 31 Aug AP closes (DJIA/SPX/COMP).');
  else setMeta('Refresh '+stamp+' EDT — RSS blocked or empty (CORS). Showing '+SEEDED.length+' verified dated wires across '+SOURCE_ORDER.length+' sources. Tape remains DELAYED Mon 31 Aug AP closes (DJIA/SPX/COMP).');
  activeSource='ALL'; renderChips(); renderFeed(); renderTicker();
  btn.disabled=false; btn.classList.remove('busy'); btn.innerHTML='Refresh <span class="refresh-hint">R</span>';
}
function boot(){
  const chips=document.getElementById('chipRow');
  if(chips) chips.addEventListener('click',e=>{ const btn=e.target.closest('.chip'); if(!btn) return; activeSource=btn.dataset.src; renderChips(); renderFeed(); });
  const rb=document.getElementById('refreshBtn');
  if(rb) rb.addEventListener('click',refreshHeadlines);
  document.addEventListener('keydown',e=>{ if(e.key==='r'||e.key==='R'){ if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.isContentEditable)) return; e.preventDefault(); refreshHeadlines(); } });
  renderTicker(); renderChips(); renderFeed(); updateClock(); setInterval(updateClock,1000);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
else boot();
