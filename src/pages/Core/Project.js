import React, { Fragment, useState } from 'react'
import { Button, Form, Input, Modal, Popover, Space, Table } from 'antd'
import { FormOutlined, PlusOutlined, ProjectOutlined } from '@ant-design/icons'
import { deleteWebdatabaseProjectAPI, getWebdatabaseProjectAPI, putWebdatabaseProjectAPI } from '@/services/apiv1'
import { formatText } from '@/utils/locales'
import { useModel, useRequest } from 'umi'

const { Search, TextArea } = Input

const Project = () => {
    const {
        projectActive, setProjectActive,
    } = useModel('WebMainModel', model => ({
        projectActive: model.projectActive, setProjectActive: model.setProjectActive,
    }))
    const [projects, setProjects] = useState([])

    useRequest(getWebdatabaseProjectAPI, {
        onSuccess: (result, params) => {
            setProjects(result)
        }, onError: (error, params) => {
        },
    })

    const updateProjectReq = useRequest(putWebdatabaseProjectAPI, {
        manual: true, onSuccess: (result, params) => {
            if (result.project_id === projectActive.project_id) {
                setProjectActive(result)
            }
            listProjectReq.run()
        }, onError: (error, params) => {
        },
    })

    const listProjectReq = useRequest(getWebdatabaseProjectAPI, {
        manual: true, onSuccess: (result, params) => {
            setProjects(result)
        }, onError: (error, params) => {
        },
    })

    const destoryProjectReq = useRequest(deleteWebdatabaseProjectAPI, {
        manual: true, onSuccess: (result, params) => {
            listProjectReq.run()
        }, onError: (error, params) => {
        },
    })

    const onUpdateProject = values => {
        updateProjectReq.run(values)
    }

    const formLayout = {
        labelCol: { span: 0 }, wrapperCol: { span: 24 },
    }
    const tailLayout = {
        wrapperCol: { offset: 0, span: 24 },
    }

    const ProjectForm = () => {

        return <Form
          style={{
              margin: 4,
          }}
          layout="inline"
          onFinish={onUpdateProject}
        >
            <Form.Item
              label={formatText('project.name')}
              name="name"
              rules={[{
                  required: true, message: formatText('project.name.rule'),
              }]}
            >
                <Input style={{ width: 240 }}
                       placeholder={formatText('project.name.placeholder')}/>
            </Form.Item>
            <Form.Item
              label={formatText('project.desc')}
              name="desc"
            >
                <Input style={{ width: 320 }}
                       placeholder={formatText('project.desc.placeholder')}/>
            </Form.Item>
            <Form.Item>
                <Button
                  loading={updateProjectReq.loading}
                  icon={<PlusOutlined/>}
                  type="primary"
                  htmlType="submit"
                >
                    {formatText('app.core.add')}
                </Button>
            </Form.Item>
        </Form>
    }
    const ProjectTable = () => {
        return <Table
          style={{
              overflow: 'auto', margin: 4, // padding: '0 0 0 0',
              // maxHeight: cssCalc(`${resizeDownHeight} - 32px`),
              // minHeight: cssCalc(`${resizeDownHeight} - 32px`)
          }}
          size="small"
          bordered
          pagination={false}
          rowKey="project_id"
          columns={[{
              title: formatText('project.name'), dataIndex: 'name', key: 'name', width: 240, render: (text, record) => {
                  return <Fragment>
                      {projectActive.project_id === record.project_id ? <strong style={{ color: '#d8bd14' }}>{text}</strong> : <span>{text}</span>}
                      <Popover
                        content={<Search
                          defaultValue={text}
                          style={{ width: 320 }}
                          enterButton={formatText('app.core.update')}
                          size="default"
                          onSearch={value => updateProjectReq.run({
                              project_id: record.project_id, name: value, desc: record.desc,
                          })}
                          loading={updateProjectReq.loading}
                        />}

                        trigger="click"
                      >
                          <a style={{ float: 'right' }}><FormOutlined/></a>
                      </Popover>
                  </Fragment>
              },
          }, {
              title: formatText('project.desc'), dataIndex: 'desc', key: 'desc', render: (text, record) => {
                  return (<Fragment>
                      {projectActive.project_id === record.project_id ? <strong style={{ color: '#d8bd14' }}>{text}</strong> : <span>{text}</span>}
                      <Popover
                        content={<Search
                          defaultValue={text}
                          style={{ width: 400 }}
                          enterButton={formatText('app.core.update')}
                          size="default"
                          onSearch={value => updateProjectReq.run({
                              project_id: record.project_id, name: record.name, desc: value,
                          })}
                          loading={updateProjectReq.loading}
                        />}

                        trigger="click"
                      >
                          <a style={{ float: 'right' }}><FormOutlined/></a>
                      </Popover>
                  </Fragment>)
              },
          }, {
              dataIndex: 'operation', width: 96, render: (text, record) => {
                  const selectbutton = <a
                    onClick={() => setProjectActive(record)}
                    style={{ color: 'yellow' }}
                  >
                      {formatText('project.select')}
                  </a>

                  return <div style={{ textAlign: 'center' }}><Space size="middle">
                      {projectActive.project_id === record.project_id ? <a style={{ visibility: 'Hidden' }}>占位</a> : selectbutton}
                      <a
                        onClick={() => destoryProjectReq.run({
                            project_id: record.project_id,
                        })}
                        style={{ color: 'red' }}
                      >
                          {formatText('app.core.delete')}
                      </a>
                  </Space></div>
              },
          }]}
          dataSource={projects}
        />
    }

    return <>
        <ProjectForm/>
        <ProjectTable/>
    </>
}
export const ProjectButton = () => {
    const {
        projectActive, setProjectActive,
    } = useModel('WebMainModel', model => ({
        projectActive: model.projectActive, setProjectActive: model.setProjectActive,
    }))
    const [openProject, setOpenProject] = useState(false)

    const showProject = () => {
        setOpenProject(true)
    }
    const closeProject = () => {
        setOpenProject(false)
    }

    return <>
        <Space>
            <Button onClick={showProject} icon={<ProjectOutlined/>} style={{ width: 240 }}>{projectActive.name}</Button>
        </Space>
        <Modal
          // mask={false}
          style={{ top: 32 }}
          width="80vw"
          destroyOnClose
          open={openProject}
          onCancel={closeProject}
          footer={null}
          bodyStyle={{ padding: 4 }}
        >
            <Project/>
        </Modal>
    </>

}