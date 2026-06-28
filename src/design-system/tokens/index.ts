import { colors, type ColorToken } from './colors';
import { spacing, type SpacingToken } from './spacing';
import { typography, textStyles, type TypographyToken, type TextStyleKey } from './typography';
import { radius, type RadiusToken } from './radius';
import { blur, type BlurToken } from './blur';
import { glass, type GlassToken } from './glass';
import { elevation, type ElevationToken } from './elevation';
import { shadow, type ShadowToken } from './shadow';
import { animation, transitions, type AnimationToken } from './animation';
import { focus, type FocusToken } from './focus';
import { zIndex, type ZIndexToken } from './zIndex';

export {
  colors,
  spacing,
  typography,
  textStyles,
  radius,
  blur,
  glass,
  elevation,
  shadow,
  animation,
  transitions,
  focus,
  zIndex,
};

export type {
  ColorToken,
  SpacingToken,
  TypographyToken,
  TextStyleKey,
  RadiusToken,
  BlurToken,
  GlassToken,
  ElevationToken,
  ShadowToken,
  AnimationToken,
  FocusToken,
  ZIndexToken,
};

/** Aggregated token object for programmatic access. */
export const tokens = {
  colors,
  spacing,
  typography,
  textStyles,
  radius,
  blur,
  glass,
  elevation,
  shadow,
  animation,
  transitions,
  focus,
  zIndex,
} as const;
