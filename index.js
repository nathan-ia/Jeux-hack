
let state = {
    money: 500, activeNode: 'bureautique', isBroken: false,
    minutes: 480, currentTemp: 30, happy: 0, angry: 0,
    servedBur: 0, servedGam: 0, moneyTotal: 0,
    skills: { secu: 0, cool: 0 },
    servers: {
        bureautique: { ramMax: 64, ramUsed: 0, diskMax: 500, diskUsed: 0, mult: 1.2 },
        gaming: { ramMax: 128, ramUsed: 0, gpuMax: 10, gpuUsed: 0, diskMax: 1000, diskUsed: 0, mult: 5.2, }
    },
    activeContracts: []
};

const costs = {
    bureautique: { ram: 200, disk: 150 },
    gaming: { ram: 400, disk: 300, gpu: 500 }
};

function addLog(t, color = '94a3b8') {
    const entry = document.createElement('div');
    entry.innerHTML = `> ${t}`;
    entry.style.color = (color === 'white') ? '#fff' : (color === 'red') ? 'var(--danger)' : (color === 'success') ? 'var(--success)' : `#${color}`;
    document.getElementById('terminal').prepend(entry);
}

function openTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('btn-' + id).classList.add('active');
}

function switchServer(n) {
    state.activeNode = n;
    addLog("SWITCH : NOEUD " + n.toUpperCase(), "38bdf8");
    updateUI();
}

function buyUpgrade(node, part) {
    let cost = costs[node][part];
    if (state.money >= cost) {
        state.money -= cost;
        if (part === 'ram') state.servers[node].ramMax += (node === 'gaming' ? 16 : 8);
        if (part === 'disk') state.servers[node].diskMax += (node === 'gaming' ? 500 : 250);
        if (part === 'gpu') state.servers[node].gpuMax += 8;
        addLog(`UPGRADE : ${node} ${part.toUpperCase()} (+)`, "success");
        updateUI();
    } else {
        addLog("FONDS INSUFFISANTS", "red");
    }
}

function buySkill(type) {
    let cost = (type === 'secu') ? 1500 : 1200;
    if (state.money >= cost) {
        state.money -= cost;
        state.skills[type]++;
        addLog("SKILL : NIVEAU AMELIORE", "success");
        updateUI();
    }
}

function scanNetwork() {
    if (state.isBroken) return;
    const s = state.servers[state.activeNode];
    const ramReq = Math.floor(Math.random() * 5 + 2);
    const diskReq = Math.floor(Math.random() * 50 + 20);
    const gpuReq = (state.activeNode === 'gaming') ? Math.floor(Math.random() * 4 + 1) : 0;
    const timeReq = Math.floor(Math.random() * 10 + 10);

    if (s.ramUsed + ramReq <= s.ramMax && s.diskUsed + diskReq <= s.diskMax && (state.activeNode !== 'gaming' || s.gpuUsed + gpuReq <= s.gpuMax)) {
        const id = "ID-" + Math.floor(Math.random() * 9000 + 1000);
        const gain = Math.floor((ramReq * 20 + diskReq * 0.5 + gpuReq * 80) * s.mult);
        s.ramUsed += ramReq; s.diskUsed += diskReq;
        if (state.activeNode === 'gaming') s.gpuUsed += gpuReq;
        state.money += Math.floor(gain / 2);
        state.activeContracts.push({ id, ramReq, diskReq, gpuReq, timeLeft: timeReq, node: state.activeNode, totalGain: gain });
        addLog(`CONNEXION : ${id}`, "22c55e");
        renderClientCards();
    } else {
        addLog("ERREUR : RESSOURCES INSUFFISANTES", "red");
    }
    updateUI();
}

function triggerIncident(type) {
    if (state.isBroken) return;
    state.isBroken = true;
    state.angry += state.activeContracts.length;
    state.activeContracts = [];
    state.servers.bureautique.ramUsed = 0; state.servers.bureautique.diskUsed = 0;
    state.servers.gaming.ramUsed = 0; state.servers.gaming.diskUsed = 0; state.servers.gaming.gpuUsed = 0;
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('alert-text').innerText = (type === 'heat') ? "SURCHAUFFE" : "CYBER-ATTAQUE";
    setTimeout(() => { state.isBroken = false; state.currentTemp = 35; document.getElementById('overlay').style.display = 'none'; addLog("SYSTEME OPERATIONNEL", "white"); }, 5000);
    updateUI();
}

function renderClientCards() {
    const container = document.getElementById('client-container');
    container.innerHTML = "";
    state.activeContracts.forEach(c => {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.innerHTML = `USR: ${c.id} | ${c.node.toUpperCase()} | RESTANT: ${c.timeLeft}s`;
        container.appendChild(card);
    });
}

function updateUI() {
    const b = state.servers.bureautique; const g = state.servers.gaming;
    document.getElementById('stat-money').innerText = state.money + "€";
    document.getElementById('stat-node').innerText = state.activeNode.slice(0, 3).toUpperCase();
    document.getElementById('stat-temp').innerText = Math.floor(state.currentTemp) + "°C";
    document.getElementById('stat-live').innerText = state.activeContracts.length;

    // Mise à jour visuelle des bordures de sélection
    document.getElementById('card-bureautique').classList.remove('node-active');
    document.getElementById('card-gaming').classList.remove('node-active');
    document.getElementById('card-' + state.activeNode).classList.add('node-active');

    document.getElementById('bur-ram-txt').innerText = `${b.ramUsed}/${b.ramMax}`;
    document.getElementById('bur-ram-bar').style.width = (b.ramUsed / b.ramMax * 100) + "%";
    document.getElementById('bur-disk-txt').innerText = `${b.diskUsed}/${b.diskMax}`;
    document.getElementById('bur-disk-bar').style.width = (b.diskUsed / b.diskMax * 100) + "%";

    document.getElementById('gam-ram-txt').innerText = `${g.ramUsed}/${g.ramMax}`;
    document.getElementById('gam-ram-bar').style.width = (g.ramUsed / g.ramMax * 100) + "%";
    document.getElementById('gam-gpu-txt').innerText = `${g.gpuUsed}/${g.gpuMax}`;
    document.getElementById('gam-gpu-bar').style.width = (g.gpuUsed / g.gpuMax * 100) + "%";
    document.getElementById('gam-disk-txt').innerText = `${g.diskUsed}/${g.diskMax}`;
    document.getElementById('gam-disk-bar').style.width = (g.diskUsed / g.diskMax * 100) + "%";

    let ops = state.happy + state.angry;
    let sat = ops === 0 ? 100 : Math.round((state.happy / ops) * 100);
    document.getElementById('stat-sat').innerText = sat + "%";
    document.getElementById('h-happy').innerText = state.happy;
    document.getElementById('h-angry').innerText = state.angry;
    document.getElementById('balance-bar').style.width = (ops === 0 ? 50 : (state.happy / ops * 100)) + "%";
    document.getElementById('st-bur-count').innerText = state.servedBur;
    document.getElementById('st-gam-count').innerText = state.servedBur;
    document.getElementById('st-gam-count').innerText = state.servedGam;
    document.getElementById('st-total-money').innerText = state.moneyTotal + "€";
    document.getElementById('sk-secu').innerText = state.skills.secu;
    document.getElementById('sk-cool').innerText = state.skills.cool;
}

setInterval(() => {
    if (!state.isBroken) {
        state.minutes++;
        const h = Math.floor(state.minutes / 60).toString().padStart(2, '0');
        const m = (state.minutes % 60).toString().padStart(2, '0');
        document.getElementById('time-val').innerText = `${h}:${m}`;
        state.activeContracts.forEach((c, idx) => {
            c.timeLeft--;
            if (c.timeLeft <= 0) {
                state.money += Math.floor(c.totalGain / 2); state.moneyTotal += c.totalGain;
                state.happy++; if (c.node === 'bureautique') state.servedBur++; else state.servedGam++;
                state.servers[c.node].ramUsed -= c.ramReq; state.servers[c.node].diskUsed -= c.diskReq;
                if (c.node === 'gaming') state.servers[c.node].gpuUsed -= c.gpuReq;
                addLog(`CONTRAT TERMINE : ${c.id}`, "success");
                state.activeContracts.splice(idx, 1);
            }
        });
        renderClientCards();
        let heatFactor = 0.4 - (state.skills.cool * 0.08);
        if (state.activeContracts.length > 0) state.currentTemp += Math.max(0.1, heatFactor);
        else if (state.currentTemp > 30) state.currentTemp -= 0.5;
        if (state.currentTemp > 100) triggerIncident('heat');
        if (Math.random() < (0.004 - (state.skills.secu * 0.001))) triggerIncident('hack');
    }
    updateUI();
}, 1000);

window.onload = () => { addLog("STITCH OS V30.5 : BOOT SUCCESS", "white"); updateUI(); };
