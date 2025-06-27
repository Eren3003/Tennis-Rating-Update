const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const { playerA, playerB, winner } = req.query;
  const dbPath = path.resolve(__dirname, '../data.json');
  const raw = fs.readFileSync(dbPath);
  const data = JSON.parse(raw);

  const aPoints = data.players[playerA];
  const bPoints = data.players[playerB];
  const diff = Math.abs(aPoints - bPoints);

  let pointsA = 0;
  let pointsB = 0;

  if (diff >= 200) {
    return res.status(400).json({ error: 'Match zählt nicht (zu großer Klassenunterschied)' });
  }

  if (diff < 100) {
    pointsA = winner === playerA ? 20 : -20;
    pointsB = winner === playerB ? 20 : -20;
  } else if (aPoints > bPoints) {
    pointsA = winner === playerA ? 10 : -10;
    pointsB = winner === playerB ? 30 : -30;
  } else {
    pointsA = winner === playerA ? 30 : -30;
    pointsB = winner === playerB ? 10 : -10;
  }

  data.players[playerA] += pointsA;
  data.players[playerB] += pointsB;

  data.matches.push({ playerA, playerB, winner, date: new Date().toISOString() });

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  res.json({ playerA: data.players[playerA], playerB: data.players[playerB] });
};
