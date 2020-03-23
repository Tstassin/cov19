/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

// gatsby-browser.js
import React from 'react'

import { StoreProvider } from './src/store/store'

export const wrapRootElement = ({ element }) => <StoreProvider>{element}</StoreProvider>