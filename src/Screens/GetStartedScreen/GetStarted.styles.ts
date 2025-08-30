import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    image: {
        width: "100%",
        height: 250,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.white,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.white,
        textAlign: "center",
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: COLORS.grey,
        textAlign: "center",
        marginBottom: 40,
        lineHeight: 20,
    },
    button: {
        backgroundColor: COLORS.red1,
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
        elevation: 3,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});