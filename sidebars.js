/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * module.exports = {
 *   someSidebar: {
 *     Docusaurus: ['doc1', 'doc2', 'doc3'],
 *     Features: ['mdx'],
 *   },
 * };
 */

module.exports = {
  docs: {
    快速入门: [
      'phoenix-2.x/quick-start/phoenix-lite-2x', 
      'phoenix-2.x/quick-start/phoenix-cloud-2x'
    ],
    使用文档: [
      {
        type: 'category',
        label: 'Phoenix-lite',
        items: [
          'phoenix-2.x/phoenix-lite/phoenix-lite-concept-2x',
          'phoenix-2.x/phoenix-lite/phoenix-lite-feature-2x',
          'phoenix-2.x/phoenix-lite/phoenix-lite-config-2x',
          'phoenix-2.x/phoenix-lite/phoenix-lite-data-table-2x',
          'phoenix-2.x/phoenix-lite/phoenix-lite-api-2x',
          'phoenix-2.x/phoenix-lite/phoenix-lite-http-api-2x'
        ],
      },
      {
        type: 'category',
        label: 'Phoenix-cloud',
        items: [
          'phoenix-2.x/phoenix-cloud/phoenix-cloud-api-2x'
        ],
      },
      {
        type: 'category',
        label: 'Phoenix-admin',
        items: [
          'phoenix-2.x/phoenix-admin/admin-function-2x',
          'phoenix-2.x/phoenix-admin/admin-build-2x',
          'phoenix-2.x/phoenix-admin/admin-instructions-2x'
        ],
      },
    ],
    测试报告: [
      'phoenix-2.x/phoenix-test/features-test-2x',
      'phoenix-2.x/phoenix-test/performance-test-2x',
      'phoenix-2.x/phoenix-test/available-test-2x',
      'phoenix-2.x/phoenix-test/elasticity-test-2x'
    ],
    白皮书: [
      'phoenix-2.x/phoenix/phoenix-white-page-2x'
    ],
    Roadmap: [
      'phoenix-2.x/phoenix/phoenix-roadmap-2x'
    ],
    Version: [
      'phoenix-2.x/phoenix/phoenix-version-2x'
    ],
  },
};