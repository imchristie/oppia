// Copyright 2024 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Acceptance Test for creating blog post with required details only.
 */

import {UserFactory} from '../../utilities/common/user-factory';
import testConstants from '../../utilities/common/test-constants';
import {BlogPostEditor} from '../../utilities/user/blog-post-editor';
import * as path from 'path';

const DEFAULT_SPEC_TIMEOUT_MSECS = testConstants.DEFAULT_SPEC_TIMEOUT_MSECS;
const ROLES = testConstants.Roles;

let terminalImage: any;

(async () => {
  try {
    const terminalImageModule = await import('terminal-image');
    terminalImage = terminalImageModule.default;
  } catch (error) {
    console.error('Error importing terminal-image:', error);
  }
})();

describe('Blog Editor', () => {
  let blogPostEditor: BlogPostEditor;

  beforeAll(async () => {
    blogPostEditor = await UserFactory.createNewUser(
      'blogPostEditor',
      'blog_post_editor@example.com',
      [ROLES.BLOG_POST_EDITOR]
    );
  }, DEFAULT_SPEC_TIMEOUT_MSECS);

  it(
    'should create and publish a blog post with thumbnail, title, body and tags.',
    async () => {
      if (terminalImage) {
        try {
          console.log(
            await terminalImage.file(
              path.join(__dirname, 'blog-post-thumbnail-min.png')
            )
          );
        } catch (error) {
          console.error('Error using terminal-image:', error);
        }
      }

      await blogPostEditor.navigateToBlogDashboardPage();
      await blogPostEditor.publishNewBlogPost('This is a test blog post');
      await blogPostEditor.navigateToPublishTab();
      await blogPostEditor.expectPublishedBlogPostWithTitleToBePresent(
        'This is a test blog post'
      );

      await blogPostEditor.deletePublishedBlogPostWithTitle(
        'This is a test blog post'
      );
      await blogPostEditor.expectNumberOfBlogPostsToBe(0);
    },
    DEFAULT_SPEC_TIMEOUT_MSECS
  );

  it(
    'should not create an empty blog post.',
    async () => {
      await blogPostEditor.navigateToBlogDashboardPage();
      await blogPostEditor.openBlogEditorPage();
      await blogPostEditor.updateTitleTo('');
      await blogPostEditor.updateBodyTextTo('');
      await blogPostEditor.expectPublishButtonToBeDisabled();
    },
    DEFAULT_SPEC_TIMEOUT_MSECS
  );

  afterAll(async () => {
    await UserFactory.closeAllBrowsers();
  });
});
