import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyHospitalTheme = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        highlight: {
          background: '#2064AB', // Highlight background matches primary color
          focusBackground: '#2064AB',
          color: '#FFFFFF',
          focusColor: '#FFFFFF',
        },

        primary: {
          50: '#D6E6FF',
          100: '#A4C4F4',
          200: '#6E9EE0',
          300: '#4485D0',
          400: '#2A75B8', // Default color updated to #2064AB
          500: '#2064AB', // Main primary color
          600: '#1B5B9C',
          700: '#164C8D',
          800: '#11437E',
          900: '#0D396F',
          950: '#092E60',
        },
      },
      dark: {
        highlight: {
          background: '#2064AB', // Highlight background matches primary color for dark mode
          focusBackground: '#FFFFFF',
          color: '#FFFFFF',
          focusColor: '#FFFFFF',
        },

        primary: {
          50: '#D6E6FF',
          100: '#A4C4F4',
          200: '#6E9EE0',
          300: '#4485D0',
          400: '#2A75B8',
          500: '#2064AB', // Default primary color in dark mode
          600: '#1B5B9C',
          700: '#164C8D',
          800: '#11437E',
          900: '#0D396F',
          950: '#092E60',
        },
      },
    },
  },
});
