import { StyleSheet, Dimensions, Platform } from "react-native";
import { COLORS } from "../../../theme/colors";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundDecoration: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    backgroundDecorationBottom: {
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: "center",
    },
    headerSection: {
        alignItems: "center",
        marginBottom: 50,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    title: {
        fontSize: 34,
        fontWeight: "900",
        color: COLORS.white,
        textAlign: "center",
        letterSpacing: -1,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 17,
        color: "rgba(255,255,255,0.85)",
        textAlign: "center",
        marginTop: 12,
        lineHeight: 24,
        fontWeight: '500',
    },
    selectionContainer: {
        gap: 20,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        flexDirection: "row",
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.15,
                shadowRadius: 15,
            },
            android: {
                elevation: 10,
            },
        }),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    adminAccent: {
        borderLeftWidth: 6,
        borderLeftColor: '#29B6F6',
    },
    userAccent: {
        borderLeftWidth: 6,
        borderLeftColor: '#4CAF50',
    },
    iconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 19,
        fontWeight: "800",
        color: "#1E293B",
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: "#64748B",
        lineHeight: 18,
        fontWeight: '500',
    },
    goIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingBottom: 40,
        alignItems: "center",
    },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    logoutBtnText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: "700",
        marginLeft: 10,
    }
});
