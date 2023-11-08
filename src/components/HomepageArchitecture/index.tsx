import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  imageUrl: string;
  description: JSX.Element;
};

export default function HomepageArchitecture(): JSX.Element {
  return (
    <section className={styles.introductWrap}>
      <div className="container">
        <div className={clsx(styles.introduct)}>
          <div className={clsx(styles.article)}>
            <h2>Phoenix 是什么？</h2>
            <p>
              Phoenix
              提供了高可用、动态伸缩、分布式事务、内存管理、实时监控等关键能力。擅长解决业务复杂，性能要求高的场景。
            </p>
          </div>
          <div className={clsx(styles.conception)}>
            <img src="img/phoenix_architecture.png" alt="Phoenix架构图"/>
          </div>
        </div>
      </div>
    </section>
  );
}
