```json
{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": "-- Grafana --",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "type": "console"
      }
    ]
  },
  "editable": true,
  "gnetId": null,
  "graphTooltip": 0,
  "id": 7,
  "iteration": 1632818619700,
  "links": [],
  "panels": [
    {
      "datasource": "elastic",
      "description": "",
      "fieldConfig": {
        "defaults": {
          "custom": {
            "align": null
          },
          "mappings": [],
          "thresholds": {
            "mode": "percentage",
            "steps": [
              {
                "color": "green",
                "value": null
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 7,
        "w": 3,
        "x": 0,
        "y": 0
      },
      "id": 10,
      "options": {
        "colorMode": "value",
        "graphMode": "area",
        "justifyMode": "center",
        "orientation": "auto",
        "reduceOptions": {
          "calcs": [
            "sum"
          ],
          "fields": "",
          "values": false
        },
        "textMode": "auto"
      },
      "pluginVersion": "7.1.1",
      "targets": [
        {
          "alias": "total",
          "bucketAggs": [
            {
              "field": "timestamp",
              "id": "2",
              "settings": {
                "interval": "auto",
                "min_doc_count": 0,
                "trimEdges": 0
              },
              "type": "date_histogram"
            }
          ],
          "metrics": [
            {
              "field": "select field",
              "id": "1",
              "type": "count"
            }
          ],
          "query": "projectId.keyword: $projectId",
          "refId": "C",
          "timeField": "timestamp"
        }
      ],
      "timeFrom": null,
      "timeShift": null,
      "title": "消息总数",
      "type": "stat"
    },
    {
      "datasource": "elastic",
      "description": "",
      "fieldConfig": {
        "defaults": {
          "custom": {
            "align": null
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 1
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 7,
        "w": 3,
        "x": 3,
        "y": 0
      },
      "id": 15,
      "options": {
        "colorMode": "value",
        "graphMode": "area",
        "justifyMode": "center",
        "orientation": "auto",
        "reduceOptions": {
          "calcs": [
            "sum"
          ],
          "fields": "",
          "values": false
        },
        "textMode": "auto"
      },
      "pluginVersion": "7.1.1",
      "targets": [
        {
          "alias": "ExceptionEvent",
          "bucketAggs": [
            {
              "field": "timestamp",
              "id": "2",
              "settings": {
                "interval": "auto",
                "min_doc_count": 0,
                "trimEdges": 0
              },
              "type": "date_histogram"
            }
          ],
          "metrics": [
            {
              "field": "select field",
              "id": "1",
              "type": "count"
            }
          ],
          "query": "payloadClassName.keyword: com.iquantex.phoenix.core.message.protobuf.Phoenix$ExceptionEvent && projectId.keyword: $projectId",
          "refId": "A",
          "timeField": "timestamp"
        }
      ],
      "timeFrom": null,
      "timeShift": null,
      "title": "异常总数",
      "type": "stat"
    },
    {
      "columns": [],
      "datasource": "elastic",
      "fieldConfig": {
        "defaults": {
          "custom": {
            "align": null
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          }
        },
        "overrides": []
      },
      "fontSize": "100%",
      "gridPos": {
        "h": 7,
        "w": 4,
        "x": 6,
        "y": 0
      },
      "id": 12,
      "options": {
        "showHeader": true
      },
      "pageSize": null,
      "pluginVersion": "7.0.3",
      "showHeader": true,
      "sort": {
        "col": 0,
        "desc": true
      },
      "styles": [
        {
          "alias": "Time",
          "align": "auto",
          "dateFormat": "YYYY-MM-DD HH:mm:ss",
          "pattern": "Time",
          "type": "date"
        },
        {
          "alias": "",
          "align": "auto",
          "colorMode": null,
          "colors": [
            "rgba(245, 54, 54, 0.9)",
            "rgba(237, 129, 40, 0.89)",
            "rgba(50, 172, 45, 0.97)"
          ],
          "dateFormat": "YYYY-MM-DD HH:mm:ss",
          "decimals": 2,
          "mappingType": 1,
          "pattern": "",
          "thresholds": [],
          "type": "number",
          "unit": "short"
        },
        {
          "alias": "",
          "align": "left",
          "colorMode": null,
          "colors": [
            "rgba(245, 54, 54, 0.9)",
            "rgba(237, 129, 40, 0.89)",
            "rgba(50, 172, 45, 0.97)"
          ],
          "decimals": 2,
          "pattern": "/.*/",
          "thresholds": [],
          "type": "string",
          "unit": "short"
        }
      ],
      "targets": [
        {
          "bucketAggs": [
            {
              "field": "aggregateRootType.keyword",
              "id": "2",
              "settings": {
                "min_doc_count": 1,
                "order": "desc",
                "orderBy": "_count",
                "size": "0"
              },
              "type": "terms"
            }
          ],
          "metrics": [
            {
              "field": "select field",
              "id": "1",
              "type": "count"
            }
          ],
          "query": "projectId.keyword: $projectId",
          "refId": "A",
          "timeField": "timestamp"
        }
      ],
      "timeFrom": null,
      "timeShift": null,
      "title": "聚合分布",
      "transform": "table",
      "type": "table-old"
    },
    {
      "columns": [],
      "datasource": "elastic",
      "description": "",
      "fieldConfig": {
        "defaults": {
          "custom": {
            "align": null
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          }
        },
        "overrides": [
          {
            "matcher": {
              "id": "byName",
              "options": "payloadClassName.keyword"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 300
              }
            ]
          }
        ]
      },
      "fontSize": "100%",
      "gridPos": {
        "h": 7,
        "w": 9,
        "x": 10,
        "y": 0
      },
      "id": 14,
      "options": {
        "showHeader": true,
        "sortBy": []
      },
      "pageSize": null,
      "pluginVersion": "7.0.3",
      "showHeader": true,
      "sort": {
        "col": null,
        "desc": false
      },
      "styles": [
        {
          "alias": "Time",
          "align": "auto",
          "dateFormat": "YYYY-MM-DD HH:mm:ss",
          "pattern": "Time",
          "type": "date"
        },
        {
          "alias": "",
          "align": "auto",
          "colorMode": null,
          "colors": [
            "rgba(245, 54, 54, 0.9)",
            "rgba(237, 129, 40, 0.89)",
            "rgba(50, 172, 45, 0.97)"
          ],
          "dateFormat": "YYYY-MM-DD HH:mm:ss",
          "decimals": 2,
          "mappingType": 1,
          "pattern": "",
          "thresholds": [],
          "type": "number",
          "unit": "short"
        },
        {
          "alias": "",
          "align": "left",
          "colorMode": null,
          "colors": [
            "rgba(245, 54, 54, 0.9)",
            "rgba(237, 129, 40, 0.89)",
            "rgba(50, 172, 45, 0.97)"
          ],
          "decimals": 2,
          "pattern": "/.*/",
          "sanitize": false,
          "thresholds": [],
          "type": "string",
          "unit": "short"
        }
      ],
      "targets": [
        {
          "alias": "message name",
          "bucketAggs": [
            {
              "field": "payloadClassName.keyword",
              "id": "2",
              "settings": {
                "min_doc_count": 1,
                "order": "desc",
                "orderBy": "_count",
                "size": "0"
              },
              "type": "terms"
            }
          ],
          "metrics": [
            {
              "field": "select field",
              "id": "1",
              "type": "count"
            }
          ],
          "query": "projectId.keyword: $projectId",
          "refId": "A",
          "timeField": "timestamp"
        }
      ],
      "timeFrom": null,
      "timeShift": null,
      "title": "消息分布",
      "transform": "table",
      "type": "table-old"
    },
    {
      "columns": [],
      "datasource": "elastic",
      "fieldConfig": {
        "defaults": {
          "custom": {
            "align": null
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          }
        },
        "overrides": []
      },
      "fontSize": "100%",
      "gridPos": {
        "h": 7,
        "w": 5,
        "x": 19,
        "y": 0
      },
      "id": 17,
      "options": {
        "showHeader": true
      },
      "pageSize": null,
      "pluginVersion": "7.0.3",
      "showHeader": true,
      "sort": {
        "col": 0,
        "desc": true
      },
      "styles": [
        {
          "alias": "Time",
          "align": "left",
          "dateFormat": "YYYY-MM-DD HH:mm:ss",
          "pattern": "Time",
          "type": "date"
        },
        {
          "alias": "",
          "align": "left",
          "colorMode": null,
          "colors": [
            "rgba(245, 54, 54, 0.9)",
            "rgba(237, 129, 40, 0.89)",
            "rgba(50, 172, 45, 0.97)"
          ],
          "dateFormat": "YYYY-MM-DD HH:mm:ss",
          "decimals": 2,
          "mappingType": 1,
          "pattern": "Count",
          "thresholds": [],
          "type": "string",
          "unit": "short"
        },
        {
          "alias": "",
          "align": "left",
          "colorMode": null,
          "colors": [
            "rgba(245, 54, 54, 0.9)",
            "rgba(237, 129, 40, 0.89)",
            "rgba(50, 172, 45, 0.97)"
          ],
          "dateFormat": "YYYY-MM-DD HH:mm:ss",
          "decimals": 2,
          "mappingType": 1,
          "pattern": "allMetaData.sourceIP.keyword",
          "thresholds": [],
          "type": "string",
          "unit": "short"
        }
      ],
      "targets": [
        {
          "alias": "node list",
          "bucketAggs": [
            {
              "field": "allMetaData.sourceIP.keyword",
              "id": "2",
              "settings": {
                "min_doc_count": 1,
                "order": "desc",
                "orderBy": "_count",
                "size": "10"
              },
              "type": "terms"
            }
          ],
          "metrics": [
            {
              "field": "select metric",
              "id": "1",
              "meta": {},
              "pipelineAgg": "select metric",
              "settings": {},
              "type": "count"
            }
          ],
          "query": "projectId.keyword: $projectId",
          "refId": "A",
          "timeField": "timestamp"
        }
      ],
      "timeFrom": null,
      "timeShift": null,
      "title": "节点列表",
      "transform": "table",
      "type": "table-old"
    },
    {
      "aliasColors": {},
      "bars": true,
      "dashLength": 10,
      "dashes": false,
      "datasource": "elastic",
      "fieldConfig": {
        "defaults": {
          "custom": {}
        },
        "overrides": []
      },
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 9,
        "w": 24,
        "x": 0,
        "y": 7
      },
      "hiddenSeries": false,
      "id": 6,
      "legend": {
        "avg": false,
        "current": false,
        "max": false,
        "min": false,
        "show": true,
        "total": false,
        "values": false
      },
      "lines": true,
      "linewidth": 1,
      "nullPointMode": "null",
      "options": {
        "dataLinks": []
      },
      "percentage": false,
      "pluginVersion": "7.1.1",
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "alias": "message",
          "bucketAggs": [
            {
              "field": "timestamp",
              "id": "2",
              "settings": {
                "interval": "auto",
                "min_doc_count": "0",
                "offset": "",
                "trimEdges": 0
              },
              "type": "date_histogram"
            }
          ],
          "metrics": [
            {
              "field": "select field",
              "id": "1",
              "type": "count"
            }
          ],
          "query": "projectId.keyword: $projectId",
          "refId": "A",
          "timeField": "timestamp"
        },
        {
          "alias": "exception",
          "bucketAggs": [
            {
              "field": "timestamp",
              "id": "2",
              "settings": {
                "interval": "auto",
                "min_doc_count": 0,
                "trimEdges": 0
              },
              "type": "date_histogram"
            }
          ],
          "metrics": [
            {
              "field": "select field",
              "id": "1",
              "type": "count"
            }
          ],
          "query": "payloadClassName.keyword: com.iquantex.phoenix.core.message.protobuf.Phoenix$ExceptionEvent && projectId.keyword: $projectId",
          "refId": "B",
          "timeField": "timestamp"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "消息数量",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    },
    {
      "columns": [
        {
          "text": "timestamp",
          "value": "timestamp"
        },
        {
          "text": "retCode",
          "value": "retCode"
        },
        {
          "text": "transId",
          "value": "transId"
        },
        {
          "text": "subTransId",
          "value": "subTransId"
        },
        {
          "text": "parentMsgId",
          "value": "parentMsgId"
        },
        {
          "text": "msgId",
          "value": "msgId"
        },
        {
          "text": "idempotentId",
          "value": "idempotentId"
        },
        {
          "text": "payloadClassName",
          "value": "payloadClassName"
        },
        {
          "text": "payload",
          "value": "payload"
        }
      ],
      "datasource": "elastic",
      "description": "",
      "fieldConfig": {
        "defaults": {
          "custom": {
            "align": null
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          }
        },
        "overrides": []
      },
      "fontSize": "80%",
      "gridPos": {
        "h": 10,
        "w": 24,
        "x": 0,
        "y": 16
      },
      "id": 4,
      "options": {
        "showHeader": true
      },
      "pageSize": null,
      "pluginVersion": "7.1.1",
      "showHeader": true,
      "sort": {
        "col": 8,
        "desc": true
      },
      "styles": [
        {
          "alias": "timestamp",
          "align": "auto",
          "dateFormat": "YYYY-MM-DD HH:mm:ss.SSS",
          "pattern": "timestamp",
          "type": "date"
        },
        {
          "alias": "",
          "align": "left",
          "colorMode": null,
          "colors": [
            "rgba(245, 54, 54, 0.9)",
            "rgba(237, 129, 40, 0.89)",
            "rgba(50, 172, 45, 0.97)"
          ],
          "dateFormat": "YYYY-MM-DD HH:mm:ss",
          "decimals": 2,
          "mappingType": 1,
          "pattern": "/.*/",
          "preserveFormat": false,
          "sanitize": false,
          "thresholds": [],
          "type": "string",
          "unit": "short"
        },
        {
          "alias": "",
          "align": "right",
          "colorMode": null,
          "colors": [
            "rgba(245, 54, 54, 0.9)",
            "rgba(237, 129, 40, 0.89)",
            "rgba(50, 172, 45, 0.97)"
          ],
          "decimals": 2,
          "pattern": "/.*/",
          "thresholds": [],
          "type": "number",
          "unit": "short"
        }
      ],
      "targets": [
        {
          "alias": "msg_list",
          "bucketAggs": [],
          "metrics": [
            {
              "field": "select field",
              "id": "1",
              "meta": {},
              "settings": {
                "size": 500
              },
              "type": "raw_document"
            }
          ],
          "query": "projectId.keyword: $projectId",
          "refId": "A",
          "timeField": "timestamp"
        }
      ],
      "timeFrom": null,
      "timeShift": null,
      "title": "消息",
      "transform": "json",
      "type": "table-old"
    },
    {
      "datasource": "elastic",
      "fieldConfig": {
        "defaults": {
          "custom": {
            "align": null
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 12,
        "w": 24,
        "x": 0,
        "y": 26
      },
      "id": 2,
      "options": {
        "showHeader": false
      },
      "pluginVersion": "7.1.1",
      "targets": [
        {
          "bucketAggs": [],
          "metrics": [
            {
              "field": "select field",
              "id": "1",
              "meta": {},
              "settings": {
                "size": 500
              },
              "type": "raw_document"
            }
          ],
          "query": "projectId.keyword: $projectId",
          "refId": "A",
          "timeField": "timestamp"
        }
      ],
      "timeFrom": null,
      "timeShift": null,
      "title": "消息原始日志",
      "type": "table"
    }
  ],
  "refresh": "10s",
  "schemaVersion": 26,
  "style": "dark",
  "tags": [
    "Phoenix"
  ],
  "templating": {
    "list": [
      {
        "allValue": null,
        "current": {
          "isNone": true,
          "selected": false,
          "text": "None",
          "value": ""
        },
        "datasource": "elastic",
        "definition": "{\"find\": \"terms\", \"field\": \"projectId.keyword\", \"size\": 500}",
        "hide": 0,
        "includeAll": false,
        "label": "projectId",
        "multi": false,
        "name": "projectId",
        "options": [],
        "query": "{\"find\": \"terms\", \"field\": \"projectId.keyword\", \"size\": 500}",
        "refresh": 2,
        "regex": "",
        "skipUrlSync": false,
        "sort": 0,
        "tagValuesQuery": "",
        "tags": [],
        "tagsQuery": "",
        "type": "query",
        "useTags": false
      },
      {
        "datasource": "elastic",
        "filters": [],
        "hide": 0,
        "label": "Filter",
        "name": "Filter",
        "skipUrlSync": false,
        "type": "adhoc"
      }
    ]
  },
  "time": {
    "from": "now-5m",
    "to": "now"
  },
  "timepicker": {
    "refresh_intervals": [
      "10s",
      "30s",
      "1m",
      "5m",
      "15m",
      "30m",
      "1h",
      "2h",
      "1d"
    ]
  },
  "timezone": "",
  "title": "05 phoenix message elasticsearch",
  "uid": "IhCj2nNGk12",
  "version": 1
}
```