export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
  filterable: boolean;
  visible: boolean;
  width?: number;
  type: 'string' | 'date' | 'number';
  format?: string;
}

export interface TableConfiguration {
  columns: TableColumn[];
  defaultSort: {
    column: string;
    direction: 'asc' | 'desc';
  };
  pagination: {
    defaultPageSize: number;
    pageSizeOptions: number[];
  };
  filters: {
    company: {
      type: 'dropdown';
      multiple: boolean;
    };
  };
}

export const defaultTableConfiguration: TableConfiguration = {
  columns: [
    {
      key: 'id',
      label: 'ID',
      sortable: false,
      filterable: false,
      visible: true,
      width: 80,
      type: 'number',
    },
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      filterable: true,
      visible: true,
      width: 120,
      type: 'string',
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      filterable: true,
      visible: true,
      width: 300,
      type: 'string',
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      filterable: true,
      visible: true,
      width: 250,
      type: 'string',
    },
    {
      key: 'launchDate',
      label: 'Launch Date',
      sortable: true,
      filterable: true,
      visible: true,
      width: 150,
      type: 'date',
      format: 'dd.MM.yyyy',
    },
  ],
  defaultSort: {
    column: 'launchDate',
    direction: 'desc',
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  filters: {
    company: {
      type: 'dropdown',
      multiple: false,
    },
  },
};
