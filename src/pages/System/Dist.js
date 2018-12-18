import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  TreeSelect
} from 'antd';
import TreeTable from '@/components/TreeTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Dist.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
class DistForm extends PureComponent{
  constructor(props) {
    super(props);

    this.state = {

    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 }
    };
  }

  okHandle() {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  }

  loadTreeData(data0 = []) {
    const treeData = JSON.parse(JSON.stringify(data0));

    function convert(data1 = []) {
      data1.forEach((item) => {
        item.key = item.distName;
        item.value = item.distId;
        item.title = item.distName;
        if (item.children) {
          convert(item.children);
        }
      });
    }

    convert(treeData);
    return treeData;
  }

  render() {
    const { modalVisible, form, handleModalVisible, distTypeOptions, data} = this.props;
    return (
      <Modal
        title="新建区域"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => {
          form.resetFields();
          handleModalVisible();
        }}
      >
        <FormItem {...this.formStyle} label="区域名称">
          {form.getFieldDecorator('distName', {
            rules: [{
              required: true,
              message: '区域名称不能为空！',
            }, {
              max: 20,
              message: '区域名称不能超过20个字',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="区域编码">
          {form.getFieldDecorator('distCode', {
            rules: [{
              max: 20,
              message: '区域编码不能超过20个字'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="区域类别">
          {form.getFieldDecorator('distCategory', {
            rules: [{
              required: true,
              message: '区域类别不能为空！'
            }],
          })(<Select style={{ width: '100%' }}>{distTypeOptions.map((option) => <Option value={option.dictValue} key={option.dictId}>{option.dictKey}</Option>)}</Select>)}
        </FormItem>
        <FormItem {...this.formStyle} label="区域地址">
          {form.getFieldDecorator('distAddress', {
            rules: [{
              max: 50,
              message: '区域地址不能超过50个字！'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="父级区域">
          {form.getFieldDecorator('distParentId', {
            rules: [{
              required: true,
              message: '父级区域不能为空！'
            }],
          })(<TreeSelect style={{ width: '100%' }} treeData={this.loadTreeData(data)} treeDefaultExpandAll />)}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ dist, dic, loading }) => ({
  dist,
  dic,
  loading: loading.models.dist,
}))
@Form.create()
class Dist extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '区域名称',
      dataIndex: 'distName',
    },
    {
      title: '区域编码',
      dataIndex: 'distCode',
    },
    {
      title: '区域类别',
      dataIndex: 'distCategoryName',
    },
    {
      title: '区域地址',
      dataIndex: 'distAddress',
    },
    {
      title: '父级区域',
      dataIndex: 'distParentName'
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dist/fetch'
    });
    dispatch({
      type: 'dic/fetch',
      payload: {
        category: 'dist_type'
      }
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'dist/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'dist/fetch',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'dist/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dist/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dist/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8}}>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('name')(<Input placeholder="区域名称" />)}
          </Col>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('status')(<Input placeholder="区域编码" />)}
          </Col>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" icon="search">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} icon="sync">
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      dist: { data },
      dic : { dicData },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Dist}>
            <div className={styles.DistForm}>{this.renderForm()}</div>
            <div className={styles.DistOperator}>
              <Button icon="plus" onClick={() => this.handleModalVisible(true)}>新建</Button>
              <Button icon="edit" disabled={selectedRows.length !== 1}>编辑</Button>
              <Button icon="delete" disabled={selectedRows.length === 0}>删除</Button>
            </div>
            <TreeTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              size='small'
              rowKey='distId'
            />
          </div>
        </Card>
        <DistForm {...parentMethods} modalVisible={modalVisible} distTypeOptions={dicData} data={data} />
      </PageHeaderWrapper>
    );
  }
}

export default Dist;
