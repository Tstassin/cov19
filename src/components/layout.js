/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useState } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Helmet from 'react-helmet'

import Header from "./header"
import { useStore } from "../store/store"

const Layout = ({ children }) => {

  const store = useStore()

  const [mobileMenu, setMobileMenu] = useState(false)

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

      <nav className="navbar is-fixed-bottom has-shadow" role="navigation" aria-label="dropdown navigation">
        <div class="navbar-brand">

          <a role="button" class={"navbar-burger burger " + (mobileMenu ? "is-active" : "")}  aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={() =>setMobileMenu(!mobileMenu)}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div className={"navbar-menu " + (mobileMenu ? "is-active" : "")} >
          <div className="navbar-start">
            <a className="navbar-item" href="#">
              <div className="field">
                <label htmlFor="setToggleLogarithmicScale" className="is-size-7">Linear&nbsp;&nbsp;</label>
                <input id="setToggleLogarithmicScale" type="checkbox" name="setToggleLogarithmicScale" className="switch is-small is-thin" onClick={() => store.setToggleLogarithmicScale(!store.toggleLogarithmicScale)} />
                <label htmlFor="setToggleLogarithmicScale" className="is-size-7">Logarithmic</label>
              </div>
            </a>
            <a className="navbar-item" href="#">
              <div className="field">
                <input id="setNormalizePopulations" type="checkbox" name="setNormalizePopulations" className="switch is-outlined is-small" onClick={() => store.setNormalizePopulations(!store.normalizePopulations)} />
                <label htmlFor="setNormalizePopulations">y-axis : normalize per 100.000 citizens</label>
              </div>
            </a>
            <a className="navbar-item" href="#">
              <div className="field">
                <input id="setCommonOrigin" type="checkbox" name="setCommonOrigin" className="switch is-outlined is-small" onClick={() => store.setCommonOrigin(!store.commonOrigin)} />
                <label htmlFor="setCommonOrigin">x-axis : origin set to <b className="has-text-danger">deceased</b> >= 10</label>
              </div>
            </a>
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
