"use strict";(self.webpackChunkphoenixiq_github_io=self.webpackChunkphoenixiq_github_io||[]).push([[75849],{33145:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>d});var o=i(85893),t=i(11151);const r={id:"phoenix-core-event-store",title:"\u4e8b\u4ef6\u7ba1\u7406"},s=void 0,c={id:"phoenix-2.x/phoenix-core/phoenix-core-event-store",title:"\u4e8b\u4ef6\u7ba1\u7406",description:"\u8bbe\u8ba1\u601d\u60f3",source:"@site/versioned_docs/version-2.5.5/phoenix-2.x/02-phoenix-core/04-event-store.md",sourceDirName:"phoenix-2.x/02-phoenix-core",slug:"/phoenix-2.x/phoenix-core/phoenix-core-event-store",permalink:"/docs/2.5.5/phoenix-2.x/phoenix-core/phoenix-core-event-store",draft:!1,unlisted:!1,editUrl:"https://github.com/PhoenixIQ/versioned_docs/version-2.5.5/phoenix-2.x/02-phoenix-core/04-event-store.md",tags:[],version:"2.5.5",sidebarPosition:4,frontMatter:{id:"phoenix-core-event-store",title:"\u4e8b\u4ef6\u7ba1\u7406"},sidebar:"docs",previous:{title:"\u4e8b\u4ef6\u6eaf\u6e90",permalink:"/docs/2.5.5/phoenix-2.x/phoenix-core/phoenix-core-event-souring"},next:{title:"\u5206\u5e03\u5f0f\u6570\u636e",permalink:"/docs/2.5.5/phoenix-2.x/phoenix-core/phoenix-distributed-data"}},l={},d=[{value:"\u8bbe\u8ba1\u601d\u60f3",id:"\u8bbe\u8ba1\u601d\u60f3",level:2},{value:"EventStore-JDBC",id:"eventstore-jdbc",level:2},{value:"\u4e8b\u4ef6\u5f52\u6863",id:"\u4e8b\u4ef6\u5f52\u6863",level:2}];function a(e){const n={admonition:"admonition",code:"code",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,t.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h2,{id:"\u8bbe\u8ba1\u601d\u60f3",children:"\u8bbe\u8ba1\u601d\u60f3"}),"\n",(0,o.jsx)(n.p,{children:"Phoenix\u7ef4\u62a4\u5185\u5b58\u72b6\u6001\uff0c\u6838\u5fc3\u80fd\u529b\u662f\u4f7f\u7528EventSouring\u6280\u672f\uff0cPhoenix\u4f1a\u5b9a\u65f6\u6253\u5feb\u7167\u7528\u6765\u52a0\u901fEventSouring\u7684\u6062\u590d\u3002"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.img,{alt:"show",src:i(40520).Z+"",width:"1486",height:"512"})}),"\n",(0,o.jsx)(n.h2,{id:"eventstore-jdbc",children:"EventStore-JDBC"}),"\n",(0,o.jsx)(n.p,{children:"Phoenix \u9ed8\u8ba4\u4f7f\u7528\u7684\u662f JDBC \u7248\u672c\u7684 EventStore, \u8bf7\u6309\u4e0b\u9762\u6b65\u9aa4\u8fdb\u884c\u914d\u7f6e"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsx)(n.li,{children:"\u5f15\u7528 phoenix-server-starter \u7684\u4f9d\u8d56"}),"\n"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-xml",children:"<dependency>\n   <groupId>com.iquantex</groupId>\n   <artifactId>phoenix-server-starter</artifactId>\n   <version>2.5.5</version>\n</dependency>\n"})}),"\n",(0,o.jsxs)(n.ol,{start:"2",children:["\n",(0,o.jsxs)(n.li,{children:["\u5728",(0,o.jsx)(n.code,{children:"application.yaml"}),"\u4e2d\u589e\u52a0EventStore\u914d\u7f6e"]}),"\n"]}),"\n",(0,o.jsxs)(n.p,{children:["\u5176\u4e2d\u53ef\u4ee5\u7ed9\u4e00\u4e2a",(0,o.jsx)(n.code,{children:"DataSources"}),"\u589e\u52a0",(0,o.jsx)(n.code,{children:"label"}),"\u9694\u79bb\u4e1a\u52a1\u4f7f\u7528\u548c\u7cfb\u7edf\u4f7f\u7528,\u4e00\u822c\u7528\u4e8e\u6027\u80fd\u6d4b\u8bd5"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"quantex:\n  phoenix:\n      event-store:\n        driver-class-name: org.h2.Driver\n        data-sources:\n          - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC\n            username: sa\n            password:\n          - url: jdbc:h2:file:./data2/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC\n            username: sa\n            password:\n            label: reliablity   # \u914d\u7f6eLabel\u8ba9\u8d44\u6e90\u9694\u79bb(\u6027\u80fd\u6d4b\u8bd5\u7528)\n        initial-size: 0\n        min-idle: 0\n        max-active: 8\n"})}),"\n",(0,o.jsxs)(n.ol,{start:"3",children:["\n",(0,o.jsx)(n.li,{children:"\u5982\u679c\u5728\u6d4b\u8bd5\u8fc7\u7a0b\u4e2d\u4e0d\u60f3\u4f7f\u7528 EventStore \u529f\u80fd\uff0c\u53ef\u4ee5\u8fdb\u884c\u5982\u4e0b\u914d\u7f6e\uff1a"}),"\n"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"quantex:\n  phoenix:\n      event-store:\n        no-eventstore: true\n"})}),"\n",(0,o.jsx)(n.h2,{id:"\u4e8b\u4ef6\u5f52\u6863",children:"\u4e8b\u4ef6\u5f52\u6863"}),"\n",(0,o.jsx)(n.p,{children:"\u5728\u9009\u62e9JDBC\u652f\u6301\u7684\u6570\u636e\u5e93\u65f6\uff0c\u7531\u4e8e\u6709\u4e9b\u6570\u636e\u5e93\u4e0d\u5177\u5907\u52a8\u6001\u6269\u5bb9\u7684\u529f\u80fd\uff0c\u4e8b\u4ef6\u7684\u5b58\u50a8\u5e76\u4e0d\u80fd\u4e00\u76f4\u5b58\u50a8\u4e0b\u53bb\uff0c\u9700\u8981\u5b9a\u671f\u5f52\u6863\u3002\u76ee\u524d\u8c03\u7814\u4e0b\u6765\u7684\u6570\u636e\u5e93\u6709"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"\u4e0d\u652f\u6301\u52a8\u6001\u6269\u5bb9\u7684: MySQL,Oracle"}),"\n",(0,o.jsx)(n.li,{children:"\u652f\u6301\u52a8\u6001\u6269\u5bb9\u7684: TIDB"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"\u6570\u636e\u5e93\u5f52\u6863\u5b58\u5728\u624b\u52a8/\u81ea\u52a8\u89e6\u53d1\u4e24\u79cd\u65b9\u5f0f"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsx)(n.li,{children:"\u5feb\u7167\u6570\u91cf\u89e6\u53d1\u5f52\u6863\uff1a\u5f53\u5feb\u7167\u6570\u91cf\u7d2f\u8ba1\u5230\u4e00\u5b9a\u6570\u91cf\u540e\u89e6\u53d1\u4e00\u6b21\u5f52\u6863\uff08\u6700\u5927\u7d2f\u79ef\u5feb\u7167\u6570\u91cf\u53ef\u914d\u7f6e\uff0c\u9ed8\u8ba4\u4e0d\u89e6\u53d1\u5f52\u6863\uff09"}),"\n",(0,o.jsxs)(n.li,{children:["\u624b\u52a8\u4e00\u952e\u5f52\u6863\uff1a \u5728 ",(0,o.jsx)(n.code,{children:"PhoenixConsole"})," \u7684\u4e8b\u4ef6\u7ba1\u7406\u4e2d\uff0c\u901a\u8fc7 API \u89e6\u53d1\u4e00\u952e\u5168\u91cf\u5f52\u6863."]}),"\n"]}),"\n",(0,o.jsx)(n.admonition,{title:"\u914d\u7f6e\u63d0\u793a",type:"info",children:(0,o.jsxs)(n.p,{children:["\u6700\u5927\u7d2f\u79ef\u5feb\u7167\u6570\u91cf\u914d\u7f6e\uff1a",(0,o.jsx)(n.code,{children:"numberOfRetainSnapshots"})," \uff08int\uff09 \u9ed8\u8ba4\u4e3a ",(0,o.jsx)(n.code,{children:"Integer.MAX_VALUE"}),"\uff0c\u4e0d\u89e6\u53d1\u5f52\u6863 \uff08\u805a\u5408\u6839\u7ea7\u522b\u914d\u7f6e\uff09"]})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:'@EntityAggregateAnnotation(\n        aggregateRootType = "BankAccount",\n        idempotentSize = 100,\n        snapshotInterval = 100000,\n        numberOfRetainSnapshots = 2)\n'})}),"\n",(0,o.jsx)(n.p,{children:"\u5f53\u914d\u7f6e\u4e86\u6700\u5927\u7d2f\u79ef\u5feb\u7167\u6570\u91cf\u7684\u805a\u5408\u6839\u65f6, \u5982\u4e0a\u56fe\u7684\u914d\u7f6e\u5c06\u4f1a\u5728\u805a\u5408\u6839\u89e6\u53d1\u7b2c\u4e09\u6b21\u5feb\u7167\u5f52\u6863, \u5373\u805a\u5408\u6839\u5230\u8fbe\u7b2c 300000 \u7248\u672c\u65f6, \u4f1a\u89e6\u53d1\u5f52\u6863\u5220\u6389 0~100000 \u7248\u672c\u7684\u4e8b\u4ef6\u53ca\u5feb\u7167."})]})}function h(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(a,{...e})}):a(e)}},40520:(e,n,i)=>{i.d(n,{Z:()=>o});const o=i.p+"assets/images/eventsouring-f9020652410148dc17dd3fbea67bc562.png"},11151:(e,n,i)=>{i.d(n,{Z:()=>c,a:()=>s});var o=i(67294);const t={},r=o.createContext(t);function s(e){const n=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),o.createElement(r.Provider,{value:n},e.children)}}}]);