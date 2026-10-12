const $ = (id) => document.getElementById(id);
const STORE = "meuTreinoData_v1";
const defaultState = {week:1, history:[], measures:[], logs:{}, selectedDay:"mon"};
let state = loadState();
let currentSeconds = 90, timerInterval = null, deferredInstallPrompt = null;

const exercise = (name, sets, reps, rest, muscles, cues, caution="Interrompa se houver dor crescente ou se a técnica mudar.") => ({name,sets,reps,rest,muscles,cues,caution});
const workouts = {
 mon:{name:"Superior A",duration:"60–80 min",note:"Peito, costas, ombros e braços. Prefira posições estáveis e apoio para o tronco quando necessário.",exercises:[
  exercise("Supino inclinado com halteres",3,"8–12",120,"Peito, tríceps, deltoide anterior","Pés firmes, punhos alinhados e escápulas apoiadas. Use amplitude confortável.","Se arquear a lombar provocar sintomas, reduza a carga ou use máquina com encosto."),
  exercise("Puxada alta na polia",3,"8–12",120,"Dorsais e bíceps","Puxe à frente até a parte superior do peito, sem balançar o tronco.","Não puxe atrás da nuca."),
  exercise("Remada com apoio no peito",3,"8–12",120,"Costas e bíceps","Mantenha o peito apoiado e conduza os cotovelos para trás.","Prefira esta versão à remada curvada se a lombar incomodar."),
  exercise("Supino máquina",2,"10–12",90,"Peito e tríceps","Costas apoiadas, movimento controlado, sem travar os cotovelos com força."),
  exercise("Elevação lateral sentada",2,"12–15",75,"Deltoide lateral","Eleve os braços sem impulso e sem encolher os ombros."),
  exercise("Rosca na polia",2,"10–15",75,"Bíceps","Cotovelos próximos ao corpo, sem balançar."),
  exercise("Tríceps na corda",2,"10–15",75,"Tríceps","Cotovelos estáveis e retorno controlado.")
 ]},
 tue:{name:"Inferior A — adaptado",duration:"40–60 min",note:"Comece com 1–2 séries e cargas leves. Como agachar provoca desconforto, não faça agachamento pesado nem force a amplitude.",exercises:[
  exercise("Flexora sentada ou mesa flexora",2,"10–15",90,"Posteriores da coxa","Ajuste a máquina e controle as duas fases do movimento."),
  exercise("Cadeira extensora — somente se confortável",1,"12–15",75,"Quadríceps","Carga baixa e amplitude confortável; pare se o joelho doer ou o desconforto aumentar.","Não use para testar ou atravessar a dor. Pode ser omitida até avaliação."),
  exercise("Cadeira abdutora",2,"12–20",75,"Músculos laterais do quadril","Mantenha a pelve estável, sem impulso."),
  exercise("Panturrilha sentada",2,"12–20",75,"Panturrilhas","Faça movimento controlado, sem quicar."),
  exercise("Ponte de glúteos sem carga — opcional",1,"8–12",60,"Glúteos","Movimento curto e confortável, sem arquear a lombar.","Omita se reproduzir o desconforto lombar.")
 ]},
 thu:{name:"Superior B",duration:"60–80 min",note:"Costas, peito, ombros e braços. Evite posições em pé que façam a lombar compensar.",exercises:[
  exercise("Remada baixa com apoio, se disponível",3,"8–12",120,"Costas e bíceps","Tronco estável, sem arredondar a lombar.","Se não houver apoio e a lombar incomodar, prefira outra máquina de remada apoiada."),
  exercise("Supino reto com halteres ou máquina",3,"8–12",120,"Peito e tríceps","Pés apoiados, punhos alinhados e amplitude confortável.","Se a posição provocar arqueamento lombar, use máquina com encosto."),
  exercise("Puxada alta com pegada neutra",2,"10–12",100,"Dorsais e bíceps","Puxe à frente sem balançar."),
  exercise("Crucifixo inverso na máquina",2,"12–15",75,"Deltoide posterior e parte superior das costas","Peito apoiado e ombros afastados das orelhas."),
  exercise("Desenvolvimento na máquina com encosto",2,"8–12",120,"Ombros e tríceps","Encosto ajustado e amplitude confortável.","Se causar desconforto no ombro ou lombar, retire o exercício."),
  exercise("Rosca martelo sentada",2,"10–15",75,"Bíceps e braquial","Punhos neutros, sem balançar o tronco."),
  exercise("Tríceps na polia",2,"10–15",75,"Tríceps","Cotovelos estáveis e retorno controlado.")
 ]},
 fri:{name:"Inferior B — adaptado",duration:"40–60 min",note:"Não precisa fazer movimentos que provoquem sintomas para ter um treino produtivo. Use apenas opções confortáveis.",exercises:[
  exercise("Flexora sentada",2,"10–15",90,"Posteriores da coxa","Costas apoiadas e retorno controlado."),
  exercise("Cadeira abdutora",2,"12–20",75,"Músculos laterais do quadril","Pelve estável e sem impulso."),
  exercise("Panturrilha sentada",2,"12–20",75,"Panturrilhas","Amplitude confortável, sem quicar."),
  exercise("Extensão de quadril na máquina — opcional",1,"12–15",75,"Glúteos","Movimento pequeno e controlado, sem arquear a lombar.","Retire se provocar desconforto lombar.")
 ]},
 sat:{name:"Especialização opcional",duration:"35–55 min",note:"Inclua a partir da semana 3 somente se estiver recuperando bem. Não é obrigatório; pode trocar por descanso ou cardio confortável.",exercises:[
  exercise("Elevação lateral sentada ou máquina",3,"12–20",75,"Deltoide lateral","Sem impulso e sem elevar excessivamente os ombros."),
  exercise("Rosca Scott na máquina",2,"10–15",75,"Bíceps","Braços apoiados; evite estender os cotovelos bruscamente."),
  exercise("Tríceps na polia",2,"10–15",75,"Tríceps","Cotovelos estáveis."),
  exercise("Rosca martelo sentada",2,"12–15",75,"Bíceps e braquial","Punhos neutros e descida controlada."),
  exercise("Abdominal na polia — somente se confortável",2,"10–15",75,"Abdômen","Movimento controlado, sem puxar com os braços.","Como há desconforto lombar sem causa esclarecida, omita se reproduzir sintomas."),
  exercise("Prancha elevada na parede ou bancada — opcional",2,"15–30 s",60,"Estabilizadores do tronco","Mantenha o corpo alinhado e respire normalmente.","Não faça se provocar dor lombar.")
 ]}
};
workouts.wed={name:"Especialização — ombros e braços",duration:"40–60 min",note:"A partir da semana 5, quarta vira um treino de hipertrofia para ombros e braços, com exercícios predominantemente sentados ou apoiados. Cardio fica opcional e separado. Faça apenas se estiver recuperando bem e os sintomas não piorarem.",exercises:[
  exercise("Elevação lateral sentada ou máquina",3,"12–20",75,"Deltoide lateral","Costas apoiadas quando possível; suba sem impulso e sem encolher os ombros."),
  exercise("Crucifixo inverso na máquina",3,"12–15",75,"Deltoide posterior e parte superior das costas","Mantenha o peito apoiado e controle a volta."),
  exercise("Rosca Scott na máquina",3,"10–15",75,"Bíceps","Braços apoiados; evite estender os cotovelos bruscamente."),
  exercise("Tríceps na polia, sentado se possível",3,"10–15",75,"Tríceps","Mantenha os cotovelos estáveis e evite inclinar ou arquear a lombar."),
  exercise("Rosca martelo sentada",2,"10–15",75,"Bíceps e braquial","Punhos neutros, costas apoiadas e sem balanço."),
  exercise("Elevação lateral na polia — leve, opcional",2,"12–15",60,"Deltoide lateral","Use carga leve e mantenha o tronco estável.","Omita se houver desconforto no ombro ou se não estiver recuperado do treino de segunda.")
]};
const dayInfo = [
 {id:"mon",day:"Segunda",short:"SEG",key:"Superior A",kind:"train"},
 {id:"tue",day:"Terça",short:"TER",key:"Inferior A",kind:"train"},
 {id:"wed",day:"Quarta",short:"QUA",key:"Recuperação",kind:"rest"},
 {id:"thu",day:"Quinta",short:"QUI",key:"Superior B",kind:"train"},
 {id:"fri",day:"Sexta",short:"SEX",key:"Inferior B",kind:"train"},
 {id:"sat",day:"Sábado",short:"SÁB",key:"Opcional",kind:"optional"},
 {id:"sun",day:"Domingo",short:"DOM",key:"Descanso",kind:"rest"}
];
function loadState(){try{return {...defaultState,...JSON.parse(localStorage.getItem(STORE)||"{}")}}catch{return {...defaultState}}}
function saveState(){localStorage.setItem(STORE,JSON.stringify(state))}
function phaseFor(week){if(week<=2)return {pill:"Readaptação",subtitle:"Volta gradual",desc:"4 dias de musculação. Faça 1–2 séries por exercício, carga leve e termine com 3–4 repetições em reserva. Quarta é recuperação; sábado sem musculação.",progress:20};if(week<=4)return {pill:"Construção",subtitle:"Consolidar rotina",desc:"Mantenha os 4 dias principais. Quarta segue como recuperação; a partir da semana 3, sábado pode ser especialização opcional se estiver recuperando bem.",progress:55};return {pill:"Progressão",subtitle:"Desenvolvimento",desc:"A partir da semana 5, quarta vira treino de especialização para ombros e braços. Mantenha o sábado opcional; cardio leve fica separado e pode ser feito em outro dia.",progress:100}}
function keyFor(week,day){return `${week}_${day}`}
function logFor(week,day){const k=keyFor(week,day);if(!state.logs[k])state.logs[k]={sets:{},done:false};return state.logs[k]}
function workoutFor(day){return workouts[day]}
function activeDays(){return dayInfo.map(d=>({...d,key:(d.id==="wed"&&state.week>=5)?"Ombros + braços":d.key,kind:(d.id==="wed"&&state.week>=5)?"train":d.kind,enabled:d.kind==="train"||(d.id==="sat"&&state.week>=3)||(d.id==="wed"&&state.week>=5)}))}
function renderWeek(){const p=phaseFor(state.week);$("weekLabel").textContent=`Semana ${state.week}`;$("weekSubtitle").textContent=p.subtitle;$("phasePill").textContent=p.pill;$("phaseDescription").textContent=p.desc;$("phaseProgress").style.width=p.progress+"%";$("prevWeek").disabled=state.week<=1;$("prevWeek").style.opacity=state.week<=1?".35":"1";$("nextWeek").disabled=state.week>=52;$("nextWeek").style.opacity=state.week>=52?".35":"1"}
function renderDays(){const grid=$("dayGrid");grid.innerHTML="";activeDays().forEach(d=>{const log=logFor(state.week,d.id);const dynamicKind=(d.id==="wed"&&state.week>=5)?"train":d.kind;const disabled=(d.id==="sat"&&state.week<3)||(d.id==="wed"&&state.week<5);const btn=document.createElement("button");btn.type="button";btn.className="day-card"+(state.selectedDay===d.id?" selected":"");let status=log.done?"✓":disabled?"—":dynamicKind==="rest"?"•":"→";btn.innerHTML=`<span class="checkmark">${status}</span><span class="day-name">${d.short}</span><strong>${d.key}</strong><small>${log.done?"Concluído":disabled?(d.id==="sat"?"Opcional a partir da semana 3":"Recuperação até semana 5"):dynamicKind==="rest"?(d.id==="wed"?"Recuperação":"Descanso"): "Abrir sessão"}</small>`;btn.addEventListener("click",()=>{state.selectedDay=d.id;saveState();renderAll()});grid.appendChild(btn)})}
function renderWorkout(){const day=state.selectedDay;const d=dayInfo.find(x=>x.id===day);const panel=$("workoutPanel");const isRestDay=!d||(d.kind==="rest"&&!(d.id==="wed"&&state.week>=5))||(d.id==="sat"&&state.week<3);if(isRestDay){ $("workoutEyebrow").textContent=d?.day.toUpperCase()||"RECUPERAÇÃO";$("workoutTitle").textContent=d?.id==="wed"?(state.week>=5?"Cardio + core leve":"Recuperação ativa"):"Dia de descanso";$("workoutDuration").textContent="Sem musculação";$("workoutNote").textContent=d?.id==="wed"?(state.week>=5?"Sessão leve de cardio e estabilidade do tronco.":"Caminhada de 20–30 minutos se confortável; levante-se regularmente durante o expediente. Não precisa fazer alongamentos dolorosos."):"Descanso também faz parte do progresso. Se quiser, faça apenas atividade leve que não provoque sintomas."; $("exerciseList").innerHTML='<div class="empty-state">Nenhum exercício obrigatório neste dia.</div>';$("completeArea").classList.add("hidden");return}
 const w=workoutFor(day);if(!w)return;$("workoutEyebrow").textContent=d.day.toUpperCase()+" · TREINO";$("workoutTitle").textContent=w.name;$("workoutDuration").textContent=w.duration;$("workoutNote").textContent=w.note;$("completeArea").classList.remove("hidden");
 const log=logFor(state.week,day);const list=$("exerciseList");list.innerHTML="";
 w.exercises.forEach((ex,idx)=>{const card=document.createElement("article");const exLog=log.sets[idx]||{};const total=state.week<=2?Math.min(ex.sets,2):ex.sets;const completed=Array.from({length:total},(_,i)=>exLog[i]?.checked).every(Boolean);card.className="exercise-card"+(completed?" done":"");
 let setRows="";for(let i=0;i<total;i++){const s=exLog[i]||{};setRows+=`<div class="set-row"><span>S${i+1}</span><input aria-label="Carga exercício ${ex.name}, série ${i+1}" type="number" min="0" step="0.5" placeholder="kg" data-field="weight" data-ex="${idx}" data-set="${i}" value="${s.weight??""}"><input aria-label="Repetições exercício ${ex.name}, série ${i+1}" type="number" min="0" step="1" placeholder="reps" data-field="reps" data-ex="${idx}" data-set="${i}" value="${s.reps??""}"><input class="set-check" type="checkbox" aria-label="Marcar série concluída" data-field="checked" data-ex="${idx}" data-set="${i}" ${s.checked?"checked":""}></div>`}
 card.innerHTML=`<div class="exercise-top"><div class="exercise-num">${idx+1}</div><div class="exercise-info"><h3>${ex.name}</h3><div class="exercise-meta">${total} séries · ${ex.reps} reps · descanso ${formatRest(ex.rest)}</div><div class="exercise-tags"><span class="tag">${ex.muscles}</span><span class="tag">RIR 3–4 no início</span></div><p>${ex.cues}</p>${ex.caution?`<p class="caution-text">⚠ ${ex.caution}</p>`:""}</div></div><div class="sets"><div class="sets-head"><span>Série</span><span>Carga (kg)</span><span>Reps feitas</span><span>✓</span></div>${setRows}</div>`;
 card.querySelectorAll("input").forEach(input=>input.addEventListener("change",()=>{const li=logFor(state.week,day);const ei=input.dataset.ex,si=input.dataset.set,field=input.dataset.field;if(!li.sets[ei])li.sets[ei]={};if(!li.sets[ei][si])li.sets[ei][si]={};li.sets[ei][si][field]=field==="checked"?input.checked:(input.value===""?"":Number(input.value));saveState();if(field==="checked"){renderDays();renderStreak();card.classList.toggle("done",Array.from({length:total},(_,i)=>li.sets[ei]?.[i]?.checked).every(Boolean))}}));
 list.appendChild(card);
 });
 $("completeWorkout").textContent=log.done?"Treino concluído ✓":"Concluir treino";
 $("completeWorkout").onclick=()=>{const l=logFor(state.week,day);if(l.done){toast("Este treino já está no histórico.");return}l.done=true;state.history.unshift({date:new Date().toISOString(),week:state.week,day,name:w.name,sets:l.sets});state.history=state.history.slice(0,100);saveState();renderAll();toast("Treino salvo no histórico!")};
}
function formatRest(sec){return sec>=60?`${Math.floor(sec/60)} min${sec%60?` ${sec%60}s`:""}`:`${sec}s`}
function renderStreak(){$("streakValue").textContent=state.history.length}
function renderHistory(){const list=$("historyList");if(!state.history.length){list.innerHTML='<div class="empty-state">Ainda não há treinos concluídos. Seu primeiro registro aparecerá aqui.</div>';return}list.innerHTML=state.history.slice(0,6).map(h=>`<div class="history-item"><div><strong>${escapeHtml(h.name)}</strong><div class="small muted">Semana ${h.week}</div></div><span>${new Date(h.date).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})}<br>${new Date(h.date).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span></div>`).join("")}
function renderMeasures(){const el=$("measureHistory");if(!state.measures.length){el.innerHTML='<div class="empty-state">Registre peso e cintura para acompanhar tendências.</div>';return}el.innerHTML=state.measures.slice(0,5).map(m=>`<div class="measure-row"><span>${new Date(m.date).toLocaleDateString("pt-BR")}</span><span>${m.weight?escapeHtml(String(m.weight))+" kg":"—"} · ${m.waist?escapeHtml(String(m.waist))+" cm cintura":"sem cintura"}</span></div>`).join("")}
function renderAll(){renderWeek();renderDays();renderWorkout();renderStreak();renderHistory();renderMeasures()}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.remove("hidden");setTimeout(()=>t.classList.add("hidden"),2600)}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("prevWeek").onclick=()=>{state.week=Math.max(1,state.week-1);saveState();renderAll()};
$("nextWeek").onclick=()=>{state.week=Math.min(52,state.week+1);saveState();renderAll()};
document.querySelectorAll(".timer-preset").forEach(b=>b.onclick=()=>{stopTimer();currentSeconds=Number(b.dataset.seconds);document.querySelectorAll(".timer-preset").forEach(x=>x.classList.toggle("active",x===b));renderTimer()});
function renderTimer(){$("timerDisplay").textContent=`${String(Math.floor(currentSeconds/60)).padStart(2,"0")}:${String(currentSeconds%60).padStart(2,"0")}`}
function stopTimer(){if(timerInterval)clearInterval(timerInterval);timerInterval=null;$("timerStart").textContent="Iniciar"}
$("timerStart").onclick=()=>{if(timerInterval){stopTimer();return}if(currentSeconds<=0)currentSeconds=90;$("timerStart").textContent="Pausar";timerInterval=setInterval(()=>{currentSeconds--;renderTimer();if(currentSeconds<=0){stopTimer();currentSeconds=0;renderTimer();toast("Descanso concluído!");if("vibrate"in navigator)navigator.vibrate([150,80,150])}},1000)};
$("timerReset").onclick=()=>{stopTimer();currentSeconds=90;document.querySelectorAll(".timer-preset").forEach(x=>x.classList.toggle("active",x.dataset.seconds==="90"));renderTimer()};
$("measureForm").onsubmit=e=>{e.preventDefault();const weight=$("weightInput").value,waist=$("waistInput").value;if(!weight&&!waist){toast("Informe peso ou cintura.");return}state.measures.unshift({date:new Date().toISOString(),weight:weight?Number(weight):null,waist:waist?Number(waist):null});state.measures=state.measures.slice(0,100);saveState();$("weightInput").value="";$("waistInput").value="";renderMeasures();toast("Medida salva neste aparelho.")};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="meu-treino-backup.json";a.click();URL.revokeObjectURL(url);toast("Backup exportado.")};
$("clearHistory").onclick=()=>{if(confirm("Apagar os treinos concluídos do histórico? Os registros de carga e medidas serão mantidos.")){state.history=[];Object.values(state.logs).forEach(l=>l.done=false);saveState();renderAll();toast("Histórico apagado.")}};
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;$("installBtn").classList.remove("hidden")});
$("installBtn").onclick=async()=>{if(!deferredInstallPrompt){toast("Use o menu do navegador e escolha Instalar app ou Adicionar à tela inicial.");return}deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;$("installBtn").classList.add("hidden")};
if("serviceWorker"in navigator && (location.protocol==="https:"||location.hostname==="localhost"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
renderAll();renderTimer();
