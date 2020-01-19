{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "phoenix.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "phoenix.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "phoenix.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
通用标签
*/}}
{{- define "phoenix.labels" -}}
app.kubernetes.io/name: {{ include "phoenix.name" . }}
helm.sh/chart: {{ include "phoenix.chart" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}


{{/*
根据charts的version和phoenix.version得出phoenix镜像的tag
如果charts.version=0.0.0则表明是正常使用发布，需要使用phoenix.version
如果charts.version!=0.0.9则表明是release，需要使用charts.version
*/}}
{{- define "phoenix_websit.tag" -}}
{{- if eq .Chart.Version "0.0.0" }}
{{- .Values.project.version -}}
{{- else -}}
{{- .Chart.Version -}}
{{- end }}
{{- end -}}



{{- define "phoenix-namespace" -}}
{{- printf "%s" .Release.Namespace | trunc 63 -}}
{{- end -}}
