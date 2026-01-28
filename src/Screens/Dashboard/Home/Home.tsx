import React, { useState, useEffect, useMemo } from 'react'

import { View, ScrollView, RefreshControl } from 'react-native'

import { useDispatch, useSelector } from 'react-redux';

import { createStyles } from './Home.styles';
import { useAppTheme } from '../../../theme/useAppTheme';
import { selectUser } from '../../../redux/selector';
import { getNotifications } from '../../../services/notificationServices';
import { setNotifications } from '../../../redux/reducers/notificationReducer';

import MarkAttendance from './components/MarkAttendance'
import ShiftCard from './components/ShiftCard'

const Home = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const [refreshing, setRefreshing] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        if (!user?._id) return;
        try {
            const data = await getNotifications(user._id);
            dispatch(setNotifications(data));
        } catch (err) {
            console.error("Home: Failed to fetch notifications:", err);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true)
        try {
            setRefreshKey(prev => prev + 1)
            await fetchNotifications();
        } finally {
            setRefreshing(false)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingTop: 0, paddingHorizontal: 5 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
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