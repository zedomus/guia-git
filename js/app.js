const toast = document.getElementById('toast');
function showToast(msg){
  toast.textContent = msg;
  toast.style.display = 'block';
  clearTimeout(window.__t);
  window.__t = setTimeout(()=> toast.style.display='none', 1200);
}

document.querySelectorAll('[data-copy]').forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    const sel = btn.getAttribute('data-copy');
    const el = document.querySelector(sel);
    if(!el) return;
    const text = el.innerText.trim();
    try{
      await navigator.clipboard.writeText(text);
      showToast('Copiado ✅');
    }catch(e){
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copiado ✅');
    }
  });
});

// --- Progress (checkboxes) ---
const storageKey = 'git-pap-progress-v1';
const checks = Array.from(document.querySelectorAll('input[type="checkbox"][data-check]'));

function loadProgress(){
  try{
    const raw = localStorage.getItem(storageKey);
    if(!raw) return {};
    return JSON.parse(raw);
  }catch(e){
    return {};
  }
}
function saveProgress(state){
  localStorage.setItem(storageKey, JSON.stringify(state));
}

const state = loadProgress();
checks.forEach(ch=>{
  const key = ch.getAttribute('data-check');
  if(state[key] === true) ch.checked = true;

  ch.addEventListener('change', ()=>{
    state[key] = ch.checked;
    saveProgress(state);
  });
});

document.getElementById('markAll')?.addEventListener('click', ()=>{
  checks.forEach(ch=>{
    ch.checked = true;
    state[ch.getAttribute('data-check')] = true;
  });
  saveProgress(state);
  showToast('Tudo marcado ✅');
});

document.getElementById('unmarkAll')?.addEventListener('click', ()=>{
  checks.forEach(ch=>{
    ch.checked = false;
    state[ch.getAttribute('data-check')] = false;
  });
  saveProgress(state);
  showToast('Tudo desmarcado');
});

document.getElementById('resetStorage')?.addEventListener('click', ()=>{
  localStorage.removeItem(storageKey);
  checks.forEach(ch=> ch.checked = false);
  showToast('Progresso limpo');
});

// --- Quizzes ---
const quizAnswers = {
  q1: { "q1-1": "b" },
  q2: { "q2-1": "b" },
  q3: { "q3-1": "a" }
};

function gradeQuiz(id){
  const answers = quizAnswers[id];
  let ok = 0, total = 0;
  for(const name in answers){
    total++;
    const chosen = document.querySelector(`input[name="${name}"]:checked`);
    if(chosen && chosen.value === answers[name]) ok++;
  }
  return { ok, total };
}

document.querySelectorAll('[data-check-quiz]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.getAttribute('data-check-quiz');
    const {ok, total} = gradeQuiz(id);
    const res = document.getElementById(`res-${id}`);
    if(!res) return;
    res.style.display = 'block';
    if(ok === total){
      res.style.borderColor = 'rgba(51,209,122,.35)';
      res.style.background = 'rgba(51,209,122,.10)';
      res.textContent = `✅ Certo! (${ok}/${total})`;
    }else{
      res.style.borderColor = 'rgba(255,204,102,.35)';
      res.style.background = 'rgba(255,204,102,.10)';
      res.textContent = `⚠️ Ainda não. (${ok}/${total}) Revê os passos e tenta outra vez.`;
    }
  });
});

// --- Active nav on scroll ---
const sections = Array.from(document.querySelectorAll('main .hero, main .section'));
const navLinks = Array.from(document.querySelectorAll('#nav a'));

const byId = new Map();
navLinks.forEach(a=>{
  const id = a.getAttribute('href').replace('#','');
  byId.set(id, a);
});

const obs = new IntersectionObserver((entries)=>{
  entries.forEach(ent=>{
    if(ent.isIntersecting){
      navLinks.forEach(l=> l.classList.remove('active'));
      const id = ent.target.id;
      const link = byId.get(id);
      if(link) link.classList.add('active');
    }
  });
}, {root:null, threshold:0.35});

sections.forEach(s=> obs.observe(s));