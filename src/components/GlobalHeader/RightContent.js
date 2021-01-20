import React, { PureComponent } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Spin, Tag, Menu, Avatar, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';
import adminLogo from '../../assets/userlogo.svg';
import userLogo from '../../assets/userlogo.svg';

const userlogos = { user: userLogo, admin: adminLogo };

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  fetchMoreNotices = tabProps => {
    const { list, name } = tabProps;
    const { dispatch, notices = [] } = this.props;
    const lastItemId = notices[notices.length - 1].id;
    dispatch({
      type: 'global/fetchMoreNotices',
      payload: {
        lastItemId,
        type: name,
        offset: list.length,
      },
    });
  };

  render() {
    const {
      currentUser,
      fetchingMoreNotices,
      fetchingNotices,
      loadedAllNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      skeletonCount,
      theme,
    } = this.props;

    const menu = (
      <Menu
        theme="light"
        className={styles.menu}
        style={{ background: 'rgba(0, 0, 0, 0.90)' }}
        selectedKeys={[]}
        onClick={onMenuClick}
      >
        <Menu.Item key="settings">
          <LegacyIcon type="setting"/>
          设置
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout">
          <LegacyIcon type="logout"/>
          退出
          {/*<FormattedMessage id="menu.account.logout" defaultMessage="logout"/>*/}
        </Menu.Item>
      </Menu>
    );
    const loadMoreProps = {
      skeletonCount,
      loadedAll: loadedAllNotices,
      loading: fetchingMoreNotices,
    };
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {/*<HeaderSearch*/}
        {/*  className={`${styles.action} ${styles.search}`}*/}
        {/*  placeholder={formatMessage({ id: 'component.globalHeader.search' })}*/}
        {/*  dataSource={[*/}
        {/*    formatMessage({ id: 'component.globalHeader.search.example1' }),*/}
        {/*    formatMessage({ id: 'component.globalHeader.search.example2' }),*/}
        {/*    formatMessage({ id: 'component.globalHeader.search.example3' }),*/}
        {/*  ]}*/}
        {/*  onSearch={value => {*/}
        {/*    console.log('input', value); // eslint-disable-line*/}
        {/*  }}*/}
        {/*  onPressEnter={value => {*/}
        {/*    console.log('enter', value); // eslint-disable-line*/}
        {/*  }}*/}
        {/*/>*/}
        <Tooltip title='使用文档'>
          <a
            target="_blank"
            href="https://shimo.im/docs/C5dqkCBoTWIxCuwG"
            download
            // rel="noopener noreferrer"
            className={styles.action}
          >
            <LegacyIcon type="question-circle-o"/>
          </a>
        </Tooltip>
        {/*<NoticeIcon*/}
        {/*  className={styles.action}*/}
        {/*  count={currentUser.unreadCount}*/}
        {/*  onItemClick={(item, tabProps) => {*/}
        {/*    console.log(item, tabProps); // eslint-disable-line*/}
        {/*    this.changeReadState(item, tabProps);*/}
        {/*  }}*/}
        {/*  locale={{*/}
        {/*    emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),*/}
        {/*    clear: formatMessage({ id: 'component.noticeIcon.clear' }),*/}
        {/*    loadedAll: formatMessage({ id: 'component.noticeIcon.loaded' }),*/}
        {/*    loadMore: formatMessage({ id: 'component.noticeIcon.loading-more' }),*/}
        {/*  }}*/}
        {/*  onClear={onNoticeClear}*/}
        {/*  onLoadMore={this.fetchMoreNotices}*/}
        {/*  onPopupVisibleChange={onNoticeVisibleChange}*/}
        {/*  loading={fetchingNotices}*/}
        {/*  clearClose*/}
        {/*>*/}
        {/*  <NoticeIcon.Tab*/}
        {/*    count={unreadMsg.notification}*/}
        {/*    list={noticeData.notification}*/}
        {/*    title={formatMessage({ id: 'component.globalHeader.notification' })}*/}
        {/*    name="notification"*/}
        {/*    emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}*/}
        {/*    emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"*/}
        {/*    {...loadMoreProps}*/}
        {/*  />*/}
        {/*  <NoticeIcon.Tab*/}
        {/*    count={unreadMsg.message}*/}
        {/*    list={noticeData.message}*/}
        {/*    title={formatMessage({ id: 'component.globalHeader.message' })}*/}
        {/*    name="message"*/}
        {/*    emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}*/}
        {/*    emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"*/}
        {/*    {...loadMoreProps}*/}
        {/*  />*/}
        {/*  <NoticeIcon.Tab*/}
        {/*    count={unreadMsg.event}*/}
        {/*    list={noticeData.event}*/}
        {/*    title={formatMessage({ id: 'component.globalHeader.event' })}*/}
        {/*    name="event"*/}
        {/*    emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}*/}
        {/*    emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"*/}
        {/*    {...loadMoreProps}*/}
        {/*  />*/}
        {/*</NoticeIcon>*/}
        {currentUser.name ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={userlogos[currentUser.avatar]}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }}/>
        )}
        {/*<SelectLang className={styles.action} />*/}
      </div>
    );
  }
}
