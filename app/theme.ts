/* eslint-disable sort-keys-fix/sort-keys-fix */
export type Theme = typeof theme
export const theme = {
  color: {
    danger: {
      lightRed: '#fff1f0',
      raspberry: '#ff5a4f',
      rubicund: '#f0857d',
      scarlet: '#e01507',
    },
    neutral: {
      black: '#212121',
      darkGrey: '#4d4d4d',
      grey: '#717171',
      greyBlue: '#abbed1',
      lightGrey: '#e5e5e5',
      silver: '#f5f7fa',
      white: '#ffffff',
    },
    primary: {
      azure: '#4196f0',
      darkBlue: '#000F9F',
      lightBlue: '#eef5fc',
      navy: '#0663c7',
      sky: '#dbedff',
    },
    success: {
      forest: '#1b6e53',
      herbal: '#32c997',
      lightGreen: '#f1fbf8',
      mint: '#84dfc1',
    },
    warning: {
      lemon: '#ffa826',
      lighYellow: '#fff8ec',
      sand: '#ffd596',
      straw: '#ffc670',
    },
  },
  shadow: {
    tiny: '0 2px 4px rgba(171, 190, 209, 0.6)',
    small: '0 4px 8px rgba(171, 190, 209, 0.4)',
    medium: '0 6px 12px rgba(171, 190, 209, 0.3)',
    large: '0 8px 16px rgba(171, 190, 209, 0.4)',
  },
  typography: {
    desktop: {
      body: {
        normal: {
          size: '112.5%',
          weight: 500,
        },
        medium: {
          size: '100%',
          weight: 500,
        },
        small: {
          size: '87.5%',
          weight: 500,
        },
      },
      button: {
        normal: {
          size: '112.5%',
          weight: 500,
        },
        medium: {
          size: '100%',
          weight: 500,
        },
        small: {
          size: '87.5%',
          weight: 500,
        },
      },
      h1: {
        size: '400%',
        weight: 600,
      },
      h2: {
        size: '225%',
        weight: 600,
      },
      h3: {
        size: '175%',
        weight: 600,
      },
      h4: {
        size: '4rem',
        weight: 600,
      },
    },
    mobile: {
      body: {
        normal: {
          size: '100%',
          weight: 500,
        },
        medium: {
          size: '87.5%',
          weight: 500,
        },
        small: {
          size: '75%',
          weight: 500,
        },
      },
      button: {
        normal: {
          size: '112.5%',
          weight: 500,
        },
        medium: {
          size: '100%',
          weight: 500,
        },
        small: {
          size: '87.5%',
          weight: 500,
        },
      },
      h1: {
        size: '175%',
        weight: 600,
      },
      h2: {
        size: '125%',
        weight: 600,
      },
      h3: {
        size: '112.5%',
        weight: 600,
      },
      h4: {
        size: '100%',
        weight: 600,
      },
    },
  },
}

export const colors = {
  ...theme.color.primary,
  ...theme.color.neutral,
  ...theme.color.success,
  ...theme.color.warning,
  ...theme.color.danger,
}

export type Color = keyof typeof colors

export type ColorRange = keyof typeof theme.color
