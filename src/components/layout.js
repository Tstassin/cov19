/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Helmet from 'react-helmet'

import Header from "./header"
import { useStore } from "../store/store"

const Layout = ({ children }) => {

  const {toggleLogarithmicScale, setToggleLogarithmicScale} = useStore()

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  return (
    <>
      <Helmet bodyAttributes={{ class: "has-navbar-fixed-bottom" }} />
      <Header siteTitle={data.site.siteMetadata.title} />
      <main>{children}</main>
      <footer className="section">
        <hr />
        <p>
          {data.site.siteMetadata.description}
        </p>
        <hr />
        © {new Date().getFullYear()}
        <br /> built with
          {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>,
          <a href="https://www.chartjs.org"> Chart.js</a>,
          <a href="https://bulma.io"> Bulma</a>
        <br /> opendata from :<br />
        <ul>
          <li>
            &mdash;&nbsp;Belgium : <a href="https://github.com/eschnou/covid19-be"> eschnou/covid19-be </a>
            (data source : <a href="https://epidemio.wiv-isp.be/ID/Pages/2019-nCoV_epidemiological_situation.aspx">sciensano</a>)
          </li>
          <li>
            &mdash;&nbsp;Italy : <a href="https://github.com/pcm-dpc/COVID-19"> pcm-dpc/COVID-19 </a>
            (data source : <a href="http://www.protezionecivile.it/attivita-rischi/rischio-sanitario/emergenze/coronavirus">protezionecivile</a>)
          </li>
        </ul>
        written by
          <a href="https://github.com/Tstassin/cov19"> tstassin</a>
      </footer>

      <nav class="navbar is-fixed-bottom has-shadow" role="navigation" aria-label="dropdown navigation">
        <div class="navbar-menu">
          <div class="navbar-start">

      <div class="navbar-item">
                <a class="button is-primary" onClick={() => setToggleLogarithmicScale(!toggleLogarithmicScale)}>
                  {"Toggle " + (toggleLogarithmicScale ? "linear scale" : "logarithmic scale") }
                </a>
          </div>
          </div>
        </div>
      </nav>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
