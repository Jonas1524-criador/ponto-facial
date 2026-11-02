const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { employees: [], punches: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { employees: [], punches: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Listar funcionários
app.get('/api/employees', (req, res) => {
  const data = loadData();
  res.json(data.employees);
});

// Cadastrar funcionário
app.post('/api/employees', (req, res) => {
  const { name, mat, sal, descriptor } = req.body;
  if (!name || !descriptor) return res.status(400).json({ error: 'Nome e descriptor obrigatórios' });
  const data = loadData();
  const emp = {
    id: Date.now().toString(),
    name,
    mat: mat || '',
    sal: sal || 0,
    descriptor,
    createdAt: new Date().toISOString()
  };
  data.employees.push(emp);
  saveData(data);
  res.json(emp);
});

// Registrar ponto
app.post('/api/punches', (req, res) => {
  const { employee, type, timestamp, lat, lng, acc } = req.body;
  if (!employee || !type) return res.status(400).json({ error: 'Dados incompletos' });
  const data = loadData();
  const punch = {
    id: 'p' + Date.now() + Math.random().toString(36).slice(2, 7),
    employee,
    type,
    timestamp: timestamp || new Date().toISOString(),
    lat: lat || null,
    lng: lng || null,
    acc: acc || null
  };
  data.punches.push(punch);
  saveData(data);
  res.json(punch);
});

// Listar pontos (com filtros)
app.get('/api/punches', (req, res) => {
  const data = loadData();
  let punches = data.punches;
  if (req.query.employee) {
    punches = punches.filter(p => p.employee === req.query.employee);
  }
  if (req.query.month) {
    punches = punches.filter(p => p.timestamp.startsWith(req.query.month));
  }
  if (req.query.from && req.query.to) {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    punches = punches.filter(p => {
      const d = new Date(p.timestamp);
      return d >= from && d <= to;
    });
  }
  punches.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(punches);
});

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
