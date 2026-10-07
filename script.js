// key: title, duration, difficulty (oson | orta | qiyin)
const LESSONS = {
  "m1-l0": ["Web dasturlash haqida","15:43","oson"],
  "m1-l1": ["VSCode kod muharrir","20:01","oson"],
  "m1-l2": ["HTML asoslari","19:58","oson"],
  "m1-l3": ["Asosiy taglar","20:00","oson"],
  "m1-l4": ["Semantic taglar","26:26","orta"],
  "m2-l0": ["CSS ulash","20:16","oson"],
  "m2-l1": ["CSS asoslari","20:15","oson"],
  "m2-l2": ["Block system","24:03","orta"],
  "m2-l3": ["Extra style","14:31","oson"],
  "m2-l4": ["Display - Inline & Inline-Block","19:39","orta"],
  "m2-l5": ["Display - Flex","20:01","qiyin"],
  "m2-l6": ["Display - Grid","10:40","qiyin"],
  "m2-l7": ["Position - Relative, Absolute & Fixed","14:10","orta"],
  "m3-l0": ["Loyihani boshlash","15:05","oson"],
  "m3-l1": ["Bosh sahifa","15:02","oson"],
  "m3-l2": ["Style","15:02","orta"],
  "m3-l3": ["Sahifalar","15:00","oson"],
  "m3-l4": ["Footer","25:04","orta"],
  "m3-l5": ["Responsive","15:11","qiyin"],
  "m4-l0": ["Loyihani boshlash","20:01","oson"],
  "m4-l1": ["Sahifalar","19:58","oson"],
  "m4-l2": ["Class berish","19:58","oson"],
  "m4-l3": ["Bosh sahifa","19:09","orta"],
  "m4-l4": ["Style","19:10","orta"],
  "m4-l5": ["Grid system","19:10","qiyin"],
  "m4-l6": ["Flex","20:21","qiyin"],
  "m4-l7": ["Footer","26:43","orta"],
};
const DIFF_LABEL = { oson: "Oson", orta: "O'rta", qiyin: "Qiyin" };

function baseSlots() {
  return [
    ["06:00–06:20","info","Uyg'onish + tayyorgarlik","Yuz-qo'l yuvish, yengil badan tarbiya, bir stakan suv."],
    ["06:20–06:40","info","Nonushta","Shoshilmasdan, telefon/video'siz."],
  ];
}
function midSlots() {
  return [
    ["07:40–08:00","info","Amaliyot","Ko'rgan narsani VS Code'da o'zingiz qayta yozing."],
    ["08:00–09:00","info","Tayyorgarlik + yo'l","Kiyinish, ishga borish."],
    ["09:00–18:00","work","Ish","Tushlik tanaffusida bo'lsa, kursdan uzilib dam oling."],
    ["18:00–19:00","info","Dam olish + kechki ovqat","Darhol o'qishga o'tirmang, kamida 1 soat dam oling."],
  ];
}
function endSlots() {
  return [
    ["20:00–20:15","info","Tanaffus","Turib yuring, ekrandan uzoqlashing."],
    ["21:15–21:30","info","Kunni yakunlash","O'rgangan narsalarni 3-4 gapda yozib qo'ying."],
    ["21:30–23:00","info","Erkin vaqt","Oila, dam olish, ekrandan imkon qadar uzoqroq."],
    ["23:00","info","Uyqu","Yotishdan 30 daq oldin ekranlarni yopib qo'ying."],
  ];
}

function contentDay(morningKeys, eveningKeys, projectDesc) {
  return {
    type: "content",
    slots: [
      ...baseSlots(),
      ["06:40–07:40","lessons",morningKeys],
      ...midSlots(),
      ["19:00–20:00","lessons",eveningKeys],
      ["20:15–21:15","info", projectDesc ? "Yakuniy loyiha" : "Amaliyot + kichik loyiha", projectDesc || "Bugungi bilimlarni birlashtirib, kichik natija yarating."],
      ...endSlots(),
    ]
  };
}
function bufferDay(afterLabel) {
  return {
    type: "buffer",
    slots: [
      ...baseSlots(),
      ["06:40–08:00","info","Zaxira: qiyin mavzuni qayta ko'rish","Oldingi kunlarda \"Qiyin\" belgili darslardan qiynalganingizni tanlab, video'ni qayta ko'ring va qaytadan amaliyot qiling. Agar hammasi tushunarli bo'lsa, ertaroq keyingi kunga o'ting yoki shunchaki dam oling."],
      ...midSlots(),
      ["19:00–20:30","info","Zaxira: amaliyot va mustahkamlash","Qaysi darsda checkbox belgilanmagan bo'lsa yoki o'zingizga ishonchsiz bo'lsangiz, aynan shu yerda mashq qiling. Kichik loyihangizga qaytib, kodni qayta yozib ko'ring."],
      ...endSlots().filter(s => s[0] !== "20:00–20:15"),
    ]
  };
}

const DAYS = [
  { label: "Kun 1", ...contentDay(["m1-l0","m1-l1"], ["m1-l2","m1-l3"]) },
  { label: "Kun 2", ...contentDay(["m1-l4","m2-l0"], ["m2-l1","m2-l2"]) },
  { label: "Kun 3", ...contentDay(["m2-l3","m2-l4"], ["m2-l5","m2-l6"]) },
  { label: "Zaxira 1", ...bufferDay() },
  { label: "Kun 4", ...contentDay(["m2-l7","m3-l0"], ["m3-l1","m3-l2"]) },
  { label: "Kun 5", ...contentDay(["m3-l3","m3-l4"], ["m3-l5","m4-l0"]) },
  { label: "Kun 6", ...contentDay(["m4-l1","m4-l2"], ["m4-l3","m4-l4"]) },
  { label: "Zaxira 2", ...bufferDay() },
  { label: "Kun 7", ...contentDay(["m4-l5","m4-l6"], ["m4-l7"], "Portfolio saytini to'liq yakunlab, ko'rib chiqing.") },
  { label: "Zaxira 3", ...bufferDay() },
];

