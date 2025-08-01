function navbar(theme, ownerState) {
  const { palette, boxShadows, functions, transitions, breakpoints, borders } = theme;
  const { dark, white } = palette;
  const { navbarBoxShadow } = boxShadows;
  const { rgba, pxToRem } = functions;
  const { borderRadius } = borders;

  return {
    // Không còn phụ thuộc transparentNavbar hay absolute, luôn dùng shadow và backdropFilter nếu muốn
    boxShadow: navbarBoxShadow,
    backdropFilter: `saturate(200%) blur(${pxToRem(30)})`,
    backgroundColor: rgba(white.main, 0.8), // Luôn dùng màu trắng trong suốt 80%

    color: dark.main, // Có thể tuỳ chỉnh theo nhu cầu (giữ màu chữ tối)

    top: pxToRem(12),
    minHeight: pxToRem(75),
    display: "grid",
    alignItems: "center",
    borderRadius: borderRadius.xl,
    paddingTop: pxToRem(8),
    paddingBottom: pxToRem(8),
    paddingRight: 0,
    paddingLeft: pxToRem(16),

    "& > *": {
      transition: transitions.create("all", {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    "& .MuiToolbar-root": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      [breakpoints.up("sm")]: {
        minHeight: "auto",
        padding: `${pxToRem(4)} ${pxToRem(16)}`,
      },
    },
  };
}

const navbarContainer = ({ breakpoints }) => ({
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  pt: 0.5,
  pb: 0.5,

  [breakpoints.up("md")]: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: "0",
    paddingBottom: "0",
  },
});

const navbarRow = ({ breakpoints }, { isMini }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",

  [breakpoints.up("md")]: {
    justifyContent: isMini ? "space-between" : "stretch",
    width: isMini ? "100%" : "max-content",
  },

  [breakpoints.up("xl")]: {
    justifyContent: "stretch !important",
    width: "max-content !important",
  },
});

const navbarIconButton = ({ typography: { size }, breakpoints }) => ({
  px: 0.75,

  "& .material-icons, .material-icons-round": {
    fontSize: `${size.md} !important`,
  },

  "& .MuiTypography-root": {
    display: "none",

    [breakpoints.up("sm")]: {
      display: "inline-block",
      lineHeight: 1.2,
      ml: 0.5,
    },
  },
});

// *** ĐÃ SỬA ĐỂ LUÔN HIỂN THỊ ***
const navbarMobileMenu = ({ breakpoints }) => ({
  display: "inline-block",
  lineHeight: 0,
  // Bỏ phần này để luôn hiển thị trên mọi màn hình:
  // [breakpoints.up("xl")]: {
  //   display: "none",
  // },
});

export { navbar, navbarContainer, navbarRow, navbarIconButton, navbarMobileMenu };