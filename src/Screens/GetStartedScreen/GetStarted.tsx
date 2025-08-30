import React from "react";

import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { Text, Image, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { styles } from './GetStarted.styles'
import { IMAGES } from "../../assets/images";
import { COLORS } from "../../theme/colors";
import { ROUTES } from "../../navigation/routes";

import { RootStackParamList } from "../../navigation/AppNavigator";

const GetStartedScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.container}
        >
            <Image
                source={IMAGES.getStarted}
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.title}>SOOM</Text>

            <Text style={styles.subtitle}>
                Specialized Office Operational Management
            </Text>

            <Text style={styles.description}>
                The future of office management: simple, reliable, and designed for you.
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate(ROUTES.LOGIN)}
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default GetStartedScreen;