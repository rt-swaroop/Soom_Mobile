import React, { useState } from 'react'

import { View, ScrollView, RefreshControl } from 'react-native'

import { styles } from './Home.styles';

import MarkAttendance from './components/MarkAttendance'
import ShiftCard from './components/ShiftCard'

const Home = () => {
    const [refreshing, setRefreshing] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const onRefresh = async () => {
        setRefreshing(true)
        try {
            setRefreshKey(prev => prev + 1)
        } finally {
            setRefreshing(false)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingTop: 0, paddingHorizontal: 5 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
                alwaysBounceVertical
            >
                <MarkAttendance refreshKey={refreshKey} />
                <ShiftCard refreshKey={refreshKey} />
            </ScrollView>
        </View>
    )
}

export default Home