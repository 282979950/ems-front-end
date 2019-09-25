import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Alert } from 'antd';
import Login from '@/components/Login';
import router from 'umi/router';
import styles from './Login.less';
import { getLoginStatus } from '../../utils/utils';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
  };

  componentDidMount() {
    if (getLoginStatus() === 0) {
      router.push('/recharge/prePayment');
    }
  }

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <UserName
            name="userName"
            placeholder="用户名"
            rules={[
                {
                  required: true,
                  message: "请输入用户名！",
                },
              ]}
          />
          <Password
            name="password"
            placeholder="密码"
            rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          {getLoginStatus() === 1 && !submitting && this.renderMessage("用户名或密码错误")}
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
