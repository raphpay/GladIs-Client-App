import { TextStyle } from "react-native";

export interface IFonts {
  bold: TextStyle["fontWeight"];
  semiBold: TextStyle["fontWeight"];
  regular: TextStyle["fontWeight"];
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  p: number;
  poppinsLight: string,
  poppinsSemiBold: string,
  poppinsBold: string,
  bikoBold: string,
  // Add more inputs as needed
}

export const Fonts: IFonts = {
  bold: '700',
  semiBold: '600',
  regular: '400',
  h1: 72,
  h2: 48,
  h3: 32,
  h4: 24,
  p: 14,
  poppinsLight: 'Poppins Light',
  poppinsSemiBold: 'Poppins SemiBold',
  poppinsBold: 'Poppins Bold',
  bikoBold: 'Biko Bold'
};
