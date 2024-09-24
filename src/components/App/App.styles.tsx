export const Styled = {
    Button: (
        { children, ...props }: 
        { children: React.ReactNode, [key: string]: any }
    ) => (
        <button {...props} style={{
            padding: 1,
            margin: 10,
            borderRadius: 10,
            width: "180px",
            height: "80px",
            // @ts-ignore
            background: ({
                primary: "rgba(0, 0, 255, 0.4)",
                secondary: "#eee",
                danger: "#f00",
                error: "rgba(255, 0, 0, 0.4)",
                warning: "#f0f",
                success: "rgba(0, 255, 0, 0.4)",
            }[(props as any)?.color] || "#ddd"),
            color: "#fff",
            border: "none",
            // @ts-ignore
            "&:hover": {
                background: "rgba(0, 0, 255, 0.6)",
                cursor: "pointer",
            },
        }}>{children}</button>
    )
};
