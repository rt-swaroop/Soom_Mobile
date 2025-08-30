import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoContainer: {
        alignItems: "center",
        marginTop: 60,
    },
    logo: {
        width: 280,
        height: 150,
    },
    innerContainer: {
        flex: 1,
        paddingTop: 80,
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: COLORS.white,
        marginTop: 20,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.lightGray,
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        backgroundColor: COLORS.white,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        elevation: 2,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: COLORS.black,
    },
    eyeIcon: {
        paddingHorizontal: 5,
    },
    button: {
        width: "100%",
        borderRadius: 25,
        overflow: "hidden",
        marginTop: 20,
        marginBottom: 15,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    buttonGradient: {
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        width: "100%",
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: 0.5,
    },
    versionText: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        color: COLORS.lightGray,
        fontSize: 12,
    },
});