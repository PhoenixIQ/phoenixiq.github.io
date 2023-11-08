import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import * as packageJson from '../../package.json';

import styles from './index.module.css';
import HomepageArchitecture from "@site/src/components/HomepageArchitecture";

// 使用默认导出的方式访问 `date`
const { date } = packageJson;
/**
 * 读取 package json 生成 release date
 */
function generateReleaseDate(){
  // 读取 date 然后转换为 date 对象
  return new Date(date).toLocaleDateString();
}

/**
 * 顶部 Banner
 * @constructor
 */
function TopBanner() {
  return (
    <div className={styles.topBanner}>
      <div className={styles.topBannerTitle}>
        {'🎉\xa0'}
        <Link
          to="/blog/2.6.x-release"
          className={styles.topBannerTitleText}>
          {'Phoenix\xa02.6.0\xa0已发布!️'}
        </Link>
        {'\xa0🥳'}
      </div>
    </div>
  );
}


/**
 * 首页标头、展示版本，背景图
 * @constructor
 */
function HomepageHeader() {
  const {siteMetadata} = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className={clsx(styles.containerBanner)}>
        <div className={clsx(styles.container)}>
          <h1>PHOENIX</h1>
          <p className={clsx(styles.content)}>
            Phoenix 是一款高性能、事件驱动型的微服务框架
          </p>
          <div className={clsx(styles.link)}>
            <Link
              className={clsx(styles.getStarted)}
              to={clsx(
                "docs/introduce"
              )}
            >
              开始使用
            </Link>
            {/* <Link className={classnames(styles.getStarted)}
                to="https://github.com/PhoenixIQ/bank-account">
                用户登记
              </Link> */}
            <Link
              className={clsx(styles.getStarted)}
              to="https://github.com/PhoenixIQ/phoenix-samples"
            >
              GitHub
            </Link>
          </div>
          <div>
            <iframe
              className={clsx(styles.indexCtasGitHubButton, styles.mr)}
              src="https://ghbtns.com/github-btn.html?user=phoenixiq&repo=phoenix-website&type=star&count=true&size=large"
            >
              <p>Your browser does not support iframes.</p>
            </iframe>
            <iframe
              className={clsx(styles.indexCtasGitHubButton)}
              src="https://ghbtns.com/github-btn.html?user=phoenixiq&repo=phoenix-website&type=fork&count=true&size=large"
            >
              <p>Your browser does not support iframes.</p>
            </iframe>
          </div>
          <div className={clsx(styles.release)}>
            <p className={clsx(styles.version)}>
              Version {siteMetadata.siteVersion}
            </p>
            <p className={clsx(styles.date)}>
              Released on {generateReleaseDate()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title={`EventSourced, CQRS Framework`}>
      <TopBanner/>
      <HomepageHeader/>
      <main>
        <HomepageArchitecture/>
        <HomepageFeatures/>
      </main>
    </Layout>
  );
}
