import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features_1 = [
  {
    title: '高性能',
    imageUrl: 'img/gxn.png',
    description: 'Phoenix的强大内存计算引擎可以提供毫秒级的低时延，其分布式并行能力保证处理复杂场景时仍然可以提供高达50K的TPS',
  },
  {
    title: '高可用',
    imageUrl: 'img/gky.png',
    description: 'Phoenix提倡“let it crash”的理念，依托事件溯源等技术做到了有状态服务下的多节点部署，满足了金融核心系统RPO=0和秒级RTO的高可用要求',
  },
  {
    title: '高弹性',
    imageUrl: 'img/gtx.png',
    description: 'Phoenix响应式架构的属性使得基于它开发的服务具有良好的水平扩展和收缩的能力，以及流量自动负载均衡的能力，表现出良好的弹性',
  },
];

const features_2 = [
  {
    title: '高容错',
    imageUrl: 'img/grc.png',
    description: 'Phoenix服务内的最小运行单位是聚合根，聚合根之间是完全隔离的，故障不会互相影响。动态漂移特性使得节点发生故障时具有快速恢复能力',
  },
  {
    title: '易编程',
    imageUrl: 'img/ybc.png',
    description: 'Phoenix提供了开箱即用的SpringBoot Starter，对事件驱动和分布式并行计算两种复杂编程模式进行了封装，大大降低了开发者的使用门槛',
  },
  {
    title: '易运维',
    imageUrl: 'img/yyw.png',
    description: 'Phoenix提供了监控管理平台和开放接口，支持系统实时的性能监控、业务监控、调用链追踪、异常分析等能力，满足运维和金融审计需求',
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3 className="text--center">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  return (
    <Layout>
      <header className={classnames(styles.heroBanner)}>
        <div className={classnames(styles.containerBanner)}>
          <div className={classnames(styles.container)}>
            <h1>
              PHOENIX
            </h1>
            <p className={classnames(styles.content)}>
              Phoenix是一个高性能的响应式微服务框架，致力于打造有状态的微服务框架
            </p>
            <div className={classnames(styles.link)}>
              <Link className={classnames(styles.getStarted)}
                to={useBaseUrl('docs/phoenix-2.x/quick-start/phoenix-lite-2x')}>
                开始使用
              </Link>
              <Link className={classnames(styles.getStarted)}
                to="https://github.com/PhoenixIQ/bank-account">
                用户登记
              </Link>
              <Link className={classnames(styles.getStarted)}
                to="https://github.com/PhoenixIQ">
                GitHub
              </Link>
            </div>
            <div>
              <iframe className={classnames(styles.indexCtasGitHubButton)} src="https://ghbtns.com/github-btn.html?user=phoenixiq&repo=phoenix-website&type=star&count=true&size=large">
                <p>Your browser does not support iframes.</p>
              </iframe>
              <iframe className={classnames(styles.indexCtasGitHubButton)} src="https://ghbtns.com/github-btn.html?user=phoenixiq&repo=phoenix-website&type=fork&count=true&size=large">
                <p>Your browser does not support iframes.</p>
              </iframe>
            </div>
            <div className={classnames(styles.release)}>
              <p className={classnames(styles.version)}>Release Note of 1.1.0</p>
              <p className={classnames(styles.date)}>
                Released on Feb 19, 2020
              </p>
            </div>
          </div>
        </div >
      </header >
      <main>
        <div className={classnames(styles.introductWrap)}>
          <div className={classnames(styles.introduct)}>
            <div className={classnames(styles.article)}>
              <h2>Phoenix是什么？</h2>
              <p>
                Phoenix是一个有状态的响应式微服务框架。它提供了高可用、动态伸缩、分布式事务、内存管理、实时监控等关键能力。擅长解决金融领域中业务复杂，性能要求高的场景。
            </p>
            </div>
            <div className={classnames(styles.conception)}>
              <img src="img/attr.png" alt="Phoenix架构图" />
            </div>
          </div>
        </div>
        <div className={styles.featuresWrap}>
          <section className={styles.features}>
            <h1 className="text--center">Phoenix特性</h1>
            {features_1 && features_1.length && (
              <div className={classnames(styles.featuresCon)}>
                <div className="row">
                  {features_1.map((props, idx) => (
                    <Feature key={idx} {...props} />
                  ))}
                </div>
              </div>
            )}
            {features_2 && features_2.length && (
              <div className={classnames(styles.featuresCon)}>
                <div className="row">
                  {features_2.map((props, idx) => (
                    <Feature key={idx} {...props} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout >
  );
}

export default Home;
