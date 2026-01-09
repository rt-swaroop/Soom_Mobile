import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    header: {
        paddingVertical: 30,
        paddingTop: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10
    },
    name: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: "700"
    },
    email: {
        color: COLORS.white,
        fontSize: 14,
        marginTop: 2
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primaryDark,
        marginBottom: 10
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.darkGray
    },
    infoValue: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.black
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15
    },
    optionText: {
        fontSize: 16,
        color: COLORS.black
    },
    logoutButton: {
        margin: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.red1,
        borderRadius: 10,
        alignItems: "center",
    },
    logoutText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700"
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: COLORS.primaryDark,
    },
    modalMessage: {
        fontSize: 14,
        color: COLORS.black,
        marginBottom: 20,
        textAlign: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: "bold",
    },

});