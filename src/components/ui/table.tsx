import React from 'react';
import styles from './Table.module.css';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'compact' | 'default' | 'spacious';
  responsive?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  status?: 'default' | 'success' | 'warning' | 'error';
}

export interface TableEmptyProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ 
    variant = 'default', 
    size = 'default', 
    responsive = false,
    loading = false,
    className, 
    children,
    ...props 
  }, ref) => {
    const tableClasses = [
      styles.table,
      variant !== 'default' && styles[variant],
      size !== 'default' && styles[size],
      responsive && styles.responsive,
      className
    ].filter(Boolean).join(' ');

    const containerClasses = [
      styles.tableContainer,
      loading && styles.loading
    ].filter(Boolean).join(' ');

    return (
      <div className={containerClasses}>
        <table
          ref={ref}
          className={tableClasses}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead
      ref={ref}
      className={[styles.header, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </thead>
  )
);

TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody
      ref={ref}
      className={[styles.body, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </tbody>
  )
);

TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, children, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={[styles.footer, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </tfoot>
  )
);

TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    const isHeaderRow = React.Children.toArray(children).some(
      child => React.isValidElement(child) && child.type === TableHead
    );
    const isFooterRow = props.className?.includes('footer');

    const rowClasses = [
      isHeaderRow ? styles.headerRow : isFooterRow ? styles.footerRow : styles.bodyRow,
      className
    ].filter(Boolean).join(' ');

    return (
      <tr
        ref={ref}
        className={rowClasses}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ 
    className, 
    children, 
    sortable = false,
    sortDirection = null,
    onSort,
    ...props 
  }, ref) => {
    const headClasses = [
      styles.headerCell,
      sortable && styles.sortable,
      className
    ].filter(Boolean).join(' ');

    const handleSort = () => {
      if (sortable && onSort) {
        onSort();
      }
    };

    return (
      <th
        ref={ref}
        className={headClasses}
        onClick={handleSort}
        {...props}
      >
        {children}
        {sortable && (
          <span className={[
            styles.sortIcon,
            sortDirection && styles.active
          ].filter(Boolean).join(' ')}>
            {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ 
    className, 
    children, 
    align = 'left',
    status = 'default',
    ...props 
  }, ref) => {
    const cellClasses = [
      styles.bodyCell,
      styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}`],
      status !== 'default' && styles.statusCell,
      status !== 'default' && styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`],
      className
    ].filter(Boolean).join(' ');

    return (
      <td
        ref={ref}
        className={cellClasses}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

const TableEmpty: React.FC<TableEmptyProps> = ({ children, icon }) => (
  <tr>
    <td colSpan={100} className={styles.empty}>
      {icon}
      <div>{children}</div>
    </td>
  </tr>
);

TableEmpty.displayName = 'TableEmpty';

export { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter,
  TableRow, 
  TableHead, 
  TableCell,
  TableEmpty
};