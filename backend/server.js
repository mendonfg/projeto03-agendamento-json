
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = 'agendamentos.json';

function lerAgendamentos() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

function salvarAgendamentos(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/agendamentos', (req, res) => {
  const { cpf } = req.query;
  const agendamentos = lerAgendamentos();
  if (cpf) {
    return res.json(agendamentos.filter(a => a.cpf === cpf));
  }
  res.json(agendamentos);
});

app.post('/agendamentos', (req, res) => {
  const { nome, cpf, especialidade, profissional, data } = req.body;
  const agendamentos = lerAgendamentos();
  agendamentos.push({ nome, cpf, especialidade, profissional, data });
  salvarAgendamentos(agendamentos);
  res.status(201).json({ mensagem: 'Agendamento realizado com sucesso!' });
});

app.delete('/agendamentos/:cpf', (req, res) => {
  const cpf = req.params.cpf;
  let agendamentos = lerAgendamentos();
  const originalLength = agendamentos.length;
  agendamentos = agendamentos.filter(a => a.cpf !== cpf);
  salvarAgendamentos(agendamentos);
  if (agendamentos.length === originalLength) {
    return res.status(404).json({ mensagem: 'Nenhum agendamento encontrado para esse CPF.' });
  }
  res.json({ mensagem: 'Agendamento cancelado com sucesso.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
