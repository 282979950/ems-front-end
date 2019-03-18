import React, { PureComponent } from 'react';

class OCX extends PureComponent {

  /**
   * 读卡
   *
   * @returns {string[]}
   */
  static readCard() {
    const ocx = document.getElementById("ICRW");
    const data = ocx.ReadCard(0, 200);
    const result = String(data).split("~", 7);
    result[4] /=10;
    return result[0] === "S" ? result : ocx.ErrorDesc;
  }

  /**
   * 写一般充值卡
   * @param icCardId IC卡号
   * @param icCardPsw IC卡密码
   * @param gas 充值气量（单位：方）
   * @param fc 维修次数
   * @param busisn 交易流水号
   * @return string S:成功 F:失败
   * @constructor
   */
  static writeUCard(icCardId, icCardPsw, gas, fc, busisn) {
    const ocx = document.getElementById('ICRW');
    const result = ocx.WriteUCard(0, 200, icCardId, icCardPsw, gas * 10, fc, busisn);
    return result === "S" ? "写卡成功" : `写卡失败${ocx.ErrorDesc}`;
  }

  /**
   * 写密码传递卡
   * @param icCardId IC卡号
   * @param icCardPsw IC卡密码
   * @param gas 充值气量（单位：方）
   * @param fc 维修次数（单位：方）
   * @param sum 卡输入总量
   * @param busisn 交易流水号
   * @constructor
   * @return {string}
   */
  static writePCard(icCardId, icCardPsw, gas, fc, sum, busisn) {
    const ocx = document.getElementById('ICRW');
    const result = ocx.WritePCard(0, 200, icCardId, icCardPsw, gas * 10, fc, sum, busisn);
    return result === "S" ? "写卡成功" : `写卡失败${ocx.ErrorDesc}`;
  }

  /**
   * 初始化IC卡
   * @param icPsw
   * @return {*}
   */
  static initCard(icPsw) {
    const ocx = document.getElementById('ICRW');
    const result = ocx.InitCard(0, 200, icPsw);
    return result === 'S' ? result : ocx.ErrorDesc;
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // return (<object id="ICRW" type="application/x-itst-activex" clsid="{6C8FD9AF-5668-45C8-8D9A-EBE02A7A2F39}" width='0px' height='0px' />);
    return (<object id="ICRW" classID="CLSID:6C8FD9AF-5668-45C8-8D9A-EBE02A7A2F39" />);
  }
}

export default OCX;
