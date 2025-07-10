// src/layouts/sales/SalesDashboardPage.jsx

import React from "react";
import { useState } from "react";
// Import các component layout chuẩn
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import Grid from "@mui/material/Grid";
import Pay from "../component/Pay"; // Giả sử bạn đã tạo component Pay

// Import component con đã được tách
import SalesCounter from "../component/SalesCounter";

function SalesDashboardPage() {
   const [cartTotal, setCartTotal] = useState(0);

  // Hàm để nhận giá trị mới từ SalesCounter
  const handleTotalChange = (newTotal) => {
    setCartTotal(newTotal);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* Component SalesCounter được gọi ở đây */}
            <SalesCounter onTotalChange={handleTotalChange} />
          </Grid>

        <Grid item xs={12}>
            {/* Component SalesCounter được gọi ở đây */}
            <Pay totalAmount={cartTotal} />
          </Grid>
           
            
            {/* <Grid item xs={12} md={6} lg={8}>
              <AnotherComponent />
            </Grid>
           */}
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SalesDashboardPage;