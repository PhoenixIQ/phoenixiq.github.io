"use strict";(self.webpackChunkphoenixiq_github_io=self.webpackChunkphoenixiq_github_io||[]).push([[90965],{17826:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>s,toc:()=>a});var c=t(85893),i=t(11151);const r={id:"phoenix-subscribe-pub",title:"\u8ba2\u9605\u4e0e\u5e7f\u64ad"},o=void 0,s={id:"phoenix-2.x/phoenix-core/phoenix-subscribe-pub",title:"\u8ba2\u9605\u4e0e\u5e7f\u64ad",description:"\u8ba2\u9605",source:"@site/versioned_docs/version-2.5.3/phoenix-2.x/02-phoenix-core/06-subscribe-pub.md",sourceDirName:"phoenix-2.x/02-phoenix-core",slug:"/phoenix-2.x/phoenix-core/phoenix-subscribe-pub",permalink:"/docs/2.5.3/phoenix-2.x/phoenix-core/phoenix-subscribe-pub",draft:!1,unlisted:!1,editUrl:"https://github.com/PhoenixIQ/versioned_docs/version-2.5.3/phoenix-2.x/02-phoenix-core/06-subscribe-pub.md",tags:[],version:"2.5.3",sidebarPosition:6,frontMatter:{id:"phoenix-subscribe-pub",title:"\u8ba2\u9605\u4e0e\u5e7f\u64ad"},sidebar:"docs",previous:{title:"\u5206\u5e03\u5f0f\u6570\u636e",permalink:"/docs/2.5.3/phoenix-2.x/phoenix-core/phoenix-distributed-data"},next:{title:"\u96c6\u7fa4\u7ba1\u7406",permalink:"/docs/2.5.3/phoenix-2.x/phoenix-core/phoenix-cluster-manager"}},l={},a=[{value:"\u8ba2\u9605",id:"\u8ba2\u9605",level:2},{value:"\u529f\u80fd\u4ecb\u7ecd",id:"\u529f\u80fd\u4ecb\u7ecd",level:3},{value:"Subscribe\u4f7f\u7528",id:"subscribe\u4f7f\u7528",level:3},{value:"SourceCollect\u4f7f\u7528",id:"sourcecollect\u4f7f\u7528",level:3},{value:"\u5e7f\u64ad",id:"\u5e7f\u64ad",level:2},{value:"\u529f\u80fd\u4ecb\u7ecd",id:"\u529f\u80fd\u4ecb\u7ecd-1",level:3},{value:"\u6ce8\u518cCollectMetaData",id:"\u6ce8\u518ccollectmetadata",level:3},{value:"\u4f7f\u7528CollectMetaData",id:"\u4f7f\u7528collectmetadata",level:3}];function d(e){const n={admonition:"admonition",code:"code",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,i.a)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n.h2,{id:"\u8ba2\u9605",children:"\u8ba2\u9605"}),"\n",(0,c.jsx)(n.h3,{id:"\u529f\u80fd\u4ecb\u7ecd",children:"\u529f\u80fd\u4ecb\u7ecd"}),"\n",(0,c.jsx)(n.p,{children:"\u5728\u6d41/\u6279\u8ba1\u7b97\u573a\u666f\uff0c\u4e0a\u6e38\u4e1a\u52a1\u7cfb\u7edf\u4f1a\u628a\u6570\u636e\u53d1\u9001\u81f3\u6d88\u606f\u961f\u5217\u3002\u4f46\u5e76\u4e0d\u662f\u6309\u805a\u5408\u6839\u7528\u6237\u5b9a\u4e49\u7684\u547d\u4ee4\u7684\u534f\u8bae\uff0c\u800c\u662f\u4e0a\u6e38\u7cfb\u7edf\u81ea\u5df1\u7684\u534f\u8bae\u3002\u8fd9\u65f6\u53ef\u4ee5\u4f7f\u7528Phoenix\u7684Subscribe\u529f\u80fd\uff0c\u6269\u5c55\u8ba2\u9605\u7684\u529f\u80fd\uff0c\u505a\u534f\u8bae\u8f6c\u6362\uff0c\u5206\u53d1\uff0c\u5e7f\u64ad\u7b49\u64cd\u4f5c\u3002"}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.img,{alt:"show",src:t(69339).Z+"",width:"1243",height:"719"})}),"\n",(0,c.jsxs)(n.p,{children:["\u5982\u4e0a\u56fe\u6240\u793a\uff0c",(0,c.jsx)(n.strong,{children:"Subscribe"}),"\u662f\u7528\u6237\u81ea\u5b9a\u58f0\u660e\u6ce8\u5165\u5230Phoenix\u6846\u67b6\u7684\uff08Phoenix\u76ee\u524d\u63d0\u4f9b\u9ed8\u8ba4\u7684KafkaSubscribe\uff09\uff0c\u5176\u529f\u80fd\u5982\u4e0b\uff1a"]}),"\n",(0,c.jsxs)(n.ol,{children:["\n",(0,c.jsx)(n.li,{children:"Subscribe\u53ef\u4ee5\u63a7\u5236Phoenix\u63a5\u6536\u6d88\u606f\u7684\u5e76\u53d1\u7c92\u5ea6\uff0c\u4ee5KafkaSubscribe\u4e3a\u4f8b\uff0c\u6bcf\u4e2aPartition\u5219\u4f1a\u751f\u6210\u4e00\u4e2aReceiverActor\u6765\u590d\u6742\u6d88\u606f\u62c9\u53d6\u3002"}),"\n",(0,c.jsx)(n.li,{children:"Subscribe\u63d0\u4f9bSourceCollect\u63a5\u53e3\uff0c\u5f53\u6846\u67b6\u62c9\u4e0b\u6570\u636e\u4e4b\u540e\uff0c\u4f1a\u8c03\u7528SourceCollect\u63a5\u53e3\u8fdb\u884c\u6570\u636e\u7684\u53cd\u5e8f\u5217\u5316\u4ee5\u53ca\u8f6c\u6362\u64cd\u4f5c(\u540e\u9762\u4f1a\u8bb2\u89e3\u8be5\u63a5\u53e3)\u3002"}),"\n"]}),"\n",(0,c.jsx)(n.p,{children:"\u6709\u4e86Subscribe\uff0c\u7528\u6237\u5373\u53ef\u7075\u6d3b\u7684\u8ba2\u9605\u5404\u79cdTopic\uff0c\u5e76\u4e14\u81ea\u5df1\u5b8c\u6210\u534f\u8bae\u7684\u8f6c\u6362(\u4e0a\u6e38\u534f\u8bae\u8f6c\u805a\u5408\u6839\u7684\u547d\u4ee4)\uff0c\u4ee5\u53ca\u5e7f\u64ad\u7b49\u64cd\u4f5c\u3002"}),"\n",(0,c.jsx)(n.h3,{id:"subscribe\u4f7f\u7528",children:"Subscribe\u4f7f\u7528"}),"\n",(0,c.jsxs)(n.p,{children:["\u7528\u6237\u4e0d\u9700\u8981\u81ea\u5df1\u7f16\u5199Subscribe\uff0c\u53ef\u4ee5\u76f4\u63a5\u4f7f\u7528Phoenix\u63d0\u4f9b\u7684",(0,c.jsx)(n.code,{children:"KafkaSubscribe"}),"(\u5c06\u6765\u4e5f\u4f1a\u652f\u6301\u66f4\u591a\u7684\u6d88\u606f\u961f\u5217)\uff0c\u4f7f\u7528\u65f6\u53ea\u9700\u8981\u6784\u9020\u8be5\u5bf9\u8c61\uff0c\u542f\u52a8\u65f6\u7ed9\u5230Phoenix\u5373\u3002\n\u5728phoenix-spring-boot-starter\u4e2d\uff0c\u53ef\u4ee5\u76f4\u63a5\u628a",(0,c.jsx)(n.code,{children:"KafkaSubscribe"}),"\u4e22\u7ed9Spring\u5bb9\u5668\u5373\u53ef\u3002"]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-java",children:'@Configuration\npublic class PhoenixSubscribeConfig {\n\n    @Bean("customSubscribe")\n    public Subscribe customSubscribe() {\n        Properties properties = new Properties();\n        properties.putIfAbsent(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");\n        return new KafkaSubscribe(\n                mqAddress, subscribeTopic, appName, properties, new SourceCollect());\n    }\n}\n'})}),"\n",(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.code,{children:"KafkaSubscribe"}),"\u53ef\u4ee5\u901a\u8fc7\u81ea\u5b9a\u4e49",(0,c.jsx)(n.code,{children:"Properties"}),"\u6765\u8bbe\u7f6eTopic\u6d88\u8d39\u7684\u989d\u5916\u914d\u7f6e\uff0cProperties\u662fMap\u7c7b\u578b\uff0cKey\u548cValue\u90fd\u662fString\u7c7b\u578b\uff0c\u5e76\u4e14Key\u662fConsumerConfig\u7c7b\u4e2d\u7684\u5e38\u91cf\u503c\uff0cValue\u5bf9\u5e94Kafka\u76f8\u5173\u914d\u7f6e\u3002"]}),"\n",(0,c.jsxs)(n.p,{children:["\u53ef\u4ee5\u6ce8\u610f\u5230\uff0c\u9664\u4e86Kafka\u57fa\u672c\u7684\u914d\u7f6e\u4e4b\u5916\uff0c\u7528\u6237\u8fd8\u9700\u8981\u63d0\u4f9b\u4e00\u4e2a",(0,c.jsx)(n.code,{children:"SourceCollect"}),"\u7684\u5b9e\u73b0\u3002"]}),"\n",(0,c.jsx)(n.admonition,{title:"\u63d0\u793a",type:"tip",children:(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.code,{children:"KafkaSubscribe"})," \u9ed8\u8ba4\u4f1a\u8ba2\u9605 ",(0,c.jsx)(n.code,{children:"Topic"})," \u4e0b\u7684\u6240\u6709 ",(0,c.jsx)(n.code,{children:"Partition"}),", \u4f46\u662f\u7528\u6237\u4e5f\u53ef\u4ee5\u901a\u8fc7\u4ee5\u4e0b\u65b9\u5f0f\u81ea\u5b9a\u4e49\u8ba2\u9605 ",(0,c.jsx)(n.code,{children:"Partition"})]})}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-java",children:'@Configuration\npublic class CustomPartitionSubscribeConfig {\n\n    @Bean("customPartitionSubscribe")\n    public Subscribe customPartitionSubscribe() {\n        Properties properties = new Properties();\n        properties.putIfAbsent(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");\n        return new KafkaPartitionSubscribe(\n            mqAddress, subscribeTopic, partitionNum, appName, properties, new SourceCollect());\n    }\n    \n    /**\n     * \u7ee7\u627f\u7684 KafkaSubscribe \u5b9e\u73b0\uff0c\u91cd\u5199 split()\n     */\n    class KafkaPartitionSubscribe extends KafkaSubscribe {\n\n        // topic\u4e0bpartition\u7684\u6570\u91cf\n        private int partitionNum;\n        // \u5206\u9694\u7b26\uff1b\u6ce8\u610f\u6709\u4e9b\u5b57\u7b26\u4e0d\u80fd\u5f53\u505a\u5206\u9694\u7b26\u4f7f\u7528\uff0c\u5982"|"\uff0chttp\u8bf7\u6c42\u65e0\u6cd5\u4eceurl\u4e2d\u89e3\u6790"|"\n        private static final String SEPARATOR = "_";\n\n        public KafkaPartitionSubscribe(String mqAddress, String topic, int partitionNum, String group,\n            Properties properties, SourceCollect sourceCollect) {\n            super(mqAddress, topic, group, properties, sourceCollect);\n            this.partitionNum = partitionNum;\n        }\n\n        @Override\n        public String getSplitRangeId(){\n            return super.getSplitRangeId().concat(SEPARATOR).concat(String.valueOf(partitionNum));\n        }   \n\n        @Override\n        public List<SplitId> split() {\n            // \u7236\u7c7b\u4e2d\u5219\u662f\u901a\u8fc7 KafkaProducer \u83b7\u53d6\u5168\u90e8 PartitionNum, \u7136\u540e\u751f\u6210\u540c\u6570\u91cf\u7684 SplitID\n            return Arrays.asList(new SplitId(getSplitRangeId(), partitionNum));\n        }\n    }\n}\n'})}),"\n",(0,c.jsx)(n.h3,{id:"sourcecollect\u4f7f\u7528",children:"SourceCollect\u4f7f\u7528"}),"\n",(0,c.jsxs)(n.p,{children:["SourceCollect\u662f\u6d88\u606f\u8f6c\u6362\u5668\uff0c\u5f53Phoenix\u4ece\u4e0a\u6e38\u62c9\u53d6\u5230\u6d88\u606f\u4e4b\u540e\uff0c\u4f1a\u8c03\u7528",(0,c.jsx)(n.strong,{children:"SourceCollect"}),"\u6765\u5b9e\u73b0\u6570\u636e\u53cd\u5e8f\u5217\u5316\u548c\u6570\u636e\u8f6c\u6362\u64cd\u4f5c\u3002"]}),"\n",(0,c.jsxs)(n.p,{children:["\u7528\u6237\u53ef\u4ee5\u81ea\u5b9a\u4e49\u5b9e\u73b0",(0,c.jsx)(n.strong,{children:"SourceCollect"}),"\u63a5\u53e3\u6765\u5b9e\u73b0\u4e0a\u6e38\u6570\u636e\u5230\u672c\u96c6\u7fa4\u547d\u4ee4\u7684\u8f6c\u6362\u3002\u5982\u4e0b\u6848\u4f8b\u6240\u793a\uff1a"]}),"\n",(0,c.jsxs)(n.ol,{children:["\n",(0,c.jsx)(n.li,{children:"\u6839\u636erecords.getKey()\u83b7\u53d6\u4e0a\u6e38\u653e\u5165\u7684className\u3002"}),"\n",(0,c.jsx)(n.li,{children:"\u5982\u679c\u5339\u914d\u4e8b\u4ef6\u4e00\u81f4\u5219\u8fdb\u884c\u53cd\u5e8f\u5217\u5316\uff08\u8fd9\u91cc\u6a21\u62df\u4e86\u4e8b\u4ef6\u662fJSON\u5e8f\u5217\u5316\u7684\uff0c\u5b9e\u9645\u5e94\u7528\u5f53\u4e2d\u5e94\u6839\u636e\u4e0a\u6e38\u53d1\u9001\u7684\u534f\u8bae\u8fdb\u884c\u53cd\u5e8f\u5217\u5316\uff09"}),"\n",(0,c.jsx)(n.li,{children:"\u6839\u636e\u4e0a\u6e38\u4e8b\u4ef6\u5185\u5bb9\u6784\u9020\u672c\u4e1a\u52a1\u7cfb\u7edf\u805a\u5408\u6839\u53ef\u4ee5\u5904\u7406\u7684\u547d\u4ee4\u5e76\u8fd4\u56de\u3002"}),"\n"]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-java",children:"public class SelfSourceCollect implements SourceCollect {\n\n    @Override\n    public List<CollectResult> collect(Records records, CollectMetaData collectMetaData) {\n        List<CollectResult> collectResults = new ArrayList<>();\n        if (UpperAccountAllocateEvent.class.getName().equals(records.getKey())) {\n            // \u53cd\u5e8f\u5217\u5316\u4e0a\u6e38\u4e8b\u4ef6\n            UpperAccountAllocateEvent upperAccountAllocateEvent = JsonUtil.decode(new String(records.getValue()), records.getKey());\n            // \u6839\u636e\u4e0a\u6e38\u4e8b\u4ef6\u8981\u7d20\u6784\u9020\u51fa\u805a\u5408\u6839\u7684cmd\n            Account.AccountAllocateCmd accountAllocateCmd =\n                    Account.AccountAllocateCmd.newBuilder()\n                            .setAccountCode(upperAccountAllocateEvent.getaccountCode())\n                            .setAmt(upperAccountAllocateEvent.getAmt())\n                            .setAllocateNumber(UUIDUtils.genUUID())\n                            .build();\n            collectResults.add(new CollectResult(accountAllocateCmd, true));\n        }\n        return collectResults;\n    }\n}\n"})}),"\n",(0,c.jsx)(n.p,{children:"\u53ef\u4ee5\u770b\u5230\uff0cCollect\u7684\u8fd4\u56de\u4f53\u662fList\uff0c\u5982\u679c\u4e0a\u6e38\u4e8b\u4ef6\u5185\u8981\u7d20\u53ef\u4ee5\u505a\u5230\u6784\u9020\u51fa\u591a\u4e2a\u4e0d\u540c\u805a\u5408\u6839\u7684\u547d\u4ee4(\u805a\u5408\u6839id)\u4e0d\u540c\uff0c\u5219\u53ef\u4ee5\u8fd4\u56de\u591a\u4e2a\u547d\u4ee4\uff0c\u6765\u8ba9\u591a\u4e2a\u805a\u5408\u6839\u5b9e\u4f8b\u5904\u7406\u3002"}),"\n",(0,c.jsx)(n.h2,{id:"\u5e7f\u64ad",children:"\u5e7f\u64ad"}),"\n",(0,c.jsx)(n.h3,{id:"\u529f\u80fd\u4ecb\u7ecd-1",children:"\u529f\u80fd\u4ecb\u7ecd"}),"\n",(0,c.jsxs)(n.p,{children:["\u901a\u8fc7\u4e0a\u9762\u8ba2\u9605\u6a21\u578b\u7684\u4ecb\u7ecd\uff0c\u6211\u4eec\u77e5\u9053",(0,c.jsx)(n.code,{children:"SourceCollect"}),"\u5728\u8f6c\u6362\u4e00\u4e2a\u4e0a\u6e38\u4e8b\u4ef6\u65f6\u53ef\u4ee5\u8fd4\u56de\u591a\u4e2a\u547d\u4ee4\u6765\u8ba9\u591a\u4e2a\u805a\u5408\u6839\u5904\u7406\uff0c\u524d\u63d0\u662f\u9700\u8981\u80fd\u5728\u4e0a\u6e38\u4e8b\u4ef6\u4e2d\u63d0\u53d6\u51fa\u80fd\u7b26\u5408\u53d1\u7ed9\u591a\u4e2a\u805a\u5408\u6839\u5bf9\u8c61\u7684\u5c5e\u6027\u3002"]}),"\n",(0,c.jsx)(n.p,{children:"\u6709\u65f6\u4e0a\u6e38\u4e8b\u4ef6\u65e0\u6cd5\u5b8c\u6574\u7684\u6784\u9020\u51fa\u672c\u4e1a\u52a1\u7684\u805a\u5408\u6839\u53ef\u4ee5\u5904\u7406\u547d\u4ee4(\u4e0a\u6e38\u4e8b\u4ef6\u5f53\u4e2d\u6ca1\u6709\u6784\u9020\u805a\u5408\u6839id\u6240\u9700\u8981\u7684\u8981\u7d20)\uff0c\u4f46\u5374\u6709\u76f8\u5173\u8981\u7d20\u3002\u6bd4\u5982\uff0c\u4e00\u4e2a\u57fa\u91d1\u4ea7\u54c1\u805a\u5408\u6839\u6709\u7528\u5f88\u591a\u80a1\u7968\u6301\u4ed3\uff0c\u5f53\u67d0\u53ea\u80a1\u7968\u4ef7\u683c\u53d8\u5316\uff08\u4e0a\u6e38\u4e8b\u4ef6\uff09\uff0c\u5e0c\u671b\u89e6\u53d1\u6240\u6709\u6709\u8fd9\u53ea\u80a1\u7968\u7684\u4ea7\u54c1\u805a\u5408\u6839\u91cd\u65b0\u8ba1\u7b97\u8d44\u4ea7\u3002"}),"\n",(0,c.jsxs)(n.p,{children:["\u6211\u4eec\u53ef\u4ee5\u5728\u4ea7\u54c1\u805a\u5408\u6839\u5904\u7406\u6301\u4ed3\uff08\u65b0\u589e\u548c\u5220\u9664\u6301\u4ed3\uff09\u65f6\uff0c\u5411ReceiverActor\u6ce8\u518c\u4e00\u4e2a\u5143\u6570\u636e\uff08\u4ea7\u54c1001 -> \u80a1\u7968001\uff09\u3002\u5728ReceiverActor\u62c9\u53d6\u5230\u80a1\u7968\u7684\u53d8\u66f4\u4e8b\u4ef6\u540e\uff0c\u4fbf\u4f1a\u5728\u8c03\u7528",(0,c.jsx)(n.code,{children:"SourceCollect#collect"}),"\u628a\u8be5\u5143\u6570\u636e\u4f20\u9012\u7ed9\u7528\u6237\u5b9a\u4e49\u7684\u5b9e\u73b0\u7c7b\uff0c\n\u8fd9\u6837\u7528\u6237\u5c31\u53ef\u4ee5\u65b9\u4fbf\u7684\u62ff\u5230\u54ea\u4e9b\u4ea7\u54c1\u62e5\u6709\u8be5\u53ea\u80a1\u7968\uff0c\u8fdb\u800c\u6784\u9020\u51fa\u884c\u60c5\u53d8\u66f4\u547d\u4ee4\uff0c\u89e6\u53d1\u91cd\u65b0\u8ba1\u7b97\u51c0\u8d44\u4ea7\u3002"]}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.img,{alt:"show",src:t(38956).Z+"",width:"1128",height:"787"})}),"\n",(0,c.jsx)(n.p,{children:"\u5982\u4e0a\u56fe\u6240\u793a\uff0cPhoenix\u53ef\u4ee5\u4fdd\u8bc1\u8be5\u5143\u6570\u636e(CollectMetaData)\u53ef\u4ee5\u6700\u7ec8\u4e00\u81f4\u7684\u53ef\u9760\u5b58\u50a8\u4e0b\u6765\uff0cPhoenix\u63d0\u4f9b\u65b9\u4fbf\u7684\u6ce8\u518c\u5143\u6570\u636e\u4ee5\u53ca\u53d6\u6d88\u6ce8\u518c\u5143\u6570\u636e\u7684\u529f\u80fd\u3002"}),"\n",(0,c.jsx)(n.h3,{id:"\u6ce8\u518ccollectmetadata",children:"\u6ce8\u518cCollectMetaData"}),"\n",(0,c.jsxs)(n.p,{children:["\u5728\u5b9e\u4f53\u805a\u5408\u6839\u7684Command\u5904\u7406\u65b9\u6cd5\u4e2d\uff0c\u7528\u6237\u53ef\u4ee5\u81ea\u5b9a\u4e49\u6ce8\u518cCollectData\u5230",(0,c.jsx)(n.strong,{children:"Topic\u7684\u5904\u7406\u7aef(SourceCollect)"}),"\u3002"]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-java",children:'    @CommandHandler(aggregateRootId = "fundCode", isCommandSourcing = true)\n    public ActReturn act(PositionChangeCmd positionChangeCmd) {\n    \n        // \u5904\u7406\u6301\u4ed3\u53d8\u66f4\u7684\u4e1a\u52a1\u903b\u8f91\n        // dosomething...\n\n        RegistryCollectData registryCollectData = null;\n        // \u65b0\u589e\u6301\u4ed3\u65f6\u6ce8\u518c\u5143\u6570\u636e\n        if(positionChangeCmd.type == ADD) {\n            registryCollectData = new RegistryCollectData(RegistryCollectData.Type.REGISTRY,\n                                  KafkaSubscribe.genSplitRangeId(mqAddress, subscribeTopic),\n                                  Arrays.asList(positionChangeCmd.getSecuCode())\n                                  fundCode);\n        }\n        \n        // \u5220\u9664\u6301\u4ed3\u65f6\u5220\u9664\u5143\u6570\u636e\n        // .. \u6784\u9020 RegistryCollectData.Type = UN_REGISTRY\n        \n        // \u8fd4\u56de\n        retrun ActReturn.builder()\n               .registryCollectData(registryCollectData)\n               .\u5176\u4ed6\u8981\u7d20\n        .build();\n    }\n'})}),"\n",(0,c.jsx)(n.admonition,{type:"caution",children:(0,c.jsxs)(n.p,{children:["\u6ce8\u610f\uff1a\u5728\u7528\u6237\u914d\u7f6e\u4e86\u805a\u5408\u6839\u7684",(0,c.jsx)(n.strong,{children:"\u5b58\u6d3b\u65f6\u95f4"}),"\u540e\uff0c\u5f53\u5b9e\u4f53\u805a\u5408\u6839\u4ece\u5185\u5b58\u4e2d\u6dd8\u6c70\u540e\uff0c\u6846\u67b6\u4f1a\u81ea\u52a8\u53d6\u6d88\u8be5\u805a\u5408\u6839\u6240\u6709\u7684\u6ce8\u518c\u6570\u636e\uff0c\u5e76\u4e14\u5728\u805a\u5408\u6839\u6062\u590d\u540e\uff0c\u4e5f\u4e0d\u4f1a\u81ea\u52a8\u6062\u590d\u6ce8\u518c\u3002"]})}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-java",children:'@EntityAggregateAnnotation(\n        aggregateRootType = "BankAccountAggregateBroadCast",\n        surviveTime = 1000 * 60 * 10) // 10\u5206\u949f\u540e\u6dd8\u6c70\u805a\u5408\u6839\uff0c\u81ea\u52a8\u53d6\u6d88\u6240\u6709\u6ce8\u518c\n'})}),"\n",(0,c.jsxs)(n.admonition,{type:"info",children:[(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.strong,{children:"ActReturn.registryCollectData()"})," \u65b9\u6cd5\u652f\u6301\u6ce8\u518c\u591a\u4e2a ",(0,c.jsx)(n.code,{children:"RegistryCollectData"}),"."]}),(0,c.jsx)(n.p,{children:"\u4ec5\u5f53\u7528\u6237\u9700\u8981\u6807\u8bb0\u591a\u4e2a Tag. \u5e76\u4e14\u4e0d\u5c5e\u4e8e\u540c\u4e00\u4e2a MQ/Topic \u65f6\u4f7f\u7528."}),(0,c.jsxs)(n.p,{children:["\u5426\u5219\u540e\u8005\u5c06\u4f1a\u8986\u76d6\u524d\u8005. \u5bf9\u4e8e\u540c MQ \u573a\u666f\u4e0b\u7684\u591a TAG \u53ef\u4ee5\u57fa\u4e8e ",(0,c.jsx)(n.code,{children:"RegistryCollectData"})," \u6784\u9020\u51fd\u6570\u7684\u7b2c\u4e09\u4e2a\u53c2\u6570\u6307\u5b9a."]})]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-java",children:'// \u56e0\u4e3a MQ \u5730\u5740\u548c Topic \u76f8\u540c. \u6240\u4ee5 overSeasTag \u4f1a\u88ab\u8986\u76d6.\nRegistryCollectData overSeasTag = null;\nif (createCmd.getAccountCode().contains("OS")) {\n    overSeasTag =new RegistryCollectData(\n                    RegistryCollectData.Type.REGISTRY,\n                    KafkaSubscribe.genSplitRangeId(mqAddress, subscribeTopic),\n                    Arrays.asList("Overseas"),\n                    createCmd.getAccountCode());\n}\nRegistryCollectData registryCollectData = null;\nif (balanceAmt == 10.0) {\n    registryCollectData =new RegistryCollectData(\n                    RegistryCollectData.Type.REGISTRY,\n                    KafkaSubscribe.genSplitRangeId(mqAddress, subscribeTopic),\n                    Arrays.asList("amtEQ10","secondTag"), // \u540c MQ \u4e0b\u5728\u6b64\u5b9a\u4e49\u591a\u4e2a Tags\n                    createCmd.getAccountCode());\n}\nreturn ActReturn.builder()\n    .retCode(RetCode.SUCCESS)\n    .retMessage(message)\n    .event(new AccountCreateEvent(createCmd.getAccountCode(), createCmd.getBalanceAmt()))\n    .registryCollectData(overSeasTag) // \u8be5 tag \u4f1a\u88ab\u8986\u76d6\n    .registryCollectData(registryCollectData)\n    .build();\n'})}),"\n",(0,c.jsx)(n.h3,{id:"\u4f7f\u7528collectmetadata",children:"\u4f7f\u7528CollectMetaData"}),"\n",(0,c.jsx)(n.p,{children:"\u4e0a\u9762\u4ea7\u54c1\u805a\u5408\u6839\u5411ReceiverActor\u6ce8\u518c\u4e86\u5143\u6570\u636e(CollectMetaData)\uff0c\u8fd9\u6837\u7528\u6237\u5728\u7f16\u5199SourceCollect\u65f6\u5219\u53ef\u4ee5\u83b7\u53d6\u5143\u6570\u636e\uff0c\u8f6c\u5316\u547d\u4ee4\u3002"}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-java",children:"\npublic class MarketEventCollect implements SourceCollect {\n    @Override\n    public List<CollectResult> collect(Records records, CollectMetaData collectMetaData) {\n\n        List<CollectResult> collectResults = new ArrayList<>();\n        try {\n            // \u53cd\u5e8f\u5217\u5316\u80a1\u7968\u884c\u60c5\u53d8\u66f4\u4e8b\u4ef6\n            MarketEvent marketEvent = JSON.enCode(records.getKey, records.getValue());\n            // \u83b7\u53d6\u6ce8\u518c\u7684\u5143\u6570\u636e: \u54ea\u4e9b\u4ea7\u54c1\u805a\u5408\u6839\u62e5\u6709\u8be5\u53ea\u80a1\u7968\u6301\u4ed3\n            Set<String> metaDataValue = collectMetaData.getMetaDataValue(marketEvent.getSecucode());\n            for (String fundCode : metaDataValue) {\n                // \u6784\u9020\u4ea7\u54c1\u805a\u5408\u6839\u7684\u884c\u60c5\u53d8\u66f4\u547d\u4ee4\n                MarketChangeCmd marketChangeCmd = new MarketChangeCmd(fundCode, marketEvent);\n                collectResults.add(new CollectResult(marketChangeCmd, true));\n            }\n        } catch (InvalidProtocolBufferException e) {\n            e.printStackTrace();\n        }\n        return collectResults;\n    }\n}\n\n"})}),"\n",(0,c.jsx)(n.p,{children:"\u53ef\u4ee5\u770b\u5230\uff0c\u901a\u8fc7\u5b9e\u4f53\u805a\u5408\u6839\u6ce8\u518c\u5143\u6570\u636e\uff0c\u548cSourceCollect\u8f6c\u6362\u65f6\u83b7\u53d6\u8be5\u7b14\u5143\u6570\u636e\u8f6c\u6362\uff0c\u8fdb\u800c\u5b8c\u6210\u4e86\u884c\u60c5\u9a71\u52a8\u8d44\u4ea7\u53d8\u66f4\u7684\u6a21\u578b\u3002\u5b9e\u9645\u4e0a\uff0c\u7528\u6237\u53ef\u4ee5\u6839\u636e\u4e1a\u52a1\u9700\u6c42\uff0c\u7075\u6d3b\u7684\u7ed9\u81ea\u5df1\u7684\u4ea7\u54c1\u805a\u5408\u6839\u6253\u6807\u7b7e\uff0c\u6765\u5b8c\u6210\u66f4\u590d\u6742\u7cbe\u786e\u7684\u6d88\u606f\u8f6c\u6362\u4efb\u52a1\u3002"})]})}function u(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(d,{...e})}):d(e)}},69339:(e,n,t)=>{t.d(n,{Z:()=>c});const c=t.p+"assets/images/subscribe-pub-08aea0dce9799cde7604b1d541c3d47c.png"},38956:(e,n,t)=>{t.d(n,{Z:()=>c});const c=t.p+"assets/images/subscribe-pub2-4261a52edeee41073a67b6965a02be63.png"},11151:(e,n,t)=>{t.d(n,{Z:()=>s,a:()=>o});var c=t(67294);const i={},r=c.createContext(i);function o(e){const n=c.useContext(r);return c.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),c.createElement(r.Provider,{value:n},e.children)}}}]);