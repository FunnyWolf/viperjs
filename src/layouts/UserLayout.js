import React, { Fragment } from 'react';

import styles from './UserLayout.less';
import DocumentTitle from 'react-document-title';

class UserLayout extends React.PureComponent {

  render() {
    const { children } = this.props;
    return (
      <Fragment>
        <DocumentTitle title="登录"/>
        <div className={styles.container}>
          {/*<div className={styles.lang}>*/}
          {/*  <SelectLang />*/}
          {/*</div>*/}
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default UserLayout;
