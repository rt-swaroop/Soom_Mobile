import React from 'react'

import { View } from 'react-native'

import { styles } from './Home.styles';

import MarkAttendance from './components/MarkAttendance'
import ShiftCard from './components/ShiftCard'

const Home = () => {
    return (
        <View style={styles.container}>
            <MarkAttendance />
            <ShiftCard />
        </View>
    )
}

export default Home