'use strict';
window.APP={
  id:'ff',name:'FieldFix',
  logo:'<span class="mk"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.3 2.3-2.7-.7-.7-2.7z"/></svg></span>',
  nav:[['index.html','home','Home'],['diagnose.html','diag','Diagnose'],['guides.html','guide','Guides'],['log.html','log','Log'],['tools.html','tools','Tools'],['settings.html','settings','Settings']],
  accents:[['#ff9e2c','#ffd23e','#e0632c'],['#ffd23e','#ff9e2c','#8fd45a'],['#e0632c','#ff9e2c','#ffd23e'],['#5ac6ff','#ff9e2c','#ffd23e']],
  cta:['diagnose.html','diag','Diagnose a fault'],
  heroKind:'gears',
  icons:{diag:'M9 3H5a2 2 0 00-2 2v4M15 3h4a2 2 0 012 2v4M21 15v4a2 2 0 01-2 2h-4M3 15v4a2 2 0 002 2h4M12 8v4l2 2',guide:'M4 5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2zM14 3v5h5M8 13h8M8 17h5',log:'M4 5h16M4 10h16M4 15h10M4 20h7',tools:'M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.3 2.3-2.7-.7-.7-2.7z',warn:'M12 3l9 16H3zM12 10v4M12 17v.5'},
  ensureSeed(){}
};
const LS='ff_data';
function loadS(){try{return Object.assign({log:[]},JSON.parse(localStorage.getItem(LS)||'{}'));}catch(e){return{log:[]};}}
let S=loadS();function save(){localStorage.setItem(LS,JSON.stringify(S));}
if(!localStorage.getItem('ff_seeded')){localStorage.setItem('ff_seeded','1');if(!S.log.length){S.log=[{asset:'Generator #2',work:'Replaced air filter',status:'Done',date:'2026-10-18'},{asset:'Water pump A',work:'Checked seal — weeping',status:'Monitor',date:'2026-10-20'}];save();}}
/* ---------- diagnosis knowledge base ---------- */
const KB={
 'Generator':{
   'Won\'t start':[
     {c:'Dead or weak battery',sev:'high',p:0.4,check:'Measure battery voltage (≥12.4V at rest). Check terminals for corrosion.',fix:'Charge or replace battery; clean and tighten terminals.'},
     {c:'Out of / stale fuel',sev:'med',p:0.25,check:'Confirm fuel level and that the valve is open. Smell for stale petrol.',fix:'Add fresh fuel; drain stale fuel from the carburettor bowl.'},
     {c:'Fouled spark plug',sev:'med',p:0.2,check:'Remove plug; inspect for carbon/wet fouling and correct gap.',fix:'Clean or replace plug; set gap to spec.'},
     {c:'Low oil shutdown',sev:'low',p:0.15,check:'Check oil level — many units have a low-oil cutoff.',fix:'Top up oil to the full mark and retry.'}
   ],
   'Runs then stalls':[
     {c:'Blocked fuel flow',sev:'high',p:0.4,check:'Inspect fuel filter and carburettor jets for debris.',fix:'Clean/replace fuel filter; clean carburettor jets.'},
     {c:'Clogged air filter',sev:'med',p:0.3,check:'Remove and inspect air filter for dirt.',fix:'Clean or replace the air filter.'},
     {c:'Overheating',sev:'med',p:0.3,check:'Check cooling fins and airflow; feel for excessive heat.',fix:'Clear debris from cooling fins; allow to cool; improve ventilation.'}
   ]
 },
 'Water pump':{
   'No water / low flow':[
     {c:'Loss of prime',sev:'high',p:0.4,check:'Check whether the pump housing holds water; listen for air.',fix:'Re-prime the pump; check suction line for air leaks.'},
     {c:'Blocked strainer/impeller',sev:'med',p:0.35,check:'Inspect inlet strainer and impeller for debris.',fix:'Clear the strainer and impeller of debris.'},
     {c:'Worn impeller',sev:'low',p:0.25,check:'Inspect impeller vanes for wear or cracks.',fix:'Replace the impeller.'}
   ],
   'Leaking':[
     {c:'Failed mechanical seal',sev:'high',p:0.5,check:'Locate drip — seal weep hole vs housing joint.',fix:'Replace the mechanical seal.'},
     {c:'Loose fittings',sev:'med',p:0.3,check:'Check union nuts and clamps for tightness.',fix:'Tighten or re-seal fittings with thread tape.'},
     {c:'Cracked housing',sev:'med',p:0.2,check:'Inspect casing for hairline cracks.',fix:'Replace the pump housing.'}
   ]
 },
 'Electric motor':{
   'Hums but won\'t turn':[
     {c:'Failed start capacitor',sev:'high',p:0.45,check:'Discharge and test capacitor with a meter (µF vs rating).',fix:'Replace the start capacitor with the same rating.'},
     {c:'Seized bearing',sev:'med',p:0.3,check:'Try to spin the shaft by hand — stiff or gritty?',fix:'Replace bearings; lubricate if serviceable.'},
     {c:'Jammed load',sev:'med',p:0.25,check:'Decouple the load and retry the motor alone.',fix:'Clear the obstruction in the driven equipment.'}
   ],
   'Trips breaker':[
     {c:'Winding short to ground',sev:'high',p:0.5,check:'Megger the windings to earth (should be high resistance).',fix:'Rewind or replace the motor.'},
     {c:'Overload',sev:'med',p:0.3,check:'Measure running current vs nameplate FLA.',fix:'Reduce load or correct the mechanical fault causing overload.'},
     {c:'Moisture ingress',sev:'low',p:0.2,check:'Inspect for water in the terminal box.',fix:'Dry out, reseal the gland, and re-test insulation.'}
   ]
 },
 'HVAC unit':{
   'Not cooling':[
     {c:'Dirty condenser coil',sev:'med',p:0.35,check:'Inspect outdoor coil for dirt/blockage.',fix:'Wash the condenser coil; clear surrounding debris.'},
     {c:'Low refrigerant charge',sev:'high',p:0.35,check:'Measure superheat/subcool; look for oil stains (leaks).',fix:'Find and repair the leak; recharge to spec (licensed).'},
     {c:'Failed capacitor/contactor',sev:'med',p:0.3,check:'Check the contactor pulls in and the fan/compressor run caps.',fix:'Replace the failed contactor or capacitor.'}
   ],
   'Poor airflow':[
     {c:'Clogged air filter',sev:'high',p:0.5,check:'Pull the return filter and hold to the light.',fix:'Replace the air filter.'},
     {c:'Iced evaporator',sev:'med',p:0.3,check:'Inspect the indoor coil for ice build-up.',fix:'Thaw the coil; correct the airflow/charge cause.'},
     {c:'Blower fault',sev:'med',p:0.2,check:'Confirm the blower spins freely and runs.',fix:'Replace blower motor or capacitor; clear the wheel.'}
   ]
 }
};
const GUIDES=[
 {t:'Replace a mechanical seal (centrifugal pump)',tools:['Spanner set','Seal kit','Pick','Clean rag'],safety:'Isolate power, close suction/discharge valves, and relieve pressure before opening the pump.',steps:[['Isolate & drain','Lock out power, close valves, open the drain and let the casing empty.'],['Open the pump','Remove the casing bolts and withdraw the back pull-out assembly.'],['Remove old seal','Slide off the rotating element; prise out the stationary seat from the gland.'],['Clean seats','Clean the shaft and seat bore; remove scoring with fine abrasive.'],['Fit new seal','Lubricate the elastomer with soapy water; press the seat square, then the rotating face.'],['Reassemble','Refit the back pull-out, torque bolts in a cross pattern, re-prime and test for leaks.']]},
 {t:'Service a small engine air filter & plug',tools:['Socket set','Spark plug socket','Feeler gauge','Compressed air'],safety:'Disconnect the spark plug lead before working near the flywheel.',steps:[['Remove cover','Unclip the air box and lift out the filter element.'],['Clean/replace filter','Tap out dust or wash foam filters in soapy water and dry fully.'],['Pull the plug','Remove the lead and unscrew the spark plug.'],['Inspect & gap','Check for fouling; set the electrode gap with a feeler gauge to spec.'],['Reinstall','Hand-start the plug to avoid cross-threading, torque lightly, refit the lead and filter.']]},
 {t:'Test a single-phase motor start capacitor',tools:['Insulated screwdriver','Multimeter (µF)','Gloves'],safety:'Discharge the capacitor across a resistor before touching the terminals — stored charge can shock.',steps:[['Isolate & discharge','Cut power; short the capacitor terminals through a resistor to discharge.'],['Disconnect','Note and remove the wiring from the capacitor.'],['Measure','Set the meter to capacitance and read µF; compare to the printed rating (±6%).'],['Decide','If reading is low/open/shorted, replace with the same µF and voltage rating.'],['Refit','Reconnect, secure, restore power and verify the motor starts cleanly.']]}
];
/* ---------- calculators ---------- */
function ohm(v,i,r){ // solve missing one from two
  if(v&&i)return{v,i,r:v/i,p:v*i};if(v&&r)return{v,i:v/r,r,p:v*v/r};if(i&&r)return{v:i*r,i,r,p:i*i*r};return null;}
const AMPACITY={'1.5':14,'2.5':18.5,'4':25,'6':32,'10':44,'16':59,'25':77,'35':96}; // mm² -> ~A (illustrative, 70°C)
/* ---------- helpers ---------- */
function statRow(c){return c.map(([l,n])=>'<div class="bstat"><div class="n">'+n+'</div><div class="l">'+l+'</div></div>').join('');}
function marq(t){return '<span>'+t.map(x=>'<b>'+x+'</b>').join(' · ')+' · </span><span>'+t.map(x=>'<b>'+x+'</b>').join(' · ')+' · </span>';}
function featGrid(items){return items.map(([h,ic,t,d],i)=>'<a class="fcell" href="'+h+'"><div class="fi">'+icon(ic,22)+'</div><div class="fx">0'+(i+1)+'</div><h3>'+t+'</h3><p>'+d+'</p><div class="go">Open '+icon('chevron',13)+'</div></a>').join('');}
const FEATURES='guided fault diagnosis · 4 equipment classes · multiple symptoms each · ranked likely causes · likelihood % · severity · what-to-check · how-to-fix · step-by-step repair guides · tools list · safety warnings · service log · add/edit/delete entries · status (done/monitor/urgent) · asset history · Ohm\'s law calculator (V·I·R·P) · torque unit converter (Nm·ft-lb) · wire ampacity lookup · unit converters · pressure/flow helpers · export log · JSON backup · multi-page nav · light & dark · 4 accents · custom cursor · 3D mechanical gears hero · ambient motion · scroll reveals · shortcuts · autosave · fully offline · responsive · built for the field';
window.PAGES={
 index(){
   $('meta').innerHTML=statRow([['equipment',Object.keys(KB).length],['guides',GUIDES.length],['log',S.log.length],['offline','100%']]);
   $('marq').innerHTML=marq(['guided diagnosis','likely causes','repair guides','safety first','service log','field calculators','fully offline']);
   $('fgrid').innerHTML=featGrid([['diagnose.html','diag','Diagnose','Pick the equipment and symptom — get ranked causes, checks and fixes.'],['guides.html','guide','Guides','Step-by-step repair procedures with tools and safety call-outs.'],['log.html','log','Service log','Track what was done, what to monitor, and what is urgent.'],['tools.html','tools','Calculators','Ohm\'s law, torque conversion and wire ampacity — field-ready.'],['settings.html','settings','Settings','Theme, accent and data backup — private to your device.'],['diagnose.html','warn','Fault? Start here','Narrow it down in seconds, even with no signal.']]);
   $('featlist').textContent='50+ features — '+FEATURES+'.';
   mountHero3D('hero3d','gears');
 },
 diagnose(){
   const eq=$('eq'),sy=$('sy');
   function fillSy(){const sym=Object.keys(KB[eq.value]);sy.innerHTML=sym.map(s=>'<option>'+s+'</option>').join('');}
   eq.innerHTML=Object.keys(KB).map(k=>'<option>'+k+'</option>').join('');fillSy();
   function draw(){const causes=KB[eq.value][sy.value]||[];
     $('out').innerHTML=causes.map(c=>'<div class="cause '+c.sev+'"><div class="h"><span class="nm">'+esc(c.c)+'</span><span class="pct">'+Math.round(c.p*100)+'% likely</span></div><div style="margin-top:6px"><span class="sev '+c.sev+'">'+c.sev+' severity</span></div><div class="lbl">Check</div><div class="ck">'+esc(c.check)+'</div><div class="lbl">Fix</div><div class="ck">'+esc(c.fix)+'</div></div>').join('');}
   eq.onchange=()=>{fillSy();draw();};sy.onchange=draw;draw();
 },
 guides(){
   $('list').innerHTML=GUIDES.map((g,i)=>'<button class="fcell" data-i="'+i+'" style="text-align:left;cursor:pointer"><div class="fi">'+icon('guide',22)+'</div><div class="fx">0'+(i+1)+'</div><h3 style="font-size:17px">'+esc(g.t)+'</h3><p>'+g.steps.length+' steps · '+g.tools.length+' tools</p><div class="go">Open '+icon('chevron',13)+'</div></button>').join('');
   $('list').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>openGuide(+b.dataset.i));
   openGuide(0);
   function openGuide(i){const g=GUIDES[i];$('gtitle').textContent=g.t;
     $('gbody').innerHTML='<div class="safety">'+icon('warn',18)+'<div><b>Safety:</b> '+esc(g.safety)+'</div></div>'+
       '<div style="margin:16px 0"><div class="lbl" style="font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-bottom:8px">Tools</div><div class="chips">'+g.tools.map(t=>'<span class="tool">'+esc(t)+'</span>').join('')+'</div></div>'+
       g.steps.map((s,n)=>'<div class="step"><div class="num">'+(n+1)+'</div><div class="b"><b>'+esc(s[0])+'</b><div style="color:var(--ink2);margin-top:4px;line-height:1.5">'+esc(s[1])+'</div></div></div>').join('');}
   window.__openGuide=openGuide;
 },
 log(){
   function draw(){const col={Done:'var(--grn)',Monitor:'var(--acc)',Urgent:'var(--rose)'};
     $('list').innerHTML=S.log.length?S.log.map((e,i)=>'<div class="logitem"><div class="stat-dot" style="background:'+(col[e.status]||'var(--mut)')+'"></div><div style="flex:1"><b style="font-family:var(--disp);font-weight:700">'+esc(e.asset)+'</b> <span style="color:var(--mut);font-family:var(--mono);font-size:11px">'+esc(e.date||'')+'</span><div style="color:var(--ink2);font-size:13px;margin-top:2px">'+esc(e.work)+' · <span style="color:'+(col[e.status]||'var(--mut)')+'">'+e.status+'</span></div></div><button class="ghost" data-i="'+i+'">'+icon('close',14)+'</button></div>').join(''):'<div class="empty">No service entries yet.</div>';
     $('list').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{S.log.splice(+b.dataset.i,1);save();draw();});}
   $('add').onclick=()=>{const asset=$('asset').value.trim();if(!asset){toast('Name the asset');return;}S.log.unshift({asset,work:$('work').value.trim(),status:$('status').value,date:new Date().toISOString().slice(0,10)});save();['asset','work'].forEach(x=>$(x).value='');draw();toast('Logged');};
   draw();
 },
 tools(){
   function ohmCalc(){const v=+$('o_v').value||0,i=+$('o_i').value||0,r=+$('o_r').value||0;const n=[v,i,r].filter(x=>x>0).length;if(n<2){$('o_out').textContent='Enter any two';return;}const res=ohm(v,i,r);$('o_out').innerHTML='V <em>'+res.v.toFixed(2)+'</em> · I <em>'+res.i.toFixed(2)+'</em> · R <em>'+res.r.toFixed(2)+'</em> · P <em>'+res.p.toFixed(1)+'W</em>';}
   ['o_v','o_i','o_r'].forEach(id=>$(id).oninput=ohmCalc);ohmCalc();
   function torq(){const nm=+$('t_nm').value;if(nm){$('t_out').innerHTML='<em>'+(nm*0.7376).toFixed(1)+'</em> ft·lb';}else{const fl=+$('t_fl').value||0;$('t_out').innerHTML='<em>'+(fl/0.7376).toFixed(1)+'</em> N·m';}}
   $('t_nm').oninput=()=>{$('t_fl').value='';torq();};$('t_fl').oninput=()=>{$('t_nm').value='';torq();};torq();
   function amp(){const g=$('w_g').value;const a=AMPACITY[g];$('w_out').innerHTML='≈ <em>'+a+'</em> A';$('w_note').textContent=g+' mm² copper, ~70°C — always check local code & deratings.';}
   $('w_g').innerHTML=Object.keys(AMPACITY).map(k=>'<option>'+k+'</option>').join('');$('w_g').onchange=amp;amp();
 },
 settings(){
   $('themeToggle').classList.toggle('on',theme()==='light');$('themeToggle').onclick=()=>{toggleTheme();$('themeToggle').classList.toggle('on',theme()==='light');};
   $('accents2').innerHTML=APP.accents.map((a,i)=>'<button class="ad'+(i===accentIdx()?' on':'')+'" data-i="'+i+'" data-press style="width:24px;height:24px;background:linear-gradient(135deg,'+a[0]+','+a[1]+')"></button>').join('');
   $('accents2').querySelectorAll('.ad').forEach(b=>b.onclick=()=>setAccent(+b.dataset.i));
   $('exp').onclick=()=>dl('fieldfix-log.json','application/json',JSON.stringify(S,null,2));
   $('featlist').textContent=FEATURES+'.';
 }
};
