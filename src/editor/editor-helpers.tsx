export const getBorder = (dark: boolean) => {
    return dark ? `1px solid rgba(253, 253, 253, 0.12)` : "1px solid #DDD";
};

export const getBorderColor = (dark: boolean) => {
    return dark ? `rgba(253, 253, 253, 0.12)` : "#DDD";
};

export const getBgColor = (dark: boolean) => {
    return dark ? `black` : "#f3f3f3";
};
