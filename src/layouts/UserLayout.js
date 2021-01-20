import React, { Fragment } from 'react';

import { Link } from 'umi';

import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import DocumentTitle from 'react-document-title';

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <Fragment>
        <DocumentTitle title="登录 - VIPER"/>
        <div className={styles.container}>
          {/*<div className={styles.lang}>*/}
          {/*  <SelectLang />*/}
          {/*</div>*/}
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo}/>
                  <span className={styles.title}>VIPER</span>
                </Link>
              </div>
              {/*<div className={styles.desc}>VIPER</div>*/}
            </div>
            {children}
          </div>
          {/*<GlobalFooter links={links} copyright={copyright}/>*/}
        </div>
      </Fragment>
    );
  }
}

export default UserLayout;
