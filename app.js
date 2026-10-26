const $ = id => document.getElementById(id);
const STORE = 'meuTreinoFoco_v1';
let selectedDay = 'mon';
let logs = {};
try { logs = JSON.parse(localStorage.getItem(STORE) || '{}'); } catch {}
const exercise = (name, sets, reps, muscles, cues='Faça o movimento controlado e mantenha a técnica estável.') => ({name,sets,reps,muscles,cues});
const workouts = {
 mon:{day:'SEGUNDA',name:'Peito + tríceps + ombro',duration:'60–75 min',note:'Prioridade para peito, tríceps e deltoide lateral.',exercises:[
  exercise('Supino máquina ou com halteres',3,'6–10','Peito, tríceps e deltoide anterior','Pés firmes, escápulas apoiadas e amplitude confortável.'),
  exercise('Supino inclinado',3,'8–10','Peito superior e tríceps','Controle a descida e não force a lombar a arquear.'),
  exercise('Crucifixo na polia',2,'10–15','Peito','Mantenha os cotovelos levemente flexionados e não force o alongamento.'),
  exercise('Tríceps na polia',3,'8–12','Tríceps','Cotovelos estáveis e retorno controlado.'),
  exercise('Tríceps acima da cabeça',2,'10–15','Tríceps','Use amplitude confortável; pode fazer na polia.'),
  exercise('Elevação lateral',3,'12–15','Deltoide lateral','Sem impulso e sem encolher os ombros.')
 ]},
 tue:{day:'TERÇA',name:'Costas + bíceps + ombro',duration:'60–75 min',note:'Costas com volume moderado; foco principal em bíceps e ombros.',exercises:[
  exercise('Puxada alta na polia',3,'8–12','Costas e bíceps','Puxe à frente, sem balançar o tronco.'),
  exercise('Remada com apoio no peito',2,'8–12','Costas e bíceps','Mantenha o peito apoiado para reduzir a exigência da lombar.'),
  exercise('Rosca direta',3,'8–12','Bíceps','Cotovelos próximos ao corpo, sem embalar.'),
  exercise('Rosca inclinada ou alternada',2,'10–12','Bíceps','Desça controlando e não force a extensão do cotovelo.'),
  exercise('Desenvolvimento na máquina com encosto',2,'8–12','Ombros e tríceps','Ajuste o encosto e use amplitude sem dor.'),
  exercise('Elevação lateral',3,'12–15','Deltoide lateral','Use carga que permita controlar todas as repetições.'),
  exercise('Crucifixo inverso na máquina',2,'12–15','Deltoide posterior e parte superior das costas','Peito apoiado e movimento controlado.')
 ]},
 wed:{day:'QUARTA',name:'Descanso / cardio leve',duration:'Opcional',note:'Dia de recuperação. Se quiser, faça caminhada confortável. Não precisa transformar o cardio em outro treino pesado.',exercises:[]},
 thu:{day:'QUINTA',name:'Full body adaptado — foco em superiores',duration:'45–65 min',note:'Segundo estímulo da semana para peito e braços, com ênfase extra em ombros.',exercises:[
  exercise('Supino máquina',2,'8–12','Peito e tríceps','Costas apoiadas e movimento controlado.'),
  exercise('Puxada alta',2,'8–12','Costas e bíceps','Puxe à frente sem balançar o tronco.'),
  exercise('Crucifixo na máquina ou polia',2,'10–15','Peito','Não force a amplitude no alongamento.'),
  exercise('Elevação lateral',3,'12–15','Deltoide lateral','Sem impulso, com descida controlada.'),
  exercise('Rosca martelo',3,'10–12','Bíceps e braquial','Punhos neutros e tronco estável.'),
  exercise('Tríceps na polia',3,'10–12','Tríceps','Cotovelos estáveis e retorno controlado.')
 ]},
 fri:{day:'SEXTA',name:'Pernas',duration:'45–60 min',note:'Treino principal de pernas. Ajuste carga e amplitude ao conforto do joelho; não treine atravessando dor.',exercises:[
  exercise('Leg press',2,'6–8','Quadríceps e glúteos','Use amplitude confortável e não trave os joelhos.'),
  exercise('Flexora',3,'6–8','Posteriores da coxa','Controle a subida e a descida.'),
  exercise('Cadeira extensora',3,'8–10','Quadríceps','Faça apenas se for confortável para o joelho; pare se a dor aumentar.'),
  exercise('Mesa flexora',2,'8–10','Posteriores da coxa','Movimento controlado, sem usar impulso.'),
  exercise('Cadeira adutora',2,'8–10','Adutores','Use amplitude confortável e mantenha a pelve apoiada.'),
  exercise('Panturrilha no leg press',3,'8–10','Panturrilhas','Faça a amplitude controlada sem quicar.')
 ]}
};
const days = [{id:'mon',short:'SEG',label:'Segunda'},{id:'tue',short:'TER',label:'Terça'},{id:'wed',short:'QUA',label:'Quarta'},{id:'thu',short:'QUI',label:'Quinta'},{id:'fri',short:'SEX',label:'Sexta'}];
function save(){localStorage.setItem(STORE,JSON.stringify(logs));}
function renderDays(){const grid=$('dayGrid');grid.innerHTML='';days.forEach(d=>{const b=document.createElement('button');b.className='day-card'+(selectedDay===d.id?' selected':'');b.type='button';const count=Object.values(logs[d.id]||{}).filter(Boolean).length;b.innerHTML=`<span class="checkmark">${count?'✓':'→'}</span><span class="day-name">${d.short}</span><strong>${d.label}</strong><small>${count?'Séries marcadas':'Abrir treino'}</small>`;b.onclick=()=>{selectedDay=d.id;renderDays();renderWorkout()};grid.appendChild(b)});}
function renderWorkout(){const w=workouts[selectedDay];$('workoutEyebrow').textContent=w.day+' · TREINO';$('workoutTitle').textContent=w.name;$('workoutDuration').textContent=w.duration;$('workoutNote').textContent=w.note;$('exerciseList').innerHTML='';$('completeArea').classList.toggle('hidden',!w.exercises.length);w.exercises.forEach((ex,i)=>{const card=document.createElement('article');card.className='exercise-card';let rows='';for(let s=0;s<ex.sets;s++){const k=`${i}-${s}`,entry=logs[selectedDay]?.[k]||{};rows+=`<div class="set-row"><span>S${s+1}</span><input aria-label="Carga kg" type="number" min="0" step="0.5" placeholder="kg" data-key="${k}" data-field="weight" value="${entry.weight??''}"><input aria-label="Repetições feitas" type="number" min="0" step="1" placeholder="reps" data-key="${k}" data-field="reps" value="${entry.reps??''}"><input class="set-check" aria-label="Marcar série concluída" type="checkbox" data-key="${k}" data-field="checked" ${entry.checked?'checked':''}></div>`}
card.innerHTML=`<div class="exercise-top"><div class="exercise-num">${i+1}</div><div class="exercise-info"><h3>${ex.name}</h3><div class="exercise-meta">${ex.sets} séries · ${ex.reps} reps</div><div class="exercise-tags"><span class="tag">${ex.muscles}</span></div><p>${ex.cues}</p></div></div><div class="sets"><div class="sets-head"><span>Série</span><span>Carga (kg)</span><span>Reps feitas</span><span>✓</span></div>${rows}</div>`;
card.querySelectorAll('input').forEach(inp=>inp.addEventListener('change',()=>{if(!logs[selectedDay])logs[selectedDay]={};if(!logs[selectedDay][inp.dataset.key])logs[selectedDay][inp.dataset.key]={};logs[selectedDay][inp.dataset.key][inp.dataset.field]=inp.type==='checkbox'?inp.checked:(inp.value===''?'':Number(inp.value));save();renderDays();}));$('exerciseList').appendChild(card);});$('completeWorkout').textContent='Zerar marcações deste treino';$('completeWorkout').onclick=()=>{if(confirm('Deseja desmarcar e limpar as cargas/repetições deste treino?')){logs[selectedDay]={};save();renderDays();renderWorkout();}};}
$('installBtn').classList.add('hidden');window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.installPrompt=e;$('installBtn').classList.remove('hidden')});$('installBtn').onclick=async()=>{if(window.installPrompt){window.installPrompt.prompt();await window.installPrompt.userChoice;window.installPrompt=null;$('installBtn').classList.add('hidden')}else alert('Use o menu do navegador e escolha Instalar app ou Adicionar à tela inicial.');};
if('serviceWorker'in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
renderDays();renderWorkout();
