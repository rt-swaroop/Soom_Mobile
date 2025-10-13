import React from 'react'

import { View } from 'react-native'

import { styles } from './Home.styles'
import MarkAttendance from './components/MarkAttendance'

const Home = () => {
    return (
        <View style={styles.container}>
            <MarkAttendance />
        </View>
    )
}

export default Home