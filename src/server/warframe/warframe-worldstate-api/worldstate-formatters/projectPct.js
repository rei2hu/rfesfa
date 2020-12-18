const projectIndexes = ['Fomorian Sabotage', 'Razorback Invasion', 'Unknown'];

module.exports = projects =>
  Object.fromEntries(
    projects.map((projectPct, index) => [
      projectIndexes[index],
      {
        percentage: projectPct
      }
    ])
  );
