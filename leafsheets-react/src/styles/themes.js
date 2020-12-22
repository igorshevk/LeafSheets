// Improts

import { darkColors, lightColors } from './colors'

// Breaks

const breakpoints = ['768px', '1400px']

// Fonts

const fontSizes = [12, 16, 18, 20]

// Themes

const baseTheme = {
  breakpoints: breakpoints,
  fontSizes: fontSizes,
  mediaQueries: {
    small: `@media screen and (min-width: ${breakpoints[0]})`,
    medium: `@media screen and (min-width: ${breakpoints[1]})`,
    large: `@media screen and (min-width: ${breakpoints[2]})`,
    xlarge: `@media screen and (min-width: ${breakpoints[3]})`,
  }
}

const lightTheme = {
  ...baseTheme,
  colors: lightColors,
}

const darkTheme = {
  ...baseTheme,
  colors: darkColors,
}

export { darkTheme, lightTheme, breakpoints }