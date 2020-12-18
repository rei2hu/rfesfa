const railjackNodes = {
  '505': 'Ruse War Field',
  '510': 'Gian Point',
  '550': 'Nsu Grid',
  '551': "Ganalen's Grave",
  '552': 'Rya',
  '553': 'Flexa',
  '554': 'H-2 Cloud',
  '555': 'R-9 Cloud'
};

module.exports = sentientData => {
  const data = JSON.parse(sentientData);
  return { [data.sfn]: railjackNodes[data.sfn] || data.sfn };
};
