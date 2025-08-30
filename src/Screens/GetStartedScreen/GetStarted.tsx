import React from "react";

import { Text, Image, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { styles } from './GetStarted.styles'
import { IMAGES } from "../../assets/images";
import { COLORS } from "../../theme/colors";

const GetStartedScreen = () => {
    return (
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.container}>
            <Image
                source={IMAGES.getStarted}
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.title}>Office Timer</Text>

            <Text style={styles.subtitle}>
                Track your work hours and boost productivity with ease.
            </Text>

            <Text style={styles.description}>
                Log in to manage your tasks, track time, and optimize your workday for
                efficiency.
            </Text>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default GetStartedScreen;