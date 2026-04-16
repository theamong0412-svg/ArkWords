export type GachaCharacter = {
  id: number;
  name: string;
  stars: 3 | 4 | 5 | 6;
};

export const gachaPool: GachaCharacter[] = [
  { id: 1, name: "芬", stars: 3 },
  { id: 2, name: "克洛絲", stars: 3 },
  { id: 3, name: "米格魯", stars: 3 },
  { id: 4, name: "孑", stars: 4 },
  { id: 5, name: "桃金娘", stars: 4 },
  { id: 6, name: "艾絲黛爾", stars: 4 },
  { id: 7, name: "赫默", stars: 5 },
  { id: 8, name: "幽靈鯊", stars: 5 },
  { id: 9, name: "邏各斯", stars: 6 },
  { id: 10, name: "維什戴爾", stars: 6 },
];