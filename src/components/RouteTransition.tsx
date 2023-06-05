import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * Types
 */
interface IProps {
  children: ReactNode | ReactNode[]
}

/**
 * Components
 */
export default function RouteTransition({ children }: IProps) {

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        className="routeTransition"
        initial={{ opacity: 0, translateY: 7 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 7 }}
        transition={{ duration: 0.18 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
