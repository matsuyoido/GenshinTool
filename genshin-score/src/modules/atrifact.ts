import { BigNumber } from "bignumber.js";

interface ArtifactData {
  id: string;
  name: string;
  icon_url: string;
  circlet_of_logos_icon_url: string;
  flower_of_life_icon_url: string;
  goblet_of_eonothem_icon_url: string;
  plume_of_death_icon_url: string;
  sands_of_eon_icon_url: string;
  two_set_effect: string;
  four_set_effect: string;
}
let artifacts: ArtifactData[];
try {
  // NOTE: npm run dev をした時 を想定
  // const artifactDataJson = await fetch("/artifacts.json")
  const artifactDataJson = await fetch("https://raw.githubusercontent.com/matsuyoido/GenshinTool/master/docs/artifacts.json")
    .catch((e) => {
      console.log(`json load github: ${e}`);
      return fetch(
        "https://raw.githubusercontent.com/matsuyoido/GenshinTool/master/docs/artifacts.json",
      );
    })
    .then((res) => res.json());
  artifacts = artifactDataJson;
} catch (error) {
  console.log(`json load github: ${error}`);
  // https://github.com/vitejs/vite/discussions/8242 のため、fetchに変更
  const artifactDataJson = await fetch(
    "https://raw.githubusercontent.com/matsuyoido/GenshinTool/master/docs/artifacts.json",
  ).then((res) => res.json());
  artifacts = artifactDataJson as ArtifactData[];
}

type ArtifactGrade = "B" | "A" | "S" | "SS";
type ArtifactCategory = "生の花" | "時の砂" | "死の羽" | "理の冠" | "空の杯";
type ArtifactStatusCategory =
  | "HP"
  | "HP(%)"
  | "攻撃力"
  | "攻撃力(%)"
  | "防御力"
  | "防御力(%)"
  | "会心率"
  | "会心ダメージ"
  | "元素チャージ効率"
  | "元素熟知"
  | "与える治癒効果"
  | "物理ダメージ"
  | "炎元素ダメージ"
  | "水元素ダメージ"
  | "氷元素ダメージ"
  | "雷元素ダメージ"
  | "草元素ダメージ"
  | "風元素ダメージ"
  | "岩元素ダメージ";
namespace ArtifactCategory {
  export const All: ArtifactCategory[] = [
    "生の花",
    "死の羽",
    "時の砂",
    "空の杯",
    "理の冠",
  ];
  export const Flower: ArtifactCategory = "生の花";
  export const Plume: ArtifactCategory = "死の羽";
  export const Sand: ArtifactCategory = "時の砂";
  export const Goblet: ArtifactCategory = "空の杯";
  export const Circlet: ArtifactCategory = "理の冠";

  // -- 花: HP（4780）
  // -- 羽: 攻撃力（311）
  // -- 時計: 攻撃力(%)（46.6%） or 防御力(%)（58.3%） or HP(%)（46.6%） or 元素熟知（187） or 元素チャージ効率（51.8%）
  // -- 杯:  攻撃力(%)（46.6%） or 防御力(%)（58.3%） or HP(%)（46.6%） or 元素熟知（187） or 物理（58.3%）や元素バフ（46.6%）
  // -- 冠:  攻撃力(%)（46.6%） or 防御力(%)（58.3%） or HP(%)（46.6%） or 元素熟知（187） or 会心率（31.1% ）or 会心ダメージ（62.2%） or 与える治癒効果（35.9%）
  export function getMainOption(
    category: ArtifactCategory,
  ): ArtifactStatusCategory[] {
    switch (category) {
      case "生の花":
        return ["HP"];
      case "死の羽":
        return ["攻撃力"];
      case "時の砂":
        return [
          "攻撃力(%)",
          "防御力(%)",
          "HP(%)",
          "元素熟知",
          "元素チャージ効率",
        ];
      case "空の杯":
        return [
          "攻撃力(%)",
          "防御力(%)",
          "HP(%)",
          "元素熟知",
          "物理ダメージ",
          "炎元素ダメージ",
          "水元素ダメージ",
          "氷元素ダメージ",
          "雷元素ダメージ",
          "風元素ダメージ",
          "草元素ダメージ",
          "岩元素ダメージ",
        ];
      case "理の冠":
        return [
          "攻撃力(%)",
          "防御力(%)",
          "HP(%)",
          "元素熟知",
          "会心率",
          "会心ダメージ",
        ];
    }
    return [];
  }
  // 攻撃力（117） | 攻撃力(%)（35.0%） | 防御力（139） | 防御力(%)（43.7%） | HP（1793） | HP(%)（35.0%）
  // 元素熟知（140） | 元素チャージ効率（38.9%) | 会心率（23.3%） | 会心ダメージ（46.6%）
  export function getSubOption(): ArtifactStatusCategory[] {
    return [
      "HP",
      "HP(%)",
      "攻撃力",
      "攻撃力(%)",
      "防御力",
      "防御力(%)",
      "元素熟知",
      "元素チャージ効率",
      "会心率",
      "会心ダメージ",
    ];
  }
}
namespace ArtifactStatusCategory {
  export function MainOptionValue(category: ArtifactStatusCategory): number {
    switch (category) {
      case "HP":
        return 4780;
      case "攻撃力":
        return 311;
      case "攻撃力(%)":
        return 46.6;
      case "防御力(%)":
        return 58.3;
      case "HP(%)":
        return 46.6;
      case "元素熟知":
        return 187;
      case "元素チャージ効率":
        return 51.8;
      case "物理ダメージ":
        return 58.3;
      case "岩元素ダメージ":
      case "水元素ダメージ":
      case "氷元素ダメージ":
      case "炎元素ダメージ":
      case "草元素ダメージ":
      case "雷元素ダメージ":
      case "風元素ダメージ":
        return 46.6;
      case "会心率":
        return 31.1;
      case "会心ダメージ":
        return 62.2;
      case "与える治癒効果":
        return 35.9;
    }
    return 0;
  }
  export function SubOptionMaxValue(category: ArtifactStatusCategory): number {
    switch (category) {
      case "HP":
        return 1793;
      case "HP(%)":
        return 35.0;
      case "攻撃力":
        return 117;
      case "攻撃力(%)":
        return 35.0;
      case "防御力":
        return 139;
      case "防御力(%)":
        return 43.7;
      case "元素熟知":
        return 140;
      case "元素チャージ効率":
        return 38.9;
      case "会心率":
        return 23.3;
      case "会心ダメージ":
        return 46.6;
    }
    return 0;
  }
}
namespace ArtifactGrade {
  // https://github.com/FuroBath/ArtifacterImageGen/blob/master/Generater.py#L500-L531
  export function judgeTotalGrade(score: number): ArtifactGrade {
    if (220 <= score) {
      return "SS";
    }
    if (200 <= score) {
      return "S";
    }
    if (180 <= score) {
      return "A";
    }
    return "B";
  }
  export function judgeArtifactGrade(
    artifactCategory: ArtifactCategory,
    score: number,
  ): ArtifactGrade {
    switch (artifactCategory) {
      case "生の花":
      case "死の羽":
        if (50 <= score) {
          return "SS";
        }
        if (45 <= score) {
          return "S"; // 45 <= score < 50
        }
        if (40 <= score) {
          return "A"; // 40 <= score < 45
        }
        return "B"; // score < 40

      case "時の砂":
        if (45 <= score) {
          return "SS";
        }
        if (40 <= score) {
          return "S";
        }
        if (35 <= score) {
          return "A";
        }
        return "B";
      case "空の杯":
        if (45 <= score) {
          return "SS";
        }
        if (40 <= score) {
          return "S";
        }
        if (37 <= score) {
          return "A";
        }
        return "B";
      case "理の冠":
        if (40 <= score) {
          return "SS";
        }
        if (35 <= score) {
          return "S";
        }
        if (30 <= score) {
          return "A";
        }
        return "B";
    }
  }
}

type ArtifactScoreType =
  | "汎用型"
  | "元素チャージ型"
  | "防御型"
  | "HP型"
  | "熟知型";
const calculateScore = (
  calcType: ArtifactScoreType,
  _hp: number,
  hpPercent: number,
  _attack: number,
  attackPercent: number,
  _defense: number,
  defensePercent: number,
  energyRecharge: number,
  elementMastery: number,
  critRate: number,
  critDMGBonus: number,
): number => {
  switch (calcType) {
    case "汎用型":
      // 攻撃力 + (会心率 * 2) + 会心ダメージ
      return new BigNumber(attackPercent)
        .plus(new BigNumber(critRate).multipliedBy(2))
        .plus(new BigNumber(critDMGBonus))
        .toNumber();
    case "元素チャージ型":
      // (元素チャージ効率 * 0.4) + (会心率 * 2) + 会心ダメージ
      return new BigNumber(energyRecharge)
        .multipliedBy(0.4)
        .plus(new BigNumber(critRate).multipliedBy(2))
        .plus(new BigNumber(critDMGBonus))
        .toNumber();
    case "HP型":
      // HP + (会心率 * 2) + 会心ダメージ
      return new BigNumber(hpPercent)
        .plus(new BigNumber(critRate).multipliedBy(2))
        .plus(new BigNumber(critDMGBonus))
        .toNumber();
    case "熟知型":
      // (元素熟知 * 0.5) + 会心率 + (会心ダメージ * 0.5)
      return new BigNumber(elementMastery)
        .multipliedBy(0.5)
        .plus(new BigNumber(critRate))
        .plus(new BigNumber(critDMGBonus).multipliedBy(0.5))
        .toNumber();
    case "防御型":
      // 防御力 + (会心率 * 2) + 会心ダメージ
      return new BigNumber(defensePercent)
        .plus(new BigNumber(critRate).multipliedBy(2))
        .plus(new BigNumber(critDMGBonus))
        .toNumber();
  }
  return 0;
};

export {
  artifacts,
  ArtifactCategory,
  ArtifactStatusCategory,
  ArtifactGrade,
  calculateScore,
};
export type { ArtifactData, ArtifactScoreType };
