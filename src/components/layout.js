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

import logo from '../../static/cov19-favicon.png'

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

  const CustomizeChartsMenuItems = () => {
    console.log(store)
    return (
      <>
        <a className="navbar-item" href="#">
          <div className="field">
            <label htmlFor="setToggleLogarithmicScale" className="is-size-7"><b className="has-text-primary">Y</b>-axis | &nbsp;linear&nbsp;&nbsp;</label>
            <input id="setToggleLogarithmicScale" type="checkbox" name="setToggleLogarithmicScale" className="switch is-small is-thin"
              onChange={() => store.setToggleLogarithmicScale(!store.toggleLogarithmicScale)}
              checked={store.toggleLogarithmicScale ? "checked" : ""}
            />
            <label htmlFor="setToggleLogarithmicScale" className="is-size-7">logarithmic</label>
          </div>
        </a>
        <a className="navbar-item" href="#">
          <div className="field">
          <label htmlFor="setToggleLogarithmicScale" className="is-size-7"><b className="has-text-primary">Y</b>-axis |&nbsp;&nbsp;</label>

            <input id="setNormalizePopulations" type="checkbox" name="setNormalizePopulations" className="switch is-outlined is-small"
              onChange={() => store.setNormalizePopulations(!store.normalizePopulations)}
              checked={store.normalizePopulations ? "checked" : ""}
            />
            <label htmlFor="setNormalizePopulations">normalize per 100.000 citizens</label>
          </div>
        </a>
        <a className="navbar-item" href="#">
          <div className="field">
          <label htmlFor="setToggleLogarithmicScale" className="is-size-7"><b className="has-text-primary">X</b>-axis |&nbsp;&nbsp;</label>

            <input id="setCommonOrigin" type="checkbox" name="setCommonOrigin" className="switch is-outlined is-small"
              onChange={() => store.setCommonOrigin(!store.commonOrigin)}
              checked={store.commonOrigin ? "checked" : ""}
            />
            <label htmlFor="setCommonOrigin">origin set to <span className="has-text-danger">deceased</span> >= 10</label>
          </div>
        </a>
      </>
    )
  }

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
        <br />
        created by T. Stassin
        <a href="mailto:tstassin@gmail.com"> mail</a> -
        <a href="https://twitter.com/TStassin"> tweet</a> -
        <a href="https://github.com/Tstassin/cov19"> git</a>
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
        built using
          {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>,
          <a href="https://www.chartjs.org"> Chart.js</a>,
          <a href="https://bulma.io"> Bulma</a>
        <br />
        I'm not a professional journalist, data scientist nor epidemiologist, this website is enthusiastic amateur work, for the greater good
      </footer>

      <nav className="navbar is-fixed-bottom has-shadow" role="navigation" aria-label="dropdown navigation">
        <div class="navbar-brand">

          <a class="navbar-item" href="/">
            <b>cov19.be</b>
          </a>
          <a role="button" class={"navbar-burger burger " + (mobileMenu ? "is-active" : "")} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={() => setMobileMenu(!mobileMenu)}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className={"navbar-menu" + (mobileMenu ? "is-active" : "")} >
          <div className="navbar-end is-hidden-desktop">
            <div class="navbar-item has-dropdown has-dropdown-up is-hoverable">
              <div class="navbar-link">
                Customize charts
              </div>
              <div class="navbar-dropdown is-right">
                <CustomizeChartsMenuItems></CustomizeChartsMenuItems>
              </div>
            </div>
          </div>
          <div className="navbar-end is-hidden-touch">
            <CustomizeChartsMenuItems></CustomizeChartsMenuItems>
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
