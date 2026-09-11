import { TableColumnsType } from "antd";

export const userColumns: TableColumnsType<any> = [
  {
    title: 'SN',
    dataIndex: 'key',
    width: 50,
    className: 'font-[500]',
    onHeaderCell: () => ({
      style: {backgroundColor: 'black', color: 'white'}
    }),
    render: (text, record, index) => index + 1
  },
  {
    title: 'Date Initiated',
    dataIndex: 'dateInitiated',
    width: 120,
    className: 'font-[500]',
    onHeaderCell: () => ({
      style: {backgroundColor: 'black', color: 'white'}
    }),
    sorter: {
      compare: (a, b) => new Date(a.dateInitiated).getTime() - new Date(b.dateInitiated).getTime(),
      multiple: 1
    }
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 200,
    className: 'font-[500]',
    onHeaderCell: () => ({
      style: {backgroundColor: 'black', color: 'white'}
    })
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: 200,
    className: 'font-[500]',
    onHeaderCell: () => ({
      style: {backgroundColor: 'black', color: 'white'}
    })
  },
  {
    title: 'Role',
    dataIndex: 'role',
    width: 180,
    className: 'font-[500]',
    onHeaderCell: () => ({
      style: {backgroundColor: 'black', color: 'white'}
    })
  },
  {
    title: 'Permissions No',
    dataIndex: 'permissions_no',
    width: 220,
    className: 'font-[500]',
    onHeaderCell: () => ({
      style: {backgroundColor: 'black', color: 'white'}
    })
  },
]
