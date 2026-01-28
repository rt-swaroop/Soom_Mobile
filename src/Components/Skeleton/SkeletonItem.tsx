import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, DimensionValue } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';

interface SkeletonItemProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: ViewStyle;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({ width = '100%', height = 20, borderRadius = 4, style }) => {
    const { theme } = useAppTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();

        return () => animation.stop();
    }, [opacity]);

    const backgroundColor = theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    return (
        <Animated.View
            style={[
                { width, height, borderRadius, backgroundColor, opacity },
                style
            ]}
        />
    );
};

export default SkeletonItem;
