import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../theme/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        alignItems: 'center',
        paddingTop: 50,
    },
    alertContainer: {
        width: width - 40,
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 2,
    },
    message: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 13,
        fontWeight: '400',
    },
    closeButton: {
        padding: 5,
        marginLeft: 10,
    }
});
