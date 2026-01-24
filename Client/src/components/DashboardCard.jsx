import React, { useEffect, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const DashboardCard = ({
  title,
  value,
  icon,
  color = "primary",
  children,
  className,
  symbol = "",
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={className}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            fontWeight={600}
          >
            {title}
          </Typography>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              bgcolor: `${color}.50`,
              color: `${color}.main`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
          {symbol}
          {Number(value) < 1 ? (
            Number(value)
          ) : (
            <AnimatedNumber targetValue={Number(value)} />
          )}
        </Typography>
        {children && <Box sx={{ mt: 1 }}>{children}</Box>}
      </Paper>
    </motion.div>
  );
};
const AnimatedNumber = ({ targetValue }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(targetValue);
    if (start === end) return;

    let totalMiliseconds = 2000; // مدة الأنيميشن
    let timer = setInterval(() => {
      start += Math.ceil(end / 50); // سرعة القفزة
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [targetValue]);

  return <>{displayValue.toLocaleString()}</>;
};
export default DashboardCard;
