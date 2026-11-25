'use strict';
const sources = {
 ip:{title:'Предпринимательский кодекс РК',date:'29.10.2015 · № 375-V ЗРК',article:'Статья 35',url:'https://adilet.zan.kz/rus/docs/K1500000375'},
 too:{title:'Закон РК о товариществах с ограниченной и дополнительной ответственностью',date:'22.04.1998 · № 220-I',article:'Статья 2',url:'https://adilet.zan.kz/rus/docs/Z980000220_'},
 tax:{title:'Налоговый кодекс РК',date:'18.07.2025 · № 214-VIII ЗРК',article:'Статья 723 — для проверки условий упрощённой декларации',url:'https://adilet.zan.kz/rus/docs/K2500000214'},
 permit:{title:'Закон РК «О разрешениях и уведомлениях»',date:'16.05.2014 · № 202-V ЗРК',article:'Статья 17; приложения 1–3',url:'https://adilet.zan.kz/rus/docs/Z1400000202'},
 staff:{title:'Трудовой кодекс РК',date:'23.11.2015 · № 414-V ЗРК',article:'Статья 33',url:'https://adilet.zan.kz/rus/docs/K1500000414'}
};
const guides = [
 {cat:'registration',title:'Как оформляется ИП?',text:'Регистрация ИП означает постановку физического лица на учёт в органе государственных доходов. Перед началом деятельности проверьте, требуется ли регистрация в вашем случае.',source:'ip'},
 {cat:'registration',title:'Кто может учредить ТОО?',text:'ТОО может иметь одного или нескольких участников. Их доли определяются учредительными документами. Условия создания и ответственности изучайте по закону о ТОО.',source:'too'},
 {cat:'registration',title:'Что означает ограниченная ответственность?',text:'По общему правилу риск участников ТОО связан со стоимостью вкладов; законодательство предусматривает исключения, в том числе для невнесённой части вклада.',source:'too'},
 {cat:'tax',title:'Как проверить право на налоговый режим?',text:'Сопоставьте вид деятельности и параметры бизнеса с актуальными условиями Налогового кодекса. Для упрощённой декларации начните со статьи 723. Сайт не рассчитывает налог и не определяет право на режим.',source:'tax'},
 {cat:'permit',title:'Когда нужны разрешения и уведомления?',text:'Для отдельных видов деятельности закон устанавливает разрешительный либо уведомительный порядок. Найдите точный вид деятельности в приложениях закона до начала работы.',source:'permit'},
 {cat:'staff',title:'Что проверить при найме сотрудника?',text:'Допуск к работе осуществляется после заключения трудового договора. Проверьте порядок оформления договора и другие обязанности работодателя.',source:'staff'}
];
const questions=[
 {title:'На каком этапе вы находитесь?',help:'Выберите текущий этап. Можно вернуться и изменить ответ.',options:[['plan','Только планирую открыть бизнес'],['choose','Выбираю между ИП и ТОО'],['active','Бизнес уже зарегистрирован']]},
 {title:'Какой вид деятельности вы рассматриваете?',help:'Выберите наиболее близкую категорию. Это не код ОКЭД.',options:[['online','Интернет-магазин'],['food','Кофейня / общественное питание'],['clean','Клининговая компания'],['other','Другой вид / пока не определился']]},
 {title:'Как будет устроена ваша команда?',help:'Учитывайте предполагаемых партнёров и сотрудников.',options:[['solo','Работаю самостоятельно'],['partners','С бизнес-партнёрами'],['staff','С наёмными сотрудниками'],['both','С партнёрами и сотрудниками'],['unknown','Пока не определился']]},
 {title:'Какую форму бизнеса вы рассматриваете?',help:'Ответ нужен для выбора справочных материалов, а не для юридического заключения.',options:[['ip','Индивидуальный предприниматель (ИП)'],['too','Товарищество с ограниченной ответственностью (ТОО)'],['unknown','Пока не знаю']]}
];
const $=id=>document.getElementById(id);
const make=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el;};
function sourceLink(key){const s=sources[key];const a=make('a','legal-link',s.title+' · '+s.article+' ↗');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';return a;}
function renderGuide(filter='all'){
 const list=$('guide-list');list.replaceChildren();
 guides.filter(g=>filter==='all'||g.cat===filter).forEach(g=>{const d=make('details','guide-card');d.append(make('summary','',g.title));const body=make('div','detail');body.append(make('p','',g.text),sourceLink(g.source));d.append(body);list.append(d);});
 document.querySelectorAll('.filters button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
}
function renderSources(){Object.values(sources).forEach((s,i)=>{const card=make('article','source-card');card.append(make('span','index','НПА / 0'+(i+1)),make('h3','',s.title),make('p','',s.date+' · '+s.article));const a=make('a','legal-link','Открыть в «Әділет» ↗');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';card.append(a);$('source-list').append(card);});}
let step=0,answers=Array(questions.length).fill(null);
function renderQuestion(focus=false){
 $('question-area').hidden=false;$('result').hidden=true;
 const q=questions[step];$('step-label').textContent=`ШАГ ${step+1} ИЗ ${questions.length}`;const pc=Math.round(step/questions.length*100);$('percent').textContent=pc+'%';$('progress-fill').style.width=pc+'%';$('question').textContent=q.title;$('question-help').textContent=q.help;$('options').replaceChildren();$('error').hidden=true;
 q.options.forEach(([value,label])=>{const b=make('button','option');b.type='button';b.setAttribute('aria-pressed',String(answers[step]===value));b.append(make('span','radio-dot'),make('span','',label));b.addEventListener('click',()=>{answers[step]=value;document.querySelectorAll('.option').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));$('error').hidden=true;});$('options').append(b);});
 $('back').disabled=step===0;$('next').textContent=step===questions.length-1?'Получить чек-лист →':'Далее →';document.querySelectorAll('#steps li').forEach((li,i)=>{li.classList.toggle('current',i===step);li.classList.toggle('done',i<step);if(i===step)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});if(focus)$('question').focus({preventScroll:true});
}
function buildChecklist([stage,activity,team,form]){
 const tasks=[];const add=(title,text,source)=>tasks.push({title,text,source});
 if(stage==='active')add('Сверить действующую регистрацию','Проверьте, соответствуют ли регистрационные сведения фактической деятельности. Для ИП начните со статьи 35; для ТОО дополнительно проверьте учредительные документы.',form==='too'?'too':'ip');
 if(stage==='choose'||form==='unknown')add('Сравнить ИП и ТОО','Изучите статус физического лица при ИП и устройство ТОО. Не выбирайте форму только на основании одного ответа.','too');
 if(form==='ip'||form==='unknown')add('Проверить правила регистрации ИП','Уточните, требуется ли постановка на учёт, и какие условия применяются к вашей ситуации.','ip');
 if(form==='too'||form==='unknown'||team==='partners'||team==='both')add('Изучить устройство ТОО','Проверьте состав участников, доли, учредительные документы и ответственность. Наличие партнёров само по себе не определяет обязательную форму бизнеса.','too');
 const activityTasks={online:['Проверить требования к интернет-магазину','Уточните точный вид товаров и найдите применимые разрешения или уведомления, если они предусмотрены.'],retail:['Проверить требования к торговле','Сверьте точный ассортимент и формат торговли с перечнями разрешений и уведомлений.'],it:['Проверить требования к цифровым услугам','Уточните вид услуг и наличие специальных разрешительных требований.'],food:['Проверить требования к общепиту','Уточните формат заведения, санитарные требования и применимые разрешения или уведомления.'],education:['Проверить требования к образовательным услугам','Уточните вид обучения и проверьте, предусмотрено ли лицензирование или уведомление.'],clean:['Проверить требования к клинингу','Уточните перечень услуг, используемые средства и наличие специальных требований к выбранной деятельности.'],other:['Уточнить вид деятельности','Определите точную деятельность и проверьте её по перечням разрешений и уведомлений.']};
 add(...activityTasks[activity],'permit');
 add('Проверить налоговый режим','Сопоставьте параметры и вид деятельности с актуальным Налоговым кодексом. Для упрощённой декларации изучите статью 723.','tax');
 if(team==='staff'||team==='both')add('Подготовиться к найму','Изучите порядок заключения трудовых договоров до допуска сотрудников к работе.','staff');
 if(team==='unknown')add('Уточнить будущую команду','Если планируется найм, заранее изучите требования к трудовым договорам.','staff');
 if(team==='partners'||team==='both')add('Согласовать условия сотрудничества','Обсудите распределение долей, роли и порядок принятия решений; проверьте нормы о ТОО, если рассматриваете эту форму.','too');
 return tasks;
}
function showResult(){
 $('question-area').hidden=true;const r=$('result');r.hidden=false;r.replaceChildren();document.querySelectorAll('#steps li').forEach(li=>{li.classList.remove('current');li.classList.add('done');li.removeAttribute('aria-current');});
 r.append(make('div','result-label','✓ СПРАВОЧНЫЙ МАРШРУТ ГОТОВ'),make('h3','','Ваш чек-лист'),make('p','','Проверьте эти темы по первоисточникам. Это учебный список, а не подтверждение готовности к регистрации.'));
 const summary=answers.map((v,i)=>questions[i].options.find(([key])=>key===v)[1]).join(' · ');r.append(make('p','',summary));const tasks=buildChecklist(answers);const progress=make('p','result-progress');progress.setAttribute('role','status');const list=make('div','result-items');let done=0;const update=()=>{progress.textContent=`Отмечено ${done} из ${tasks.length} пунктов · ${Math.round(done/tasks.length*100)}%`;};update();r.append(progress,list);
 tasks.forEach((task,i)=>{const item=make('div','result-item');const input=make('input');input.type='checkbox';input.id='task-'+i;const body=make('div');const label=make('label','',task.title);label.htmlFor=input.id;body.append(label,make('p','',task.text),sourceLink(task.source));input.addEventListener('change',()=>{done+=input.checked?1:-1;item.classList.toggle('done',input.checked);update();});item.append(input,body);list.append(item);});
 const actions=make('div','result-actions');[['Начать заново',()=>{answers.fill(null);step=0;renderQuestion(true);}],['Изменить ответы',()=>{step=0;renderQuestion(true);}],['Распечатать',()=>window.print()]].forEach(([label,fn],i)=>{const b=make('button','button '+(i===0?'primary':'secondary'),label);b.addEventListener('click',fn);actions.append(b);});r.append(actions);r.setAttribute('tabindex','-1');r.focus({preventScroll:true});
}
if ($('question-area')) {
$('next').addEventListener('click',()=>{if(answers[step]===null){$('error').textContent='Выберите один из вариантов, чтобы продолжить.';$('error').hidden=false;return;}if(step<questions.length-1){step++;renderQuestion(true);}else showResult();});
$('back').addEventListener('click',()=>{if(step>0){step--;renderQuestion(true);}});
renderQuestion();
}
$('menu-toggle').addEventListener('click',()=>{const open=$('menu').classList.toggle('open');$('menu-toggle').setAttribute('aria-expanded',String(open));$('menu-toggle').setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');$('menu-toggle').textContent=open?'×':'☰';});
$('menu').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if($('menu').classList.contains('open'))$('menu-toggle').click();}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('menu').classList.contains('open'))$('menu-toggle').click();});
if ($('guide-list')) {
 const filterButtons = document.querySelectorAll('.filters button[data-filter]');
 filterButtons.forEach(el => el.addEventListener('click', () => renderGuide(el.dataset.filter)));
 const topic = new URLSearchParams(window.location.search).get('topic');
 renderGuide(Array.from(filterButtons).some(el => el.dataset.filter === topic) ? topic : 'all');
}
if ($('source-list')) renderSources();
