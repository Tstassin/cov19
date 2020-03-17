/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql, Link } from "gatsby"

import Header from "./header"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
        <main>{children}</main>
        <footer className="section">
          © {new Date().getFullYear()}
          <br /> built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>, 
          <a href="https://www.chartjs.org"> Chart.js</a>,
          <a href="https://bulma.io"> Bulma</a>
          <br /> data from
          <a href="https://github.com/eschnou/covid19-be"> eschnou/covid19-be</a>
          <br /> written by 
          <a href="https://github.com/Tstassin/cov19"> tstassin</a>
        </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