const STORAGE_KEY = "course-tracker-schedule-v2";
function toSeconds(mmss) { const [m,s]=mmss.split(":").map(Number); return m*60+s; }
function fmtHMS(sec) { const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60); return h>0 ? `${h}:${String(m).padStart(2,"0")}` : `${m} daq`; }

let state = {};
try { const raw = localStorage.getItem(STORAGE_KEY); state = raw ? JSON.parse(raw) : {}; }
catch(e) { state = {}; }
function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){} }

const tabsEl = document.getElementById("dayTabs");
const panelsEl = document.getElementById("dayPanels");

DAYS.forEach((day, dIdx) => {
  const isBuffer = day.type === "buffer";
  const tab = document.createElement("div");
  tab.className = "day-tab" + (isBuffer ? " buffer-tab" : "") + (dIdx===0 ? " active" : "");
  tab.dataset.day = dIdx;
  tab.innerHTML = day.label + '<span class="dot"></span>';
  tab.addEventListener("click", () => {
    document.querySelectorAll(".day-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".day-panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`.day-panel[data-day="${dIdx}"]`).classList.add("active");
  });
  tabsEl.appendChild(tab);

  const panel = document.createElement("div");
  panel.className = "day-panel" + (dIdx===0 ? " active" : "");
  panel.dataset.day = dIdx;

  if (isBuffer) {
    const banner = document.createElement("div");
    banner.className = "buffer-banner";
    banner.innerHTML = `<strong>Zaxira kun</strong>Bu kunga aniq dars belgilanmagan. Oldingi 3 kunda qiyin bo'lgan mavzuni qayta ko'ring, yoki agar hammasi tushunarli bo'lsa, shunchaki dam oling yoki keyingi kunni erta boshlang.`;
    panel.appendChild(banner);
  }

  const sched = document.createElement("div");
  sched.className = "schedule";

  day.slots.forEach(slot => {
    const [time, type, a, b] = slot;
    const slotEl = document.createElement("div");
    slotEl.className = "slot";
    if (type === "info" || type === "work") {
      slotEl.innerHTML = `
        <div class="slot-info${type==='work'?' work':''}">
          <div class="time-range">${time}</div>
          <div><div class="slot-title">${a}</div>${b ? `<div class="slot-desc">${b}</div>` : ""}</div>
        </div>`;
    } else if (type === "lessons") {
      const keys = a;
      const rowsHtml = keys.map(key => {
        const [title, dur, diff] = LESSONS[key];
        const cbId = "cb-" + key;
        return `
          <div class="lesson-row${state[key] ? ' done' : ''}" data-key="${key}">
            <input type="checkbox" id="${cbId}" ${state[key] ? "checked" : ""}>
            <label for="${cbId}">${title}</label>
            <span class="diff-badge diff-${diff}">${DIFF_LABEL[diff]}</span>
            <span class="ltime">${dur}</span>
          </div>`;
      }).join("");
      slotEl.innerHTML = `<div class="slot-lessons"><span class="time-range">${time}</span>${rowsHtml}</div>`;
    }
    sched.appendChild(slotEl);
  });

  panel.appendChild(sched);
  panelsEl.appendChild(panel);
});

panelsEl.addEventListener("change", (e) => {
  if (e.target.matches('input[type="checkbox"]')) {
    const row = e.target.closest(".lesson-row");
    const key = row.dataset.key;
    state[key] = e.target.checked;
    row.classList.toggle("done", e.target.checked);
    save();
    renderSummary();
  }
});

function renderSummary() {
  let totalLessons = 0, doneLessons = 0, totalSec = 0, doneSec = 0;
  Object.keys(LESSONS).forEach(key => {
    const sec = toSeconds(LESSONS[key][1]);
    totalLessons++; totalSec += sec;
    if (state[key]) { doneLessons++; doneSec += sec; }
  });
  const pct = totalLessons ? Math.round((doneLessons/totalLessons)*100) : 0;
  document.getElementById("pct").innerHTML = pct + "%<span>bajarildi</span>";
  document.getElementById("doneCount").textContent = doneLessons;
  document.getElementById("totalCount").textContent = totalLessons;
  document.getElementById("barFill").style.width = pct + "%";
  document.getElementById("watchedTime").textContent = fmtHMS(doneSec);
  document.getElementById("totalTime").textContent = fmtHMS(totalSec);

  DAYS.forEach((day, dIdx) => {
    const dayKeys = day.slots.filter(s => s[1]==="lessons").flatMap(s => s[2]);
    const allDone = dayKeys.length>0 && dayKeys.every(k => state[k]);
    document.querySelector(`.day-tab[data-day="${dIdx}"]`).classList.toggle("complete", allDone);
  });
}

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Barcha belgilarni tozalashni xohlaysizmi?")) {
    state = {};
    save();
    document.querySelectorAll('.lesson-row input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
      cb.closest(".lesson-row").classList.remove("done");
    });
    renderSummary();
  }
});

renderSummary();