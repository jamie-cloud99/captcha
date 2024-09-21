import type { HTMLMotionProps, MotionProps } from "framer-motion";
import type {
  ForwardRefExoticComponent,
  RefAttributes,
  PropsWithChildren,
} from "react";

export type PieceProps = {
  className: string;
};

type MotionComponentProps<P> = Omit<P, keyof MotionProps> & MotionProps;

export type PieceComponent = ForwardRefExoticComponent<
  MotionComponentProps<
    PropsWithChildren<HTMLMotionProps<"div"> & RefAttributes<HTMLDivElement>>
  >
>;
