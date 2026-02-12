import React from 'react';

import { View, ScrollView } from 'react-native';

import { useAppTheme } from '../../theme/useAppTheme';
import SkeletonItem from './SkeletonItem';
import { createStyles } from '../../screens/Admin/Leaves/AdminLeaves.styles';

const AdminLeavesSkeleton = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.listContent}>
            {[1, 2, 3].map((i) => (
                <View key={i} style={styles.requestCard}>
                    <View style={styles.cardHeader}>
                        <SkeletonItem width={44} height={44} borderRadius={22} />
                        <View style={styles.headerInfo}>
                            <SkeletonItem width={120} height={18} borderRadius={4} style={{ marginBottom: 6 }} />
                            <SkeletonItem width={160} height={12} borderRadius={4} />
                        </View>
                        <SkeletonItem width={60} height={20} borderRadius={10} />
                    </View>

                    <View style={styles.cardBody}>
                        {[1, 2, 3].map((j) => (
                            <View key={j} style={[styles.infoRow, { marginBottom: 12 }]}>
                                <SkeletonItem width={60} height={14} borderRadius={4} />
                                <SkeletonItem width={100} height={14} borderRadius={4} />
                            </View>
                        ))}
                    </View>

                    <View style={styles.actionButtons}>
                        <SkeletonItem width="48%" height={40} borderRadius={12} />
                        <SkeletonItem width="48%" height={40} borderRadius={12} />
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default AdminLeavesSkeleton;
