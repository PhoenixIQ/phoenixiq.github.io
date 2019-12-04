/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    {
      content: `使用此站点上的文档了解更多信息。`,
      title: '文档',
    },
    {
      content: '深圳项目组成员：<br/><br/> 蓝文昌 、 郭超学 、 孙心原 、 高彦良 <br/><br/> 上海项目组成员：<br/><br/>石宝迪 、 申政杰',
      title: '联系项目组成员',
    },
    {
      content: "了解此项目的新功能",
      title: '保持关注',
    },
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
          <h1>需要帮助吗?</h1>
          </header>
          <p>该项目由北京宽拓智融科技有限公司 - Phoenix项目组进行维护</p>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
