export const GAME_BALANCE = {
  battle: {
    playerMaxHp: 3,
    monsterMaxHp: 10,
    correctDamage: 1,
    wrongDamage: 1,
    rewardCoins: 180,
  },

  notebookBattle: {
    playerMaxHp: 3,
    monsterMaxHp: 10,
    correctDamage: 1,
    wrongDamage: 1,
    rewardCoins: 200,
  },

  gacha: {
    costPerDraw: 600,
    rates: {
      3: 0.4,
      4: 0.5,
      5: 0.08,
      6: 0.02,
    } as const,
    pity: {
      fiveStarOrAbove: 20,
      sixStar: 60,
    },
  },
} as const;