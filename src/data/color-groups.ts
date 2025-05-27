export interface ColorItem {
  title: string;
  value: string;
  textColor: string;
  bgColor: string;
}

export interface ColorGroup {
  groupTitle: string;
  colors: ColorItem[];
}

export const groups: ColorGroup[] = [
  {
    groupTitle: 'Basic Colors',
    colors: [
      { title: 'White', value: '#FFFFFF', textColor: '#000000', bgColor: '#FFFFFF' },
      { title: 'Black', value: '#000000', textColor: '#FFFFFF', bgColor: '#000000' },
      { title: 'Gray', value: '#888888', textColor: '#000000', bgColor: '#888888' },
    ],
  },
  {
    groupTitle: 'Pokémon Colors',
    colors: [
      { title: 'Bug', value: '#A8B821', textColor: '#000000', bgColor: '#A8B821' },
      { title: 'Dark', value: '#6F5848', textColor: '#FFFFFF', bgColor: '#6F5848' },
    ],
  },
];
