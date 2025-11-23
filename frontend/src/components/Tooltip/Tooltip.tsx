import { motion } from "framer-motion";
import "./tooltip.css";

function Tooltip({ tooltipString }: { tooltipString: string }) {
    return (
        <motion.div
            className="tooltips-container"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
                opacity: [0.7, 1],
                scale: [0.7, 1.1, 1.0]
            }}
            transition={{
                duration: 0.15,
                ease: "easeOut"
            }}
        >
            <p>{tooltipString}</p>
        </motion.div>
    );
}

export default Tooltip;
