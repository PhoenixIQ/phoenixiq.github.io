import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>内存计算</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
         Phoenix使系统业务数据的修改完全在内存中进行，业务数据模型和算法面向内存构建，使业务代码高度聚合，并且简化计算层和存储层的交互提升性能。
      </>
    ),
  },
  {
    title: <>消息驱动</>,
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
         Phoenix使用消息进行服务间通信，各服务自定义消息和发布消息。消息驱动是异步的交互方式，基于Fire-and-Forget原则，不必阻塞式地等待相关的处理结果。
      </>
    ),
  },
  {
    title: <>微服务</>,
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        Phoenix框架同时也是可伸缩，可拆分聚合的微服务框架。根据DDD思想划分领域构建服务，对服务进行独立的开发、测试和部署。
      </>
    ),
  },
];

const steps = [
  {
    title: <>金融领域复杂业务场景解决之道</>,
    imageUrl: 'img/what-problems-phoenix-solves.png',
    description: (
      <>
        <div style={{whiteSpace: 'pre-wrap'}}>降低成本</div>
        <ul>
          <li>降低了系统复杂度</li>
          <li>降低了开发人员门槛</li>
          <li>节省了系统建设时间</li>
        </ul>
        增强效率
        <ul>
          <li>提升了系统的运行性能</li>
          <li>实现了系统的实时监控</li>
          <li>让系统面向开放，拥抱集成</li>
        </ul>
      </>
    ),
    position: 'right'
  },
];

function Step({imageUrl, title, description, position}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
      <>
        {position === 'left' && (
          <div className="row">
            <div className="col col--7">
              <div className="text--center">
                <img src={imgUrl} alt={title} />
              </div>
            </div>
            <div className="col col--4 col--offset-1 padding-vert--xl">
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </div>
        )}
        {position === 'right' && (
          <div className={classnames('row', styles.stepBackground)}>
            <div className="col col--4 padding-vert--xl">
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <div className="col col--7 col--offset-1">
              <div className="text--center">
                <img src={imgUrl} alt={title} />
              </div>
            </div>
          </div>
        )}
      </>
  );
}
 

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/phoenix-2.x/quick-start/phoenix-lite-2x')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        {steps && steps.length && (
          <section className={styles.steps}>
            <div className="container">
              {steps.map((props, idx) => (
                <Step key={idx} {...props} />
              ))}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
