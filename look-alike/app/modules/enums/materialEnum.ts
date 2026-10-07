export enum EMaterial {
  COTTON = 'Katun',
  POLYESTER = 'Poliester',
  VISCOSE = 'Viskosa',
  KNIT = 'Rajut',
  LINEN = 'Linen',
  WOVEN = 'Tenunan',
  NYLON = 'Nilon',
  DENIM = 'Denim',
  WOOL = 'Wol',
  ACRYLIC = 'Akrilik',
  LEATHER = 'Kulit',
  SILK = 'Sutra',
  OTHERS = 'Lainnya',
}

export const MaterialMapper: Record<EMaterial, string> = {
  [EMaterial.COTTON]: 'Cotton',
  [EMaterial.POLYESTER]: 'Polyester',
  [EMaterial.VISCOSE]: 'Viscose',
  [EMaterial.KNIT]: 'Knit',
  [EMaterial.LINEN]: 'Linen',
  [EMaterial.WOVEN]: 'Woven',
  [EMaterial.NYLON]: 'Nylon',
  [EMaterial.DENIM]: 'Denim',
  [EMaterial.WOOL]: 'Wool',
  [EMaterial.ACRYLIC]: 'Acrylic',
  [EMaterial.LEATHER]: 'Leather',
  [EMaterial.SILK]: 'Silk',
  [EMaterial.OTHERS]: 'Others',
};

export const getMaterialLabel = (material: EMaterial | string): string => {
  if (material in MaterialMapper) {
    return MaterialMapper[material as EMaterial];
  }

  return material;
};

export const materialOptions = Object.values(EMaterial).map((material) => ({
  value: material,
  label: getMaterialLabel(material),
}));