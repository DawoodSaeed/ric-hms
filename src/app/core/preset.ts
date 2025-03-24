import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyHospitalTheme = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        highlight: {
          background: '#4A90E2', // Primary blue
          focusBackground: '#3A80D2', // Slightly darker for focus
          color: '#FFFFFF',
          focusColor: '#FFFFFF',
        },
        primary: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#C0DFFF',
          300: '#A1CFFF',
          400: '#81BFFF',
          500: '#4A90E2', // Main primary blue
          600: '#3A80D2',
          700: '#2A70C2',
          800: '#1A60B2',
          900: '#0A50A2',
          950: '#092E60',
        },
        secondary: {
          50: '#F8FAFB',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B', // Main secondary color
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        accent: {
          teal: {
            50: '#F0FDFA',
            100: '#CCFBF1',
            200: '#99F6E4',
            300: '#5EEAD4',
            400: '#2DD4BF',
            500: '#5AC8C8', // Main accent teal - medical theme color
            600: '#0D9488',
            700: '#0F766E',
            800: '#115E59',
            900: '#134E4A',
            950: '#042F2E',
          },
          purple: {
            100: '#F3E8FF',
            200: '#E9D5FF',
            300: '#D8B4FE',
            400: '#C084FC',
            500: '#A855F7', // Secondary accent for visual interest
            600: '#9333EA',
          },
        },
        surface: {
          ground: '#F8FAFC', // Light gray background
          card: '#FFFFFF', // White card background
          overlay: 'rgba(255, 255, 255, 0.95)', // Slightly transparent white
          border: '#E2E8F0', // Light border color
          hover: '#F1F5F9', // Hover state background
        },
        feedback: {
          success: {
            50: '#ECFDF5',
            100: '#D1FAE5',
            200: '#A7F3D0',
            500: '#2DD4BF', // Success color
            600: '#059669',
            700: '#047857',
          },
          warning: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            500: '#F59E0B', // Warning color (amber)
            600: '#D97706',
            700: '#B45309',
          },
          danger: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            500: '#EF4444', // Error/danger color
            600: '#DC2626',
            700: '#B91C1C',
          },
          info: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            500: '#3B82F6', // Info color
            600: '#2563EB',
            700: '#1D4ED8',
          },
        },
        text: {
          primary: '#1A365D', // Navy text for headings
          secondary: '#475569', // Secondary text
          tertiary: '#64748B', // Tertiary text
          disabled: '#94A3B8', // Disabled text
          inverse: '#FFFFFF', // White text
        },
        sidebar: {
          background: '#FFFFFF',
          foreground: '#1A365D',
          hover: '#F1F5F9',
          active: '#E0EFFF',
          border: '#E2E8F0',
        },
      },
      dark: {
        highlight: {
          background: '#4A90E2',
          focusBackground: '#3A80D2',
          color: '#FFFFFF',
          focusColor: '#FFFFFF',
        },
        primary: {
          50: '#082A56',
          100: '#0A3978',
          200: '#0D499B',
          300: '#145DC7',
          400: '#2272E8',
          500: '#4A90E2', // Main primary color in dark mode
          600: '#6BA5E8',
          700: '#8CBAED',
          800: '#ADCFF3',
          900: '#CEE4F9',
          950: '#EFF6FF',
        },
        secondary: {
          50: '#0F172A',
          100: '#1E293B',
          200: '#334155',
          300: '#475569',
          400: '#64748B',
          500: '#94A3B8', // Main secondary in dark mode
          600: '#CBD5E1',
          700: '#E2E8F0',
          800: '#F1F5F9',
          900: '#F8FAFC',
          950: '#FFFFFF',
        },
        accent: {
          teal: {
            50: '#042F2E',
            100: '#134E4A',
            200: '#115E59',
            300: '#0F766E',
            400: '#0D9488',
            500: '#5AC8C8', // Main accent color
            600: '#5EEAD4',
            700: '#99F6E4',
            800: '#CCFBF1',
            900: '#F0FDFA',
          },
          purple: {
            100: '#9333EA',
            200: '#A855F7',
            300: '#C084FC',
            400: '#D8B4FE',
            500: '#E9D5FF',
            600: '#F3E8FF',
          },
        },
        surface: {
          ground: '#1E293B', // Dark background
          card: '#0F172A', // Darker card background
          overlay: 'rgba(15, 23, 42, 0.95)', // Slightly transparent dark
          border: '#334155', // Dark border
          hover: '#334155', // Hover state
        },
        feedback: {
          success: {
            50: '#047857',
            100: '#059669',
            200: '#10B981',
            500: '#2DD4BF', // Success color
            600: '#A7F3D0',
            700: '#D1FAE5',
          },
          warning: {
            50: '#B45309',
            100: '#D97706',
            200: '#F59E0B',
            500: '#F59E0B', // Warning color
            600: '#FDE68A',
            700: '#FEF3C7',
          },
          danger: {
            50: '#B91C1C',
            100: '#DC2626',
            200: '#EF4444',
            500: '#EF4444', // Error color
            600: '#FECACA',
            700: '#FEE2E2',
          },
          info: {
            50: '#1D4ED8',
            100: '#2563EB',
            200: '#3B82F6',
            500: '#3B82F6', // Info color
            600: '#BFDBFE',
            700: '#DBEAFE',
          },
        },
        text: {
          primary: '#F8FAFC', // Light text for headings
          secondary: '#E2E8F0', // Secondary text
          tertiary: '#CBD5E1', // Tertiary text
          disabled: '#64748B', // Disabled text
          inverse: '#0F172A', // Dark text for light backgrounds
        },
        sidebar: {
          background: '#0F172A',
          foreground: '#F8FAFC',
          hover: '#1E293B',
          active: '#2A70C2',
          border: '#334155',
        },
      },
    },
    borderRadius: {
      none: '0',
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.5rem',
      full: '9999px',
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    spacing: {
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
    },
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      neu: '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
    },
    transition: {
      DEFAULT: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fast: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  components: {
    // Component-specific overrides
    button: {
      root: {
        style: {
          borderRadius: 'var(--radius)',
          fontWeight: '500',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    card: {
      root: {
        style: {
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    inputtext: {
      root: {
        style: {
          borderRadius: 'var(--radius)',
        },
      },
    },
    dialog: {
      root: {
        style: {
          borderRadius: 'var(--radius)',
        },
      },
    },
    panel: {
      header: {
        style: {
          fontWeight: '600',
        },
      },
    },
    tabview: {
      navContent: {
        style: {
          borderRadius: 'var(--radius)',
        },
      },
    },
    datatable: {
      headerRow: {
        style: {
          background: 'var(--surface-ground)',
        },
      },
    },
  },
});
