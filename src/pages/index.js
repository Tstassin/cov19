import React from "react"
import { graphql } from "gatsby"
import { Scatter } from "react-chartjs-2"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import "./mystyles.scss"

const IndexPage = ({ data }) => {

  const success = '#48C774'
  const warning = '#FFDD57'
  const danger = '#F14668'
  const info = 'hsl(204, 86%, 53%)'

  const defaultOptions = {
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          parser: 'DD/MM/YYYY',
          unit: 'day'
        },
        offset: true,
      }]
    }
  }

  const defaultDataOptions = {
    showLine: true,
  }

  const dataSets = [
    {
      dataName: 'deceased',
      dataLabel: 'Deceased',
      dataColor: danger,
    },
    {
      dataName: 'hospitalized',
      dataLabel: 'Hospitalized',
      dataColor: success,
      type: 'bar'
    },
    {
      dataName: 'icu',
      dataLabel: 'ICU',
      dataColor: warning,
      type: 'bar'
    },
    {
      dataName: 'released',
      dataLabel: 'Released',
      dataColor: info,
      type: 'bar'
    },
  ]

  const getDataPoints = (data, dataName) => data.edges.map(dataPoint => ({ t: dataPoint.node.date, y: dataPoint.node[dataName] }))

  const statusPerDay = {
    datasets: dataSets.map(({ dataLabel, dataName, dataColor, type }) => ({
      label: dataLabel,
      dataName: dataName,
      data: getDataPoints(data.allCovid19Data, dataName),
      borderColor: dataColor,
      type: type && type,
      offset: true,
      backgroundColor: type && type === 'bar' && dataColor,
      ...defaultDataOptions
    }))
  }

  const datasetsIndex = {}
  statusPerDay.datasets.forEach((dataset, index) => datasetsIndex[dataset.dataName] = index)
  
  const getProgression = (data) => {
    const progressionRatio = (data[data.length - 1].y - data[data.length - 2].y) / data[data.length - 1].y
    const percentage = Math.round(progressionRatio * 100)
    return ((percentage > 0) && "+") + percentage + "%"
  }

  return (
    <Layout>
      <SEO title="Home" />
      <div className="section">
        <h2 className="title is-3 is-size-4-mobile">Covid19 Status</h2>
        <p className="subtitle is-5 is-size-6-mobile">updated {[...statusPerDay.datasets[0].data].pop().t}</p>
        <div class="field is-grouped is-grouped-multiline">
          <div class="control">
            <div class="tags are-medium has-addons">
              <span class="tag is-success has-text-weight-semibold">
                Hospitalized
                <span class="tags are-small is-size-7 has-text-weight-normal">&nbsp;{[...statusPerDay.datasets[datasetsIndex['hospitalized']].data].pop().t}</span>
              </span>
              <span class="tag has-text-weight-bold">{[...statusPerDay.datasets[datasetsIndex['hospitalized']].data].pop().y}
                <span class="tags are-small is-size-7">&nbsp;{getProgression(statusPerDay.datasets[datasetsIndex['hospitalized']].data)}</span>
              </span>
            </div>
          </div>
          <div class="control">
            <div class="tags are-medium has-addons">
              <span class="tag is-warning has-text-weight-semibold">
                ICU
                <span class="tags are-small is-size-7 has-text-weight-normal">&nbsp;{[...statusPerDay.datasets[datasetsIndex['icu']].data].pop().t}</span></span>
              <span class="tag has-text-weight-bold">{[...statusPerDay.datasets[datasetsIndex['icu']].data].pop().y}
                <span class="tags are-small is-size-7">&nbsp;{getProgression(statusPerDay.datasets[datasetsIndex['icu']].data)}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="field is-grouped is-grouped-multiline">
          <div class="control">
            <div class="tags are-medium has-addons">
              <span class="tag is-info has-text-weight-semibold">
              Released
              <span class="tags are-small is-size-7 has-text-weight-normal">&nbsp;{[...statusPerDay.datasets[datasetsIndex['released']].data].pop().t}</span>

              </span>
              <span class="tag has-text-weight-bold">{[...statusPerDay.datasets[datasetsIndex['released']].data].pop().y}
                <span class="tags are-small is-size-7">&nbsp;{getProgression(statusPerDay.datasets[datasetsIndex['released']].data)}</span>
              </span>
            </div>
          </div>
          <div class="control">
            <div class="tags are-medium has-addons">
              <span class="tag is-danger has-text-weight-semibold">
              Deceased
              <span class="tags are-small is-size-7 has-text-weight-normal">&nbsp;TOTAL</span>
              </span>
              <span class="tag has-text-weight-bold">{[...statusPerDay.datasets[datasetsIndex['deceased']].data].pop().y}
                <span class="tags are-small is-size-7">&nbsp;total</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h2 className="title is-3 is-size-4-mobile">Status per day</h2>
        <p className="subtitle is-5 is-size-6-mobile">up to {[...statusPerDay.datasets[0].data].pop().t}</p>
        <Scatter data={statusPerDay} options={defaultOptions} redraw={true}></Scatter>
        <br />
        <h3 className="title is-5">Legend</h3>
        <ul>
          <li><span className="tag is-success">&nbsp;</span> <b>Hospitalized (daily count)</b> : # people receiving medical care in hospitals on given day</li>
          <li><span className="tag is-warning">&nbsp;</span> <b>ICU (daily count)</b> : # people receiving medical care in Intensive Care Units on given day</li>
          <li><span className="tag is-danger">&nbsp;</span> <b>Deceased (total)</b> : # people officially deceased with Covid-19 up to given day</li>
          <li><span className="tag is-info">&nbsp;</span> <b>Released (total)</b> : # people officially cured of Covid-19 after being hospitalized up to given day</li>
        </ul>
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
query MyQuery {
        allCovid19Data {
        edges {
        node {
        cumul_cases
        cumul_tests
      daily_cases
      daily_tests
      icu
      date
      deceased
      hospitalized
      released
    }
  }
}
}
`