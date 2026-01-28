import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "../../../theme/useAppTheme";

const { width, height } = Dimensions.get("window");

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        width: width * 0.5,
        height: width * 0.5,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: "100%",
        height: "100%",
    },
    pulseCircle: {
        position: 'absolute',
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: (width * 0.5) / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    loaderContainer: {
        position: 'absolute',
        bottom: height * 0.15,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 15,
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    }
});
