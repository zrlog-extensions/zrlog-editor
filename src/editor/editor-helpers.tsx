export const getBorderColor = (dark: boolean) => {
    return dark ? `rgba(253, 253, 253, 0.12)` : "#DDD";
};

export const getBgColor = (dark: boolean) => {
    return dark ? `var(--ant-color-bg-container, #141414)` : `var(--ant-color-bg-container, #ffffff)`;
};

export const getGutterBgColor = (dark: boolean) => {
    return dark ? getBgColor(dark) : `var(--ant-color-fill-quaternary, #f7f7f7)`;
};

export const getActiveLineBgColor = (dark: boolean) => {
    return dark ? `var(--ant-color-fill-quaternary, rgba(255, 255, 255, 0.04))` : "rgba(0, 0, 0, 0.04)";
};

export const getTextColor = (dark: boolean) => {
    return dark ? `var(--ant-color-text, rgba(255, 255, 255, 0.85))` : "inherit";
};
