import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  imageUrl: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "高性能",
    imageUrl: "img/gxn.png",
    description: (
      <>
        基于强大内存计算以及高性能的持久化模型，Phoenix 能够提供毫秒级的低时延，在处理复杂场景时仍能提供高达 50000 的 TPS
      </>
    )
  },
  {
    title: "高可用",
    imageUrl: "img/gky.png",
    description: (
      <>
        基于 Phoenix 开发的微服务组件高度松耦合，依赖于 Phoenix 集群的伸缩能力，在系统发生故障时能够快速检测节点故障并自动恢复
      </>
    )
  },
  {
    title: "高弹性",
    imageUrl: "img/gtx.png",
    description: (
      <>
        基于 Phoenix 开发的有状态微服务具有弹性伸缩的能力，开发者可轻松建立 Phoenix 集群以适应负载，而无需引入复杂组件
      </>
    )
  },
  {
    title: "易审计",
    imageUrl: "img/grc.png",
    description: (
      <>
        Phoenix 具有强大的溯源能力，当程序故障时能够回溯事件以重现异常，也能够根据历史记录进行日志审计的需求
      </>
    )
  },
  {
    title: "易编程",
    imageUrl: "img/ybc.png",
    description: (
      <>
        Phoenix 对聚合根进行了封装，提供了一套抽象 API，并且支持与 Spring Boot 框架集成，降低了 DDD 以及微服务开发门槛
      </>
    )
  },
  {
    title: "易运维",
    imageUrl: "img/yyw.png",
    description: (
      <>
        Phoenix 提供了监控管理平台和开放接口，支持系统实时的性能监控、业务监控、调用链追踪、异常分析等能力，满足运维和金融审计需求
      </>
    )
  }
];

function Feature({title, imageUrl, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')} style={{marginTop: "5rem"}}>
      <div className="text--center">
        <img src={imageUrl} alt={title} className={styles.featureImg}/>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props}/>
          ))}
        </div>
      </div>
    </section>
  );
}
