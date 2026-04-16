import { gachaPool, GachaCharacter } from "../data/gachaPool";
import { GAME_BALANCE } from "../config/gameBalance";

type DrawContext = {
  pullsSinceFiveStarOrAbove: number;
  pullsSinceSixStar: number;
};

function randomPick<T>(items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function getCharactersByStars(stars: 3 | 4 | 5 | 6): GachaCharacter[] {
  return gachaPool.filter((character) => character.stars === stars);
}

function fallbackPickByAvailableStars(
  preferredStars: Array<3 | 4 | 5 | 6>
): GachaCharacter {
  for (const stars of preferredStars) {
    const candidates = getCharactersByStars(stars);
    if (candidates.length > 0) {
      return randomPick(candidates);
    }
  }

  if (gachaPool.length === 0) {
    throw new Error("卡池為空，無法抽卡");
  }

  return randomPick(gachaPool);
}

function rollNormalStars(): 3 | 4 | 5 | 6 {
  const random = Math.random();
  const rates = GAME_BALANCE.gacha.rates;

  if (random < rates[3]) return 3;
  if (random < rates[3] + rates[4]) return 4;
  if (random < rates[3] + rates[4] + rates[5]) return 5;
  return 6;
}

function rollFivePlusStars(): 5 | 6 {
  const total = GAME_BALANCE.gacha.rates[5] + GAME_BALANCE.gacha.rates[6];
  const random = Math.random();

  return random < GAME_BALANCE.gacha.rates[5] / total ? 5 : 6;
}

export function drawCharacter(context: DrawContext): GachaCharacter {
  const fiveStarPity = GAME_BALANCE.gacha.pity.fiveStarOrAbove;
  const sixStarPity = GAME_BALANCE.gacha.pity.sixStar;

  if (context.pullsSinceSixStar + 1 >= sixStarPity) {
    return fallbackPickByAvailableStars([6, 5, 4, 3]);
  }

  if (context.pullsSinceFiveStarOrAbove + 1 >= fiveStarPity) {
    const stars = rollFivePlusStars();
    return fallbackPickByAvailableStars(
      stars === 6 ? [6, 5, 4, 3] : [5, 6, 4, 3]
    );
  }

  const stars = rollNormalStars();
  return fallbackPickByAvailableStars([stars, 4, 3]);
}