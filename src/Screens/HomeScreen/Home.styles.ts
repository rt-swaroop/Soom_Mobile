import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.white,
    },
    date: {
        fontSize: 16,
        color: COLORS.lightGray,
        marginBottom: 20,
    },
    featuresContainer: {
        paddingVertical: 20,
    },
    row: {
        justifyContent: "space-between",
        marginBottom: 15,
    },
    card: {
        flex: 1,
        backgroundColor: COLORS.red2,
        margin: 5,
        borderRadius: 15,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
    },
    cardText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.white,
        textAlign: "center",
    },
});