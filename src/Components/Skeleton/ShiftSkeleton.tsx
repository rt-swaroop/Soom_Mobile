import React, { useMemo } from 'react';
import { View } from 'react-native';

import SkeletonItem from './SkeletonItem';
import { createStyles } from '../../screens/Dashboard/Home/Home.styles';
import { useAppTheme } from '../../theme/useAppTheme';

const ShiftSkeleton = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.shiftCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <SkeletonItem width={22} height={22} borderRadius={11} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <SkeletonItem width="60%" height={20} borderRadius={4} />
                </View>
                <SkeletonItem width={50} height={24} borderRadius={12} />
            </View>

            <View style={{ width: '100%', marginVertical: 10 }}>
                <SkeletonItem width="100%" height={1} borderRadius={0} />
            </View>

            <View style={styles.shiftRow}>
                <View style={[styles.shiftItem, { width: '45%' }]}>
                    <SkeletonItem width={20} height={20} borderRadius={10} />
                    <View style={{ marginLeft: 8, flex: 1 }}>
                        <SkeletonItem width={30} height={12} borderRadius={4} style={{ marginBottom: 4 }} />
                        <SkeletonItem width={60} height={16} borderRadius={4} />
                    </View>
                </View>

                <View style={[styles.shiftItem, { width: '45%' }]}>
                    <SkeletonItem width={20} height={20} borderRadius={10} />
                    <View style={{ marginLeft: 8, flex: 1 }}>
                        <SkeletonItem width={30} height={12} borderRadius={4} style={{ marginBottom: 4 }} />
                        <SkeletonItem width={60} height={16} borderRadius={4} />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ShiftSkeleton;
