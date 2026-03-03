import clsx from 'clsx';
import React, { forwardRef, type ReactNode } from 'react';
import styles from './Grid.module.scss';

export type RowProps = {
  className?: string;
  cols?: number;
  customCols?: string;
  children: ReactNode;
  gap?: boolean;
  minWidth?: string;
};

export type CellProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children: ReactNode;
  cellNormal?: boolean;
  asCard?: boolean;
  span?: 1 | 2 | 3 | 4 | 5 | 6;
};

const Row = forwardRef<HTMLDivElement, RowProps>(
  (
    {
      className,
      cols = 1,
      minWidth,
      customCols,
      children,
      gap = true,
      ...props
    },
    ref,
  ) => {
    const dynamicClassName = customCols || styles[`grid--${cols}`];
    const inlineStyles = {
      ...(cols && { '--_grid-cols': cols }),
      ...(minWidth && { '--_min-column-width': minWidth }),
    } as React.CSSProperties;
    return (
      <div
        data-cols={customCols || cols}
        className={clsx(styles.grid, dynamicClassName, className, {
          [styles['grid__no-gap']]: !gap,
        })}
        ref={ref}
        style={inlineStyles}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Row.displayName = 'Row';

const Cell = ({
  className,
  children,
  cellNormal = false,
  asCard = false,
  span,
  ...props
}: CellProps) => {
  const inlineStyles = {
    ...(span && { '--_span': span }),
  } as React.CSSProperties;
  return (
    <div
      className={clsx(styles.grid__item, className, {
        [styles.card]: asCard,
        [styles.normal]: cellNormal && !asCard,
      })}
      style={inlineStyles}
      {...props}
    >
      {children}
    </div>
  );
};

Cell.displayName = 'Cell';

export { Row, Cell };
