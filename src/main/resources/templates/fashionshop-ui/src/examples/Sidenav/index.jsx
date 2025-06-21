import { useEffect, useState, useMemo } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import { useSoftUIController, setMiniSidenav } from "context";

function Sidenav({ color = "info", brand = "", routes, ...rest }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();
  const { pathname } = location;

  const [openCollapse, setOpenCollapse] = useState({});
  const collapseName = useMemo(() => pathname.split("/")[1], [pathname]);

  useEffect(() => {
    const handleResize = () => {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const toggleCollapse = (key) => {
    setOpenCollapse((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderCollapseChildren = (collapse = []) =>
    collapse.map((subItem) => (
      <NavLink to={subItem.route} key={subItem.key} style={{ textDecoration: "none" }}>
        {({ isActive }) => (
          <SoftBox
            sx={{
              display: "flex",
              alignItems: "center",
              py: 0.75,
              pl: 6,
              color: isActive ? "#38b6ff" : "#7b809a",
              fontWeight: isActive ? 700 : 400,
              fontSize: "1rem",
              borderRadius: 1,
              background: isActive ? "rgba(56,182,255,0.08)" : "transparent",
              transition: "all .2s",
              cursor: "pointer",
              "&:hover": {
                color: "#38b6ff",
                background: "rgba(56,182,255,0.08)",
              },
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#98a4b3",
                marginRight: 16,
              }}
            />
            <SoftTypography
              variant="button"
              sx={{ color: "inherit", fontWeight: isActive ? 700 : 400 }}
            >
              {subItem.name}
            </SoftTypography>
          </SoftBox>
        )}
      </NavLink>
    ));

  const renderRoutes = useMemo(() => (
    routes.map(({ type, name, icon, title, noCollapse, key, route, href, collapse }) => {
      if (type === "collapse") {
        if (Array.isArray(collapse) && collapse.length > 0) {
          return (
            <SoftBox key={key}>
              <SoftBox onClick={() => toggleCollapse(key)}>
                <SidenavCollapse
                  color={color}
                  name={name}
                  icon={icon}
                  active={key === collapseName}
                  noCollapse={false}
                />
              </SoftBox>
              {openCollapse[key] && <List disablePadding>{renderCollapseChildren(collapse)}</List>}
            </SoftBox>
          );
        }

        return href ? (
          <Link href={href} key={key} target="_blank" rel="noreferrer" sx={{ textDecoration: "none" }}>
            <SidenavCollapse
              color={color}
              name={name}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
            />
          </Link>
        ) : (
          <NavLink to={route} key={key} style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <SidenavCollapse
                color={color}
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            )}
          </NavLink>
        );
      }

      if (type === "title") {
        return (
          <SoftTypography
            key={key}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            opacity={0.6}
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </SoftTypography>
        );
      }

      if (type === "divider") return <Divider key={key} />;

      return null;
    })
  ), [routes, color, collapseName, openCollapse]);

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  return (
    <SidenavRoot {...rest} variant="permanent" ownerState={{ transparentSidenav, miniSidenav }}>
      <SoftBox pt={3} pb={1} px={4} textAlign="center">
        <SoftBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <SoftTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </SoftTypography>
        </SoftBox>

        <SoftBox component={NavLink} to="/" display="flex" alignItems="center" justifyContent="center">
          {brand && (
            <SoftBox
              component="img"
              src={brand}
              alt="Soft UI Logo"
              sx={{
                height: "88px",
                width: "88px",
                objectFit: "contain",
                margin: "0 auto",
              }}
            />
          )}
        </SoftBox>
      </SoftBox>

      <Divider />
      <List>{renderRoutes}</List>
      <SoftBox pt={2} my={2} mx={2} mt="auto" />
    </SidenavRoot>
  );
}

Sidenav.propTypes = {
  color: PropTypes.oneOf([
    "primary", "secondary", "info", "success", "warning", "error", "dark",
  ]),
  brand: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
