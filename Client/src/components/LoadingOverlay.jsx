import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6"
      >
        <CircularProgress
          size={100}
          color="primary"
          thickness={4}
          enableTrackSlot
        />
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            Loading Alysine
          </p>
          <p className="text-sm text-muted-foreground">
            Preparing your experience…
          </p>
        </div>
      </motion.div>
    </div>
  );
}
