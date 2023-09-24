import React, { Fragment, memo, useImperativeHandle } from "react";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useRequest } from "umi";
import { Button, Card, Checkbox, Col, Form, Input, Row, Radio } from "antd";
import { getMsgrpcIPFilterAPI, putMsgrpcIPFilteAPI } from "@/services/apiv1";
import { formatText } from "@/utils/locales";
import { DocIcon } from "@/pages/Core/Common";

const { Search } = Input;
const { TextArea } = Input;



const IPFilter = (props) => {
  console.log("IPFilter");
  const [mainForm] = Form.useForm();
  const [ipfilterActive, setIpfilterActive] = React.useState(false);
  const [geoBlacklist, setGeoBlacklist] = React.useState([]);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [geoBlacklistCheckAll, setGeoBlacklistGeoBlacklistCheckAll] = React.useState(false);

  useRequest(getMsgrpcIPFilterAPI, {
    onSuccess: (result, params) => {
      setIpfilterActive(result.switch);
      mainForm.setFieldsValue(result);
      onChange(result.geo_blacklist);
    },
    onError: (error, params) => {
    }
  });


  const listIPFilterReq = useRequest(getMsgrpcIPFilterAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setIpfilterActive(result.switch);
      mainForm.setFieldsValue(result);
      onChange(result.geo_blacklist);
    },
    onError: (error, params) => {
    }
  });

  useImperativeHandle(props.onRef, () => {
    return {
      updateData: () => {
        listIPFilterReq.run();
      }
    };
  });

  const getIPFilterReq = useRequest(getMsgrpcIPFilterAPI, {
    manual: true,
    onSuccess: (result, params) => {

    },
    onError: (error, params) => {
    }
  });

  const updateIPFilterReq = useRequest(putMsgrpcIPFilteAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listIPFilterReq.run();
    },
    onError: (error, params) => {
    }
  });

  const onUpdateIPFilter = values => {
    values.geo_blacklist = geoBlacklist;
    updateIPFilterReq.run(values);
  };


  const plainOptions = [
    { label: "北京", value: "北京" },
    { label: "天津", value: "天津" },
    { label: "河北", value: "河北" },
    { label: "内蒙古", value: "内蒙古" },
    { label: "辽宁", value: "辽宁" },
    { label: "吉林", value: "吉林" },
    { label: "黑龙江", value: "黑龙江" },
    { label: "上海", value: "上海" },
    { label: "江苏", value: "江苏" },
    { label: "浙江", value: "浙江" },
    { label: "安徽", value: "安徽" },
    { label: "福建", value: "福建" },
    { label: "江西", value: "江西" },
    { label: "山东", value: "山东" },
    { label: "河南", value: "河南" },
    { label: "湖北", value: "湖北" },
    { label: "湖南", value: "湖南" },
    { label: "广东", value: "广东" },
    { label: "广西", value: "广西" },
    { label: "海南", value: "海南" },
    { label: "重庆", value: "重庆" },
    { label: "四川", value: "四川" },
    { label: "贵州", value: "贵州" },
    { label: "云南", value: "云南" },
    { label: "西藏", value: "西藏" },
    { label: "陕西", value: "陕西" },
    { label: "甘肃", value: "甘肃" },
    { label: "青海", value: "青海" },
    { label: "宁夏", value: "宁夏" },
    { label: "新疆", value: "新疆" },
    { label: "香港", value: "香港" },
    { label: "澳门", value: "澳门" },
    { label: "台湾", value: "台湾" },
    { label: "海外", value: "海外" }
  ];

  const plainOptionsValues = [
    "北京",
    "天津",
    "河北",
    "内蒙古",
    "辽宁",
    "吉林",
    "黑龙江",
    "上海",
    "江苏",
    "浙江",
    "安徽",
    "福建",
    "江西",
    "山东",
    "河南",
    "湖北",
    "湖南",
    "广东",
    "广西",
    "海南",
    "重庆",
    "四川",
    "贵州",
    "云南",
    "西藏",
    "陕西",
    "甘肃",
    "青海",
    "宁夏",
    "新疆",
    "香港",
    "澳门",
    "台湾",
    "海外"
  ];

  const onChange = list => {
    setGeoBlacklist(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setGeoBlacklistGeoBlacklistCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = e => {
    setGeoBlacklist(e.target.checked ? plainOptionsValues : []);
    setIndeterminate(false);
    setGeoBlacklistGeoBlacklistCheckAll(e.target.checked);
  };


  return (
    <Fragment>
      <DocIcon url="https://www.yuque.com/vipersec/help/lxlre4" />
      <Card style={{ marginTop: -16 }} bodyStyle={{ padding: "16px 16px 16px 16px" }}>
        <Form
          layout="vertical"
          form={mainForm}
          onFinish={onUpdateIPFilter}
        >
          <Row gutter={16}>
            <Col span={5}>
              <Form.Item
                tooltip={formatText("app.ipfilter.switch.tip")}
                label={formatText("app.ipfilter.switch")}
                name="switch"
                rules={[]}
              >
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value={true}>{formatText("app.ipfilter.switch.running")}</Radio.Button>
                  <Radio.Button value={false}>{formatText("app.ipfilter.switch.inactive")}</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Search placeholder={formatText("app.ipfilter.search.ph")}
                      onSearch={(value) => getIPFilterReq.run({ ip: value })} block />
            </Col>
            <Col span={4}>
              <Form.Item
                tooltip={formatText("app.ipfilter.diy_whitelist.tip")}
                label={formatText("app.ipfilter.diy_whitelist")}
                name="diy_whitelist"
                rules={[{}]}
              >
                <TextArea
                  autoSize={{ minRows: 10, maxRows: 10 }}
                  placeholder={formatText("app.ipfilter.diy_whitelist.ph")} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                tooltip={formatText("app.ipfilter.diy_blacklist.tip")}
                label={formatText("app.ipfilter.diy_blacklist")}
                name="diy_blacklist"
                rules={[{}]}
              >
                <TextArea
                  autoSize={{ minRows: 10, maxRows: 10 }}
                  placeholder={formatText("app.ipfilter.diy_whitelist.ph")} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item
                tooltip={formatText("app.ipfilter.cloud_blacklist.tip")}
                label={formatText("app.ipfilter.cloud_blacklist")}
                name="cloud_blacklist"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
              <Form.Item
                tooltip={formatText("app.ipfilter.sandbox_blacklist.tip")}
                label={formatText("app.ipfilter.sandbox_blacklist")}
                name="sandbox_blacklist"
                valuePropName="checked"
              >
                <Checkbox />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                tooltip={formatText("app.ipfilter.geo_blacklist.tip")}
                label={formatText("app.ipfilter.geo_blacklist")}
                name="geo_blacklist"
              >
                <Checkbox
                  style={{ marginBottom: 4 }}
                  indeterminate={indeterminate} onChange={onCheckAllChange} checked={geoBlacklistCheckAll}
                >
                  {formatText("app.ipfilter.check_all")}
                </Checkbox>
                <Checkbox.Group
                  options={plainOptions}
                  value={geoBlacklist} onChange={onChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            block
            icon={<CloudUploadOutlined />}
            type="primary"
            htmlType="submit"
            loading={updateIPFilterReq.loading}
          >
            {formatText("app.ipfilter.update")}
          </Button>
        </Form>
      </Card>
    </Fragment>
  );
};
export const IPFilterMemo = memo(IPFilter);

export default IPFilter;
