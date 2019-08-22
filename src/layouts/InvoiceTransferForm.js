import { Form, Modal, Radio, message } from 'antd';
import React, { PureComponent } from 'react';
import EmpSelect from '@/pages/Invoice/components/EmpSelect';

@Form.create()
class InvoiceTransferForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 1,
      empId: null
    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  handleOK = () => {
    const { handleOK } = this.props;
    const {type, empId} = this.state;
    if (type === 1 && !empId) {
      message.info('请选择被移交的业务员');
      return;
    }
    handleOK({
      type,
      empId
    });
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({
      type: 1,
      empId: null
    });
    handleCancel();
  };

  onChange = e => {
    this.setState({
      type: e.target.value,
    });
  };

  handleEmpChange = value => {
    const { state } = this;
    this.setState({
      ...state,
      empId: value,
    });
  };

  render() {
    const { modalVisible } = this.props;
    const { type, empId } = this.state;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <Modal
        title="退出登录"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <Radio.Group onChange={this.onChange} value={type}>
          <Radio value={1} style={radioStyle}>
            移交并退出
            {type === 1 ? <EmpSelect style={{width: 200, marginLeft: 20}} value={empId} onChange={this.handleEmpChange} /> : null}
          </Radio>
          <Radio value={2} style={radioStyle}>
            直接退出
          </Radio>
        </Radio.Group>
      </Modal>
    );
  }
}

export default InvoiceTransferForm;
