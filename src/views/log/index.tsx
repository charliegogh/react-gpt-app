import { Table, Card, DatePicker, Space, Button } from 'antd'
import React, { useState, useEffect } from 'react'
import type { DatePickerProps } from 'antd'
import dayjs from 'dayjs'
import { source } from './dict'
import { aiPrefix } from '../../fetch/env'
import { exportToExcel } from '@/hook/useExcel'

interface SourceItem {
  code: string;
  name: string;
}
function getDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

let selectedRow:any = []
function App(props:any) {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [date] = useState<string>(getDate())
  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  })
  const columns = [
    {
      title: 'id',
      width: 100,
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 200,
      render: (_: string) => {
        const sourceItem = source.find((i: SourceItem) => i.code === _)
        return <span>{sourceItem ? sourceItem.name : 'Unknown'}</span>
      }
    },
    {
      title: '模型',
      width: 150,
      dataIndex: 'urlType',
      key: 'urlType'
    },
    {
      title: '提问',
      dataIndex: 'ask',
      width: 250,
      render: (_: string, _2:any) => {
        const customerSendMsg = JSON.parse(_2.customerSendMsg)
        const message = customerSendMsg.question || customerSendMsg[0]?.content || (customerSendMsg.messages && customerSendMsg.messages[0]?.content || '')
        return <span className='line-clamp-3' title={message}>{message}</span>
      }
    },
    {
      title: 'temperature',
      dataIndex: 'temperature',
      width: 150,
      render: (_: string, _2:any) => {
        return <span>{JSON.parse(_2.finalSendToAi).temperature}</span>
      }
    },
    {
      title: '时间',
      width: 200,
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      width: 120,
      key: 'action',
      fixed: 'right',
      render: (_: any, record: any) => (
        <Space size='middle'>
          <a onClick={() => handleChatMessages(record)}>查看</a>
        </Space>
      )
    }
  ]

  const loadData = async(selectedDate:string) => {
    setLoading(true)
    const params = {
      pageIndex: tableParams.pagination.current,
      pageSize: tableParams.pagination.pageSize
    }
    const url = `${aiPrefix}/ai/log/getLogPageList?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: selectedDate
      })
    })
    const rs = await response.json()
    if (rs.Code === 200) {
      setDataSource(rs.Content.records)
      tableParams.pagination.total = rs.Content.total
    } else {
      setDataSource([])
      setTableParams({
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      })
    }
    setLoading(false)
  }
  const onDateChange: DatePickerProps['onChange'] = async(e, dateString:any) => {
    await loadData(dateString)
  }
  const handleTableChange = async(
    pagination: any
  ) => {
    tableParams.pagination = pagination
    await loadData(date)
  }
  const handleChatMessages = (record: any) => {
    props.handleChatMessages(record)
  }
  const handleExport = () => {
    const data = selectedRow.map((i:any) => {
      return {
        '场景需求': source.find((p: any) => p.code === i.source)?.name,
        '现网输入示例': i.finalSendToAi,
        '现网输出示例': i.aiResultMsg
      }
    })
    exportToExcel(data, 'log')
  }
  const rowSelection = {
    onChange: (e:any, e2:any) => {
      selectedRow = e2
    }
  }
  useEffect(() => {
    loadData(date)
  }, [])

  return (
    <Card bordered={false}>
      <DatePicker
        defaultValue={dayjs(date, 'YYYY-MM-DD')} format={'YYYY-MM-DD'}
        onChange={onDateChange}
      />
      <Button
        className='ml-4'
        onClick={handleExport}
      >
        导出
      </Button>
      <Table
        loading={loading}
        scroll={{ x: 1000 }}
        dataSource={dataSource}
        // @ts-ignore
        columns={columns}
        rowSelection={
          rowSelection
        }
        rowKey={'id'}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </Card>
  )
}
export default App
