import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { selectThemeMode } from '../redux/selector';
import { lightTheme, darkTheme } from './colors';

export type Theme = typeof lightTheme;

export const useAppTheme = () => {
    const themeMode = useSelector(selectThemeMode);
    const systemColorScheme = useColorScheme();

    const resolvedMode = themeMode === 'system'
        ? (systemColorScheme || 'light')
        : themeMode;

    const theme = resolvedMode === 'dark' ? darkTheme : lightTheme;
    const isDark = resolvedMode === 'dark';

    return {
        theme,
        isDark,
        themeMode,
        resolvedMode
    };
};
