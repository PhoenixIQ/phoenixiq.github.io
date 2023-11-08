"use strict";(self.webpackChunkphoenixiq_github_io=self.webpackChunkphoenixiq_github_io||[]).push([[58097],{59376:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>l,contentTitle:()=>o,default:()=>g,frontMatter:()=>a,metadata:()=>c,toc:()=>s});var i=t(85893),r=t(11151);const a={id:"phoenix-transaction-aggregate",title:"\u4f7f\u7528\u8bf4\u660e",description:"Phoenix \u5206\u5e03\u5f0f\u4e8b\u52a1\u4f7f\u7528\u8bf4\u660e"},o=void 0,c={id:"phoenix-transaction/phoenix-transaction-aggregate",title:"\u4f7f\u7528\u8bf4\u660e",description:"Phoenix \u5206\u5e03\u5f0f\u4e8b\u52a1\u4f7f\u7528\u8bf4\u660e",source:"@site/docs/03-phoenix-transaction/02-transaction-aggregate.md",sourceDirName:"03-phoenix-transaction",slug:"/phoenix-transaction/phoenix-transaction-aggregate",permalink:"/docs/phoenix-transaction/phoenix-transaction-aggregate",draft:!1,unlisted:!1,editUrl:"https://github.com/PhoenixIQ/docs/03-phoenix-transaction/02-transaction-aggregate.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{id:"phoenix-transaction-aggregate",title:"\u4f7f\u7528\u8bf4\u660e",description:"Phoenix \u5206\u5e03\u5f0f\u4e8b\u52a1\u4f7f\u7528\u8bf4\u660e"},sidebar:"docs",previous:{title:"\u4e8b\u52a1\u6a21\u5f0f",permalink:"/docs/phoenix-transaction/phoenix-transaction-module"},next:{title:"\u529f\u80fd\u4ecb\u7ecd",permalink:"/docs/phoenix-event-publish/event-publish-readme"}},l={},s=[{value:"maven\u4f9d\u8d56",id:"dependency",level:2},{value:"\u4e8b\u52a1\u805a\u5408\u6839",id:"transaction-aggregate",level:2},{value:"\u793a\u4f8b\u4ee3\u7801",id:"aggregate-example",level:4},{value:"\u4e8b\u52a1\u5165\u53e3",id:"start",level:2},{value:"\u793a\u4f8b\u4ee3\u7801",id:"start-example",level:4},{value:"TransactionReturn",id:"return",level:4},{value:"TransactionAction",id:"action",level:4},{value:"\u4e8b\u4ef6\u5904\u7406",id:"event-handler",level:2},{value:"\u793a\u4f8b\u4ee3\u7801",id:"handler-example",level:4},{value:"\u4e8b\u52a1\u5b8c\u6210",id:"finish",level:2},{value:"\u793a\u4f8b\u4ee3\u7801",id:"finish-example",level:4},{value:"\u5b8c\u6574\u6848\u4f8b",id:"full-example",level:2},{value:"command/event\u5b9a\u4e49",id:"define",level:4},{value:"\u5b9a\u4e49\u4e8b\u52a1\u805a\u5408\u6839",id:"define-aggregate",level:4},{value:"\u5b9a\u4e49\u5b9e\u4f53\u805a\u5408\u6839",id:"define-entity-aggregate",level:4}];function d(n){const e={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",h2:"h2",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.a)(),...n.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.p,{children:"Phoenix\u6846\u67b6\u63d0\u4f9b\u4e86\u4e8b\u52a1\u6a21\u5757\uff0c\u7528\u6765\u89e3\u51b3\u5206\u5e03\u5f0f\u4e8b\u52a1\u95ee\u9898\u3002\u76ee\u524d\u5df2\u652f\u6301\u7684\u4e8b\u52a1\u6a21\u5f0f\u6709 SAGA \u548c TCC\u3002\u5728\u5b9a\u4e49\u4e8b\u52a1\u5904\u7406\u6a21\u578b\u65f6\uff0c\u4f60\u53ef\u4ee5\u7075\u6d3b\u914d\u7f6e\u8fd9\u4e24\u79cd\u4e8b\u52a1\u6a21\u5f0f\u3002\u672c\u7bc7\u5c06\u4ecb\u7ecd\u4e8b\u52a1\u805a\u5408\u6839\u7684\u5b9a\u4e49\u89c4\u8303\u3002"}),"\n",(0,i.jsx)(e.h2,{id:"dependency",children:"maven\u4f9d\u8d56"}),"\n",(0,i.jsx)(e.p,{children:"\u5982\u679c\u9700\u8981\u7528\u5230\u4e8b\u52a1\u6a21\u5757\uff0c\u9700\u8981\u5148\u5f15\u5165\u4e0b\u9762\u7684\u4f9d\u8d56"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-xml",children:"<dependency>\n   <groupId>com.iquantex</groupId>\n   <artifactId>phoenix-transaction</artifactId>\n   <version>2.6.1</version>\n</dependency>\n"})}),"\n",(0,i.jsx)(e.h2,{id:"transaction-aggregate",children:"\u4e8b\u52a1\u805a\u5408\u6839"}),"\n",(0,i.jsxs)(e.p,{children:["\u4e8b\u52a1\u805a\u5408\u6839\u9700\u8981\u4f7f\u7528",(0,i.jsx)(e.code,{children:"@TransactionAggregateAnnotation"}),"\u6765\u6807\u8bb0\u7c7b\uff0c\u670d\u52a1\u542f\u52a8\u540ephoenix\u4f1a\u6821\u9a8c\u5b9a\u4e49\u89c4\u8303\u548c\u521b\u5efa\u4e8b\u52a1\u805a\u5408\u6839\u7c7b\u5bf9\u8c61\u3002\u4e8b\u52a1\u805a\u5408\u6839\u7c7b\u9700\u8981\u9075\u5faa\u5982\u4e0b\u89c4\u8303:"]}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsxs)(e.li,{children:["\u805a\u5408\u6839\u7c7b\u9700\u8981\u4f7f\u7528 ",(0,i.jsx)(e.code,{children:"@TransactionAggregateAnnotation"})," \u6ce8\u89e3\u8fdb\u884c\u6807\u8bb0\u3002"]}),"\n",(0,i.jsxs)(e.li,{children:["\u805a\u5408\u6839\u7c7b\u4ee5\u53ca\u805a\u5408\u6839\u7c7b\u4e2d\u7684\u5b9e\u4f53\u5747\u9700\u5b9e\u73b0 ",(0,i.jsx)(e.code,{children:"Serializable"})," \u63a5\u53e3\uff0c\u5e76\u5b9a\u4e49serialVersionUID\u3002"]}),"\n"]}),"\n",(0,i.jsx)(e.admonition,{title:"\u6ce8\u610f",type:"caution",children:(0,i.jsxs)(e.p,{children:["\u5728\u805a\u5408\u6839\u4e0a\u6dfb\u52a0 ",(0,i.jsx)(e.code,{children:"@TransactionAggregateAnnotation"})," \u6ce8\u89e3\u65f6\uff0c\u9700\u8981\u901a\u8fc7 ",(0,i.jsx)(e.code,{children:"aggregateRootType"})," \u6307\u5b9a\u4e00\u4e2a\u805a\u5408\u6839\u7684\u7c7b\u522b\u3002\u7528\u6765\u533a\u5206\u4e0d\u540c\u7684\u805a\u5408\u6839\u7c7b\u3002"]})}),"\n",(0,i.jsx)(e.h4,{id:"aggregate-example",children:"\u793a\u4f8b\u4ee3\u7801"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:'@TransactionAggregateAnnotation(aggregateRootType = "ShoppingAggregateSagaTcc")\npublic class ShoppingAggregateSagaTcc implements Serializable {\n    private static final long     serialVersionUID          = 7007603076743033374L; \n    // ... act and on method\n}\n'})}),"\n",(0,i.jsx)(e.h2,{id:"start",children:"\u4e8b\u52a1\u5165\u53e3"}),"\n",(0,i.jsxs)(e.p,{children:["\u4e8b\u52a1\u805a\u5408\u6839\u9700\u8981\u4f7f\u7528 ",(0,i.jsx)(e.code,{children:"@TransactionStart"})," \u8868\u793a\u4e8b\u52a1\u7684\u5165\u53e3\uff0c\u8be5\u4e8b\u52a1\u5f00\u59cb\u65b9\u6cd5\u9700\u8981\u5b9a\u4e49\u4e8b\u52a1\u7684\u5904\u7406\u6a21\u578b\u3002"]}),"\n",(0,i.jsx)(e.p,{children:"\u4e8b\u52a1\u5f00\u59cb\u65b9\u6cd5\u9700\u8981\u9075\u5faa\u5982\u4e0b\u89c4\u8303:"}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsxs)(e.li,{children:["\u4f7f\u7528 ",(0,i.jsx)(e.code,{children:"@TransactionStart"})," \u6ce8\u89e3"]}),"\n",(0,i.jsx)(e.li,{children:"\u8be5\u65b9\u6cd5\u53ea\u80fd\u6709\u4e00\u4e2a\u5165\u53c2"}),"\n",(0,i.jsxs)(e.li,{children:["\u5982\u679c\u5f53\u524d\u7c7b\u4e2d\u5b58\u5728\u591a\u4e2a\u4f7f\u7528 ",(0,i.jsx)(e.code,{children:"@TransactionStart"})," \u6ce8\u89e3\u5e76\u4e14\u53ea\u6709\u4e00\u4e2a\u5165\u53c2\u7684\u65b9\u6cd5\uff0c\u90a3\u4e48\u4f60\u5c06\u6536\u5230\u4e00\u4e2aAggregateClassException\u5f02\u5e38"]}),"\n"]}),"\n",(0,i.jsx)(e.h4,{id:"start-example",children:"\u793a\u4f8b\u4ee3\u7801"}),"\n",(0,i.jsx)(e.p,{children:"Phoenix\u4e8b\u52a1\u805a\u5408\u6839\u53ef\u4ee5\u5bf9\u5b9e\u4f53\u805a\u5408\u6839\u63d0\u4f9b\u7684TCC\u548cSAGA\u63a5\u53e3\u7075\u6d3b\u7ec4\u88c5\uff0c\u8be5\u793a\u4f8b\u4f7f\u7528\u7684\u662fTCC+SAGA\u6df7\u5408\u6a21\u5f0f\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:'    @TransactionStart\n    public TransactionReturn on(BuyGoodsCmd request) {\n        this.request = request;\n        double frozenAmt = request.getQty() * request.getPrice();\n        return TransactionReturn\n            .builder()\n            .addAction(\n                TccAction.builder().tryCmd(new AccountTryCmd(request.getAccountCode(), frozenAmt))\n                    .confirmCmd(new AccountConfirmCmd(request.getAccountCode(), frozenAmt))\n                    .cancelCmd(new AccountCancelCmd(request.getAccountCode(), frozenAmt)).targetTopic("")\n                    .subTransId(UUID.randomUUID().toString()).tryMaxRetryNum(2).confirmRetryNum(3).cancelRetryNum(3)\n                    .build())\n            .addAction(\n                SagaAction.builder().targetTopic("").tiCmd(new GoodsSellCmd(request.getGoodsCode(), request.getQty()))\n                    .ciCmd(new GoodsSellCompensateCmd(request.getGoodsCode(), request.getQty())).tiMaxRetryNum(2)\n                    .ciMaxRetryNum(2).subTransId(UUID.randomUUID().toString()).build()).build();\n    }\n'})}),"\n",(0,i.jsx)(e.h4,{id:"return",children:"TransactionReturn"}),"\n",(0,i.jsx)(e.p,{children:"\u4e8b\u52a1\u7684\u5165\u53e3\u65b9\u6cd5\u5728\u5904\u7406 Command \u547d\u4ee4\u4e4b\u540e\u9700\u8981\u8fd4\u56de\u5904\u7406\u7684\u7ed3\u679c\u4ee5\u53ca\u4e00\u4e9b\u5fc5\u8981\u7684\u4fe1\u606f\uff0cPhoenix\u5bf9\u4e8b\u52a1\u7684\u5165\u53e3\u65b9\u6cd5\u7684\u8fd4\u56de\u503c\u505a\u4e86\u4e00\u5c42\u5c01\u88c5\uff0c\u7edf\u4e00\u653e\u5230\u4e86TransactionReturn\u4e2d\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:"public class TransactionReturn {\n    private final List<TransactionAction> actions;\n    // setter getter ...\n}\n\n"})}),"\n",(0,i.jsx)(e.h4,{id:"action",children:"TransactionAction"}),"\n",(0,i.jsx)(e.p,{children:'TransactionAction\u7c7b\u5b9a\u4e49\u4e86\u76ee\u6807Topic\u3002\u5982\u679c\u5b9e\u4f53\u805a\u5408\u6839\u4e0e\u4e8b\u52a1\u805a\u5408\u6839\u5206\u5f00\u90e8\u7f72\uff0c\u90a3\u4e48Topic\u9700\u8981\u8bbe\u7f6e\u6210\u76ee\u6807\u5b9e\u4f53\u805a\u5408\u6839\u7684Topic\u3002\u5982\u679c\u5b9e\u4f53\u805a\u5408\u6839\u4e0e\u4e8b\u52a1\u805a\u5408\u6839\u96c6\u6210\u90e8\u7f72\uff0c\u90a3\u4e48Topic\u9700\u8981\u8bbe\u7f6e\u6210\u7a7a\u4e32("")'}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:"public abstract class TransactionAction {\n    protected String targetTopic;\n}\n\n"})}),"\n",(0,i.jsxs)(e.p,{children:["\u76ee\u524d\u652f\u6301TCC\u4e0eSAGA\u4e24\u79cd\u4e8b\u52a1\u6a21\u5f0f\uff0c\u8be6\u7ec6\u7684\u4e24\u79cd\u6a21\u5f0f\u7684\u8bf4\u660e\u8bf7\u53c2\u8003 ",(0,i.jsx)(e.a,{href:"/docs/phoenix-transaction/phoenix-transaction-module",children:"\u4e8b\u52a1\u6a21\u5f0f"})]}),"\n",(0,i.jsx)(e.p,{children:"TccAction\u4e2d\u7684tryCmd\u3001confirmCmd\u548ccancelCmd\u5747\u9700\u8981\u5b9a\u4e49\uff0c\u5426\u5219\u4e8b\u52a1\u6267\u884c\u8fc7\u7a0b\u4e2d\u4f1a\u51fa\u73b0\u4e8b\u52a1\u56de\u6eda/\u63d0\u4ea4\u5f02\u5e38\uff08\u65e0\u6cd5\u4fdd\u8bc1\u72b6\u6001\u4e00\u81f4\u6027\uff09\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:"public class TccAction extends TransactionAction {\n    // try      \u9ed8\u8ba4\u6700\u5927\u91cd\u8bd5\u6b21\u6570\n    public static final int TRY_MAX_RETRY_NUM_DEFAULT     = 5;\n    // confirm  \u9ed8\u8ba4\u6700\u5927\u91cd\u8bd5\u6b21\u6570\n    public static final int CONFIRM_MAX_RETRY_NUM_DEFAULT = 10;\n    // cancel   \u9ed8\u8ba4\u6700\u5927\u91cd\u8bd5\u6b21\u6570\n    public static final int CANCEL_MAX_RETRY_NUM_DEFAULT  = 10;\n    private final Object    tryCmd;\n    private final Object    confirmCmd;\n    private final Object    cancelCmd;\n    private final Integer   tryMaxRetryNum;\n    private final Integer   cancelMaxRetryNum;\n    private final Integer   confirmMaxRetryNum;\n    private final String    subTransId;\n    // getter setter ...\n}\n"})}),"\n",(0,i.jsx)(e.p,{children:"\u6b63\u5e38\u4e8b\u52a1\u6a21\u578b\u4e2dSagaAction\u4e2d\u7684tiCmd\u548cciCmd\u5747\u9700\u8981\u5b9a\u4e49\uff0c\u5426\u5219\u4e8b\u52a1\u6267\u884c\u8fc7\u7a0b\u4e2d\u4f1a\u51fa\u73b0\u4e8b\u52a1\u56de\u6eda\u5f02\u5e38\uff08\u65e0\u6cd5\u4fdd\u8bc1\u72b6\u6001\u4e00\u81f4\u6027\uff09\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:"public class SagaAction extends TransactionAction {\n    // ti \u9ed8\u8ba4\u6700\u5927\u91cd\u8bd5\u6b21\u6570\n    public static final int TI_MAX_RETRY_NUM_DEFAULT = 5;\n    // ci \u9ed8\u8ba4\u6700\u5927\u91cd\u8bd5\u6b21\u6570\n    public static final int CI_MAX_RETRY_NUM_DEFAULT = 10;\n    private final Object    tiCmd;\n    private final Object    ciCmd;\n    private final Integer   tiMaxRetryNum;\n    private final Integer   ciMaxRetryNum;\n    private final String    subTransId;\n    // getter setter ...\n}\n"})}),"\n",(0,i.jsxs)(e.p,{children:["\u9488\u5bf9\u4e00\u4e9b\u7279\u6b8a\u573a\u666f\uff0c\u6bd4\u5982\u53ea\u9700\u8981Saga\u53d1\u51fa\u4e00\u4e2aTiCmd\uff0c\u4e0d\u9700\u8981\u56de\u6eda\u7684\u573a\u666f\uff0c\u53ef\u4ee5\u8bbe\u7f6eSagaAction\u4e2d\u7684ciCmd\u4e3a",(0,i.jsx)(e.code,{children:"PhoenixServer.TransactionSagaMockCiCmd"}),"\uff0c\u53c2\u8003\u5b9e\u4f8b\u4ee3\u7801"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:"public TransactionReturn on(BuyGoodsCmd buyGoodsCmd) {\n    this.buyGoodsCmd = buyGoodsCmd;\n    return TransactionReturn.builder()\n            .addAction(\n                    SagaAction.builder()\n                            .tiCmd(new AccountQueryCmd(buyGoodsCmd.getAccountCode()))\n                            .ciCmd(SagaAction.genMockCiCmd())\n                            .build())\n            .build();\n}\n"})}),"\n",(0,i.jsx)(e.h2,{id:"event-handler",children:"\u4e8b\u4ef6\u5904\u7406"}),"\n",(0,i.jsx)(e.p,{children:"\u7ecf\u8fc7\u5b9e\u4f53\u805a\u5408\u6839\u5904\u7406\u540e\u4ea7\u751f\u7684Event\u4e8b\u4ef6\u4f1a\u53d1\u9001\u5230\u4e8b\u52a1\u805a\u5408\u6839\uff0c\u53ef\u4ee5\u6839\u636e\u9700\u8981\u5b9a\u4e49on\u65b9\u6cd5\u6765\u5904\u7406Event\u4e8b\u4ef6\u3002"}),"\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.strong,{children:"on()"})," \u65b9\u6cd5\u9700\u8981\u9075\u5faa\u5982\u4e0b\u89c4\u8303:"]}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsx)(e.li,{children:"on\u65b9\u6cd5\u4e2d\u4e0d\u80fd\u6709IO\u64cd\u4f5c\uff0c\u4f8b\u5982:\u8c03\u7528DB\u64cd\u4f5c\uff0c\u8c03\u7528\u5916\u90e8\u63a5\u53e3"}),"\n",(0,i.jsx)(e.li,{children:"on\u65b9\u6cd5\u4e2d\u4e0d\u80fd\u6709\u968f\u673a\u51fd\u6570\uff0c\u4f8b\u5982:\u83b7\u53d6\u7cfb\u7edf\u5f53\u524d\u65f6\u95f4\uff0c\u83b7\u53d6\u968f\u673a\u6570"}),"\n",(0,i.jsx)(e.li,{children:"on\u65b9\u6cd5\u53ef\u4ee5\u91cd\u8f7d\u5b9a\u4e49\uff0c\u5e76\u4e14\u81f3\u5c11\u6709\u4e00\u4e2a\u5165\u53c2\u3002"}),"\n"]}),"\n",(0,i.jsx)(e.h4,{id:"handler-example",children:"\u793a\u4f8b\u4ee3\u7801"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:'    public TransactionReturn on(AccountTryFailEvent event) {\n        log.info("\u5546\u54c1<{}> \u6210\u529f\u552e\u51fa", event.getGoodsCode());\n        return null;\n    }\n'})}),"\n",(0,i.jsx)(e.h2,{id:"finish",children:"\u4e8b\u52a1\u5b8c\u6210"}),"\n",(0,i.jsx)(e.p,{children:"\u4e8b\u52a1\u5b8c\u6210\u540e\uff0c\u4f1a\u8c03\u7528\u4e8b\u52a1\u805a\u5408\u6839\u7684onFinish\u65b9\u6cd5"}),"\n",(0,i.jsxs)(e.p,{children:[(0,i.jsx)(e.strong,{children:"onFinish()"})," \u65b9\u6cd5\u9700\u8981\u9075\u5faa\u5982\u4e0b\u89c4\u8303:"]}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsxs)(e.li,{children:["onFinish\u65b9\u6cd5\u662f\u552f\u4e00\u7684\uff0c\u4e0d\u53ef\u91cd\u8f7d\u5b9a\u4e49\uff0c\u5426\u5219\u4f60\u4f1a\u6536\u5230\u4e00\u4e2a",(0,i.jsx)(e.code,{children:"AggregateClassException"}),"\u5f02\u5e38"]}),"\n"]}),"\n",(0,i.jsx)(e.h4,{id:"finish-example",children:"\u793a\u4f8b\u4ee3\u7801"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:'public Object onFinish() {\n    return new BuyGoodsEvent("\u8d2d\u4e70\u5546\u54c1\u6210\u529f");\n}\n'})}),"\n",(0,i.jsx)(e.h2,{id:"full-example",children:"\u5b8c\u6574\u6848\u4f8b"}),"\n",(0,i.jsx)(e.p,{children:"\u8d2d\u4e70\u5546\u54c1\u662f\u5f88\u5e38\u89c1\u7684\u4e1a\u52a1\u573a\u666f\uff0c\u4e00\u822c\u6d89\u53ca\u8d2d\u4e70\u65b9\u8d26\u6237\u6263\u51cf\uff0c\u4ee5\u53ca\u5546\u5bb6\u5e93\u5b58\u6263\u51cf\uff0c\u548c\u8ba2\u5355\u751f\u6210\u3002\u8be5\u6848\u4f8b\u4e3a\u4e86\u7b80\u5316\u5b9e\u73b0\uff0c\u4e0d\u751f\u6210\u8ba2\u5355\u3002"}),"\n",(0,i.jsx)(e.p,{children:"\u6574\u4e2a\u4e1a\u52a1\u903b\u8f91\u75312\u4e2a\u805a\u5408\u6839(\u5fae\u670d\u52a1)\u6784\u6210:"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsx)(e.li,{children:"\u4ed3\u50a8\u670d\u52a1: \u5bf9\u7ed9\u5b9a\u7684\u5546\u54c1\u6263\u9664\u4ed3\u50a8\u6570\u91cf\u3002"}),"\n",(0,i.jsx)(e.li,{children:"\u8d26\u6237\u670d\u52a1: \u4ece\u7528\u6237\u8d26\u6237\u4e2d\u6263\u9664\u4f59\u989d\u3002"}),"\n"]}),"\n",(0,i.jsx)(e.p,{children:(0,i.jsx)(e.img,{alt:"show",src:t(11994).Z+"",width:"573",height:"288"})}),"\n",(0,i.jsxs)(e.blockquote,{children:["\n",(0,i.jsxs)(e.p,{children:["\u8be5\u6848\u4f8b\u4f7f\u7528\u7684\u662f",(0,i.jsx)(e.code,{children:"TCC+Saga"}),"\u6a21\u5f0f\u3002"]}),"\n",(0,i.jsxs)(e.p,{children:["\u66f4\u591a\u7684\u4e8b\u52a1\u6a21\u5f0f\u8bf7\u53c2\u89c1\uff1a",(0,i.jsx)(e.a,{href:"https://github.com/PhoenixIQ/phoenix-samples/tree/master/shopping",children:"PhoenixIQ/phoenix-samples/shopping"})]}),"\n"]}),"\n",(0,i.jsx)(e.h4,{id:"define",children:"command/event\u5b9a\u4e49"}),"\n",(0,i.jsxs)(e.p,{children:["Phoenix\u652f\u6301 ",(0,i.jsx)(e.code,{children:"protostuff"})," \u548c ",(0,i.jsx)(e.code,{children:"javaBean"})," \u534f\u8bae\u8fdb\u884c\u5e8f\u5217\u5316\uff0c\u53ef\u4ee5\u901a\u8fc7\u4ee5\u4e0b\u914d\u7f6e\u8fdb\u884c\u6307\u5b9a\uff0c\u8bbe\u5b9a\u503c\u5206\u522b\u4e3a:",(0,i.jsx)(e.code,{children:"proto_stuff"}),"\u548c",(0,i.jsx)(e.code,{children:"java"})]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-yaml",children:"quantex.phoenix.server.default-serializer: java\n"})}),"\n",(0,i.jsxs)(e.p,{children:["\u8fd9\u91cc\u4f7f\u7528",(0,i.jsx)(e.code,{children:"javaBean"}),"\u5e8f\u5217\u5316\u534f\u8bae\u8fdb\u884c\u793a\u8303\u3002"]}),"\n",(0,i.jsx)(e.p,{children:(0,i.jsx)(e.strong,{children:"\u4e8b\u52a1\u670d\u52a1\u76f8\u5173\u4e8b\u4ef6"})}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:"@Getter\n@AllArgsConstructor\npublic class BuyGoodsCmd implements Serializable {\n    private static final long serialVersionUID = -8667685124103764667L;\n    private String            accountCode;\n    private String            goodsCode;\n    private long              qty;\n    private double            price;\n}\n"})}),"\n",(0,i.jsx)(e.p,{children:(0,i.jsx)(e.strong,{children:"\u8d26\u6237\u670d\u52a1\u76f8\u5173\u4e8b\u4ef6"})}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:"@Getter\n@AllArgsConstructor\npublic class AccountTryCmd implements Serializable {\n    private static final long serialVersionUID = 4778468915465985552L;\n    private String accountCode;\n    private double frozenAmt;\n}\n\n@Getter\n@AllArgsConstructor\npublic class AccountConfirmCmd implements Serializable {\n    private static final long serialVersionUID = 6915539313674995272L;\n    private String accountCode;\n    private double frozenAmt;\n}\n\n@Getter\n@AllArgsConstructor\npublic class AccountCancelCmd implements Serializable {\n    private static final long serialVersionUID = 3086192070311956483L;\n    private String accountCode;\n    private double frozenAmt;\n}\n\n@Getter\n@Setter\n@AllArgsConstructor\npublic class AccountTryOkEvent implements Serializable {\n    private static final long serialVersionUID = 1525408241428571363L;\n    private String accountCode;\n    private double frozenAmt;\n}\n\n@Getter\n@Setter\n@AllArgsConstructor\npublic class AccountTryFailEvent implements Serializable {\n    private static final long serialVersionUID = -8352616962272592136L;\n    private String accountCode;\n    private double frozenAmt;\n    private String remark;\n}\n\n@Getter\n@Setter\n@AllArgsConstructor\npublic class AccountConfirmOkEvent implements Serializable {\n    private static final long serialVersionUID = -6789245872360028227L;\n    private String accountCode;\n    private double frozenAmt;\n}\n\n@Getter\n@Setter\n@AllArgsConstructor\npublic class AccountCancelOkEvent implements Serializable {\n    private static final long serialVersionUID = -1017410771260579937L;\n    private String accountCode;\n    private double frozenAmt;\n}\n\n"})}),"\n",(0,i.jsx)(e.p,{children:(0,i.jsx)(e.strong,{children:"\u4ed3\u50a8\u670d\u52a1\u76f8\u5173\u4e8b\u4ef6"})}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:"\n@Getter\n@AllArgsConstructor\npublic class GoodsSellCmd implements Serializable {\n    private static final long serialVersionUID = -4615713736312293797L;\n    private String goodsCode;\n    private long   qty;\n}\n\n@Getter\n@AllArgsConstructor\npublic class GoodsSellCompensateCmd implements Serializable {\n    private static final long serialVersionUID = -1797830080849363235L;\n    private String goodsCode;\n    private long   qty;\n}\n\n@Getter\n@Setter\n@AllArgsConstructor\npublic class GoodsSellOkEvent implements Serializable {\n    private static final long serialVersionUID = 873406977804359197L;\n    private String goodsCode;\n    private long   qty;\n}\n\n@Getter\n@Setter\n@AllArgsConstructor\npublic class GoodsSellFailEvent implements Serializable {\n    private static final long serialVersionUID = 4825942818190006297L;\n    private String goodsCode;\n    private long   qty;\n    private String remark;\n}\n\n@Getter\n@Setter\n@AllArgsConstructor\npublic class GoodsSellCompensateOkEvent implements Serializable {\n    private static final long serialVersionUID = 3256345453720913064L;\n    private String goodsCode;\n    private long   qty;\n}\n"})}),"\n",(0,i.jsx)(e.h4,{id:"define-aggregate",children:"\u5b9a\u4e49\u4e8b\u52a1\u805a\u5408\u6839"}),"\n",(0,i.jsxs)(e.p,{children:["\u4e8b\u52a1\u805a\u5408\u6839\u5728\u63a5\u6536\u5230\u8d2d\u4e70\u547d\u4ee4\u65f6\uff0c\u5206\u522b\u8fd4\u56de",(0,i.jsx)(e.code,{children:"\u8d26\u6237\u670d\u52a1TCC"}),"\u548c",(0,i.jsx)(e.code,{children:"\u4ed3\u50a8\u670d\u52a1Saga"}),"\u7684\u547d\u4ee4\u7ed9\u5230\u4e8b\u52a1\u72b6\u6001\u673a\uff0c\u4e8b\u52a1\u72b6\u6001\u673a\u4f1a\u53d1\u9001\u5e76\u534f\u8c03\u9a71\u52a8\u8fbe\u5230\u6700\u7ec8\u72b6\u6001\u3002"]}),"\n",(0,i.jsx)(e.p,{children:'\u4e8b\u52a1\u805a\u5408\u6839\u53ef\u4ee5\u72ec\u7acb\u8fd0\u884c\uff0c\u4e5f\u53ef\u4ee5\u548c\u5b9e\u4f53\u805a\u5408\u6839\u4e00\u8d77\u8fd0\u884c\u3002\u72ec\u7acb\u8fd0\u884c\u7684\u60c5\u51b5\u4e0b\uff0c\u8bbe\u7f6etargetTopic\u4e3a\u5b9e\u4f53\u805a\u5408\u6839\u7684Topic\uff0c\u8fd9\u91cc\u4e3a\u4e86\u65b9\u4fbf\u5c31\u8bbe\u7f6e\u4e3a\u7a7a\u4e32""\u4ee3\u8868\u548c\u5b9e\u4f53\u805a\u5408\u6839\u96c6\u6210\u8fd0\u884c\u3002'}),"\n",(0,i.jsxs)(e.p,{children:["\u4e8b\u52a1\u805a\u5408\u6839\u7684\u5177\u4f53\u5b9a\u4e49\u89c4\u5219\u8bf7\u53c2\u8003\u4e0a\u6587 ",(0,i.jsx)(e.a,{href:"#%E4%BA%8B%E5%8A%A1%E8%81%9A%E5%90%88%E6%A0%B9",children:"\u4e8b\u52a1\u805a\u5408\u6839\u5b9a\u4e49"})]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:'@TransactionAggregateAnnotation(aggregateRootType = "ShoppingAggregateSagaTcc")\npublic class ShoppingAggregateSagaTcc implements Serializable {\n    private static final long serialVersionUID = 7007603076743033374L;\n    private BuyGoodsCmd       request;\n    private String            remark           = "";\n\n    @TransactionStart\n    public TransactionReturn on(BuyGoodsCmd request) {\n        this.request = request;\n        double frozenAmt = request.getQty() * request.getPrice();\n        return TransactionReturn\n            .builder()\n            .addAction(\n                TccAction.builder().tryCmd(new AccountTryCmd(request.getAccountCode(), frozenAmt))\n                    .confirmCmd(new AccountConfirmCmd(request.getAccountCode(), frozenAmt))\n                    .cancelCmd(new AccountCancelCmd(request.getAccountCode(), frozenAmt)).targetTopic("")\n                    .subTransId(UUID.randomUUID().toString()).tryMaxRetryNum(2).confirmRetryNum(3).cancelRetryNum(3)\n                    .build())\n            .addAction(\n                SagaAction.builder().targetTopic("").tiCmd(new GoodsSellCmd(request.getGoodsCode(), request.getQty()))\n                    .ciCmd(new GoodsSellCompensateCmd(request.getGoodsCode(), request.getQty())).tiMaxRetryNum(2)\n                    .ciMaxRetryNum(2).subTransId(UUID.randomUUID().toString()).build()).build();\n    }\n\n    // ... on method\n}\n'})}),"\n",(0,i.jsx)(e.h4,{id:"define-entity-aggregate",children:"\u5b9a\u4e49\u5b9e\u4f53\u805a\u5408\u6839"}),"\n",(0,i.jsxs)(e.p,{children:["\u5b9e\u4f53\u805a\u5408\u6839\u4e2d\u5bf9 ",(0,i.jsx)(e.strong,{children:"Command"})," \u7684\u5904\u7406\u9700\u8981\u9075\u5faa SAGA \u6216 TCC \u89c4\u8303\uff0c\u5177\u4f53\u7684\u5b9a\u4e49\u89c4\u5219\u53ef\u4ee5\u53c2\u8003 ",(0,i.jsx)(e.a,{href:"/docs/phoenix-core/phoenix-core-entity-aggregate",children:"\u5b9e\u4f53\u805a\u5408\u6839\u5b9a\u4e49"})]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-java",children:'@EntityAggregateAnnotation(aggregateRootType = "AccountAggregate")\npublic class AccountAggregate implements Serializable {\n    private static final long serialVersionUID = 1989248847513267951L;\n    private double            amt;\n    private double            frozenAmt;\n    \n    @CommandHandler(aggregateRootId = "accountCode")\n    public ActReturn act(AccountTryCmd cmd) {\n        if (amt - frozenAmt > cmd.getFrozenAmt()) {\n            return ActReturn.builder().retCode(RetCode.SUCCESS)\n                .event(new AccountTryOkEvent(cmd.getAccountCode(), cmd.getFrozenAmt())).build();\n        } else {\n            String retMessage = String.format("\u8d44\u91d1\u53ef\u7528\u4e0d\u8db3\uff0c\u5269\u4f59:%f, \u5f53\u524d\u9700\u8981\u51bb\u7ed3:%f", amt - frozenAmt, cmd.getFrozenAmt());\n            return ActReturn.builder().retCode(RetCode.FAIL).retMessage(retMessage)\n                .event(new AccountTryFailEvent(cmd.getAccountCode(), cmd.getFrozenAmt(), retMessage)).build();\n        }\n    }\n\n    public void on(AccountTryOkEvent event) {\n        frozenAmt += event.getFrozenAmt();\n    }\n\n    public void on(AccountTryFailEvent event) { }\n\n    @CommandHandler(aggregateRootId = "accountCode")\n    public ActReturn act(AccountConfirmCmd cmd) {\n        return ActReturn.builder().retCode(RetCode.SUCCESS)\n            .event(new AccountConfirmOkEvent(cmd.getAccountCode(), cmd.getFrozenAmt())).build();\n    }\n\n    public void on(AccountConfirmOkEvent event) {\n        amt -= event.getFrozenAmt();\n        frozenAmt -= event.getFrozenAmt();\n    }\n\n    @CommandHandler(aggregateRootId = "accountCode")\n    public ActReturn act(AccountCancelCmd cmd) {\n        return ActReturn.builder().retCode(RetCode.SUCCESS)\n            .event(new AccountCancelOkEvent(cmd.getAccountCode(), cmd.getFrozenAmt())).build();\n    }\n\n    public void on(AccountCancelOkEvent event) {\n        frozenAmt -= event.getFrozenAmt();\n    }\n}\n\n@EntityAggregateAnnotation(aggregateRootType = "GoodsTcc")\npublic class GoodsAggregate implements Serializable {\n    private static final long serialVersionUID = -6111851668488622895L;\n    private long              qty;\n    private long              frozenQty;\n\n    @CommandHandler(aggregateRootId = "goodsCode")\n    public ActReturn act(GoodsSellCmd cmd) {\n        if (cmd.getQty() < 0) {\n            throw new RuntimeException("\u6570\u4e0d\u80fd\u5c0f\u4e8e0");\n        }\n        if (qty > cmd.getQty()) {\n            return ActReturn.builder().retCode(RetCode.SUCCESS)\n                .event(new GoodsSellOkEvent(cmd.getGoodsCode(), cmd.getQty())).build();\n        } else {\n            String ret = String.format("\u4f59\u989d\u4e0d\u8db3\uff0c\u5269\u4f59:%d, \u5f53\u524d\u9700\u8981:%d", qty, cmd.getQty());\n            return ActReturn.builder().retCode(RetCode.FAIL).retMessage(ret)\n                .event(new GoodsSellFailEvent(cmd.getGoodsCode(), cmd.getQty(), ret)).build();\n        }\n    }\n\n    public void on(GoodsSellOkEvent event) {\n        qty -= event.getQty();\n    }\n\n    public void on(GoodsSellFailEvent event) { }\n\n    @CommandHandler(aggregateRootId = "goodsCode")\n    public ActReturn act(GoodsSellCompensateCmd cmd) {\n        return ActReturn.builder().retCode(RetCode.SUCCESS)\n            .event(new GoodsSellCompensateOkEvent(cmd.getGoodsCode(), cmd.getQty())).build();\n    }\n\n    public void on(GoodsSellCompensateOkEvent event) {\n        qty += event.getQty();\n    }\n}\n'})}),"\n",(0,i.jsxs)(e.blockquote,{children:["\n",(0,i.jsxs)(e.p,{children:["\u5b8c\u6574\u7684\u6848\u4f8b\u8bf7\u53c2\u8003\uff1a",(0,i.jsx)(e.a,{href:"https://github.com/PhoenixIQ/phoenix-samples/tree/master/shopping",children:"PhoenixIQ/phoenix-samples/shopping"})]}),"\n"]})]})}function g(n={}){const{wrapper:e}={...(0,r.a)(),...n.components};return e?(0,i.jsx)(e,{...n,children:(0,i.jsx)(d,{...n})}):d(n)}},11994:(n,e,t)=>{t.d(e,{Z:()=>i});const i=t.p+"assets/images/shopping-1-6fe3819c92f7b8105bffdecfc97a1643.png"},11151:(n,e,t)=>{t.d(e,{Z:()=>c,a:()=>o});var i=t(67294);const r={},a=i.createContext(r);function o(n){const e=i.useContext(a);return i.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function c(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(r):n.components||r:o(n.components),i.createElement(a.Provider,{value:e},n.children)}}}]);