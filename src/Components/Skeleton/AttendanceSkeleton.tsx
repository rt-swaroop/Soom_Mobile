import React, { useMemo } from 'react';
import { View } from 'react-native';

import { useAppTheme } from '../../theme/useAppTheme';

import SkeletonItem from './SkeletonItem';
import { createStyles } from '../../screens/Dashboard/Home/Home.styles';

const AttendanceSkeleton = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.attendanceCard}>
            <SkeletonItem width={120} height={32} borderRadius={8} style={{ marginVertical: 4 }} />

            <SkeletonItem width={180} height={20} borderRadius={6} style={{ marginVertical: 10 }} />

            <View style={{ marginVertical: 5 }}>
                <SkeletonItem width={120} height={120} borderRadius={60} />
            </View>

            <View style={{ marginTop: 10, width: '80%', alignItems: 'center' }}>
                <SkeletonItem width="100%" height={16} borderRadius={4} />
            </View>

            <View style={{ width: '100%', marginVertical: 15, paddingHorizontal: 10 }}>
                <SkeletonItem width="100%" height={1} borderRadius={0} />
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.actionItem}>
                    <SkeletonItem width={30} height={30} borderRadius={15} style={{ marginBottom: 5 }} />
                    <SkeletonItem width={50} height={16} borderRadius={4} />
                    <SkeletonItem width={60} height={14} borderRadius={4} style={{ marginTop: 5 }} />
                </View>
                <View style={styles.actionItem}>
                    <SkeletonItem width={30} height={30} borderRadius={15} style={{ marginBottom: 5 }} />
                    <SkeletonItem width={50} height={16} borderRadius={4} />
                    <SkeletonItem width={60} height={14} borderRadius={4} style={{ marginTop: 5 }} />
                </View>
                <View style={styles.actionItem}>
                    <SkeletonItem width={30} height={30} borderRadius={15} style={{ marginBottom: 5 }} />
                    <SkeletonItem width={50} height={16} borderRadius={4} />
                    <SkeletonItem width={60} height={14} borderRadius={4} style={{ marginTop: 5 }} />
                </View>
            </View>
        </View>
    );
};

export default AttendanceSkeleton;
