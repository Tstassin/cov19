import React from "react"
import { graphql } from "gatsby"
import moment from 'moment'

import colors from "../config/colors"
import Layout from "../components/layout"
import SEO from "../components/seo"
import DataChart from "../components/data-chart"
import getChartJSDataset, { dateStandardOutputFormat } from "../utils/datasets"

import { useStore } from '../store/store'

import "./mystyles.scss"

const IndexPage = ({ data }) => {

  const store = useStore()

  const eventsBE = [{
    value: 'March 14, 2020',
    label: {
      content: 'Belgium : restrictive measures',
    }
  },
  {
    value: 'March 18, 2020',
    label: {
      content: 'Belgium : lockdown',
    }
  }]

  const eventsITA = [{
    value: 'March 8, 2020',
    label: {
      content: 'Italy : north lockdown',
    }
  }, {
    value: 'March 10, 2020',
    label: {
      content: 'Italy : nationwide lockdown',
    }
  },]

  const dataBE = {
    name: 'allCovid19DataBe',
    dataDateName: 'DATE',
    dataDateFormat: "YYYY-MM-DD",
    population: 11400000,
    country: "Belgium",
    countryCode: "BE",
    events: eventsBE,
  }

  const dataITA = {
    name: 'allCovid19DataIta',
    dataDateName: 'data',
    dataDateFormat: "YYYY-MM-DD HH:mm:ss",
    population: 60480000,
    country: "Italy",
    countryCode: "ITA",
    events: eventsITA,
  }

  const legends = {
    hospitalized: "Number of people receiving medical care in hospitals on given day",
    icu: "Number of people receiving medical care in Intensive Care Units on given day",
    released: "Number of people officially cured of Covid-19 after being hospitalized on given day",
    released_total: "Total number of people officially cured of Covid-19 after being hospitalized up to given day",
    deceased: "Total number of people officially deceased with Covid-19 up to given day",
  }

  const dataSetBE = [
    {
      dataName: 'TOTAL_IN',
      dataLabel: 'Hospitalized',
      dataRef: 'hospitalized',
      dataColor: colors.success,
      type: 'bar',
      dataNode: dataBE,
      legend: legends.hospitalized,
    },
    {
      dataName: 'TOTAL_IN_ICU',
      dataLabel: 'ICU',
      dataRef: 'icu',
      dataColor: colors.warning,
      type: 'bar',
      dataNode: dataBE,
      legend: legends.icu,
    },
    {
      dataName: 'NEW_OUT',
      dataLabel: 'Released',
      dataRef: 'cumul_released',
      dataColor: colors.info,
      dataNode: dataBE,
      legend: legends.released_total,
    },
    {
      dataName: 'DEATHS',
      dataLabel: 'Deceased',
      dataRef: 'cumul_deceased',
      dataColor: colors.danger,
      dataNode: dataBE,
      legend: legends.deceased,
    },
  ]

  const dataSetITA = [
    {
      dataName: 'totale_ospedalizzati',
      dataLabel: 'Totale Ospedalizzati',
      dataRef: 'hospitalized',
      dataColor: colors.success,
      dataNode: dataITA,
      type: 'bar',
      legend: legends.hospitalized,
    },
    {
      dataName: 'terapia_intensiva',
      dataLabel: 'Terapia Intensiva',
      dataRef: 'icu',
      dataColor: colors.warning,
      dataNode: dataITA,
      type: 'bar',
      legend: legends.icu,
    },
    {
      dataName: 'dimessi_guariti',
      dataLabel: 'Dimessi Guariti',
      dataRef: 'cumul_released',
      dataColor: colors.info,
      dataNode: dataITA,
      legend: legends.released_total,
    },
    {
      dataName: 'deceduti',
      dataLabel: 'Deceduti',
      dataRef: 'cumul_deceased',
      dataColor: colors.danger,
      dataNode: dataITA,
      legend: legends.deceased,
    },
  ]

  const aggregate_data_by_date = (data) => {
    data['allCovid19DataBe'].edges.sort((a, b) => (a.node.DATE > b.node.DATE) )
    let currentDate = 0
    const newEdges = data['allCovid19DataBe'].edges.reduce(
      (acc, edge, index) => {
        if (currentDate === edge.node.DATE) {
          acc[acc.length - 1].node.TOTAL_IN += edge.node.TOTAL_IN
          acc[acc.length - 1].node.TOTAL_IN_ICU += edge.node.TOTAL_IN_ICU
          acc[acc.length - 1].node.DEATHS += edge.node.DEATHS
          acc[acc.length - 1].node.NEW_OUT += edge.node.NEW_OUT
        } else {
          currentDate = edge.node.DATE
          if (edge.node.DATE !== null) {
            acc.push({node: {...edge.node}})
            if (acc.length > 1) {
              acc[acc.length - 1].node.DEATHS += acc[acc.length - 2].node.DEATHS
              acc[acc.length - 1].node.NEW_OUT += acc[acc.length - 2].node.NEW_OUT
            }
          }
        }
        return acc
      }, []
      )
    return {...data, allCovid19DataBe : {edges : newEdges}}
  }

  const normalize_y_axis_per_population = (dataPoint, dataNode, dataRef) => (
    {
      ...dataPoint,
      y_original: dataPoint.y,
      y: (dataPoint.y / dataNode.population) * 100000
    }
  )

  const normalize_x_axis_origin = (data) => {
    const newOrigins = []

    data.forEach((dataset, index) => {
      if (dataset.dataRef === 'cumul_deceased') {
        newOrigins[dataset.dataNode.name] = dataset.data.findIndex(dataPoint => dataPoint.y_original >= 10)
      }
    })
    let minMax = { min: data[0].data.length, max: data[0].data.length }

    data.forEach((dataset, index) => {
      dataset.data = [...dataset.data].splice(newOrigins[dataset.dataNode.name])
      dataset.data = dataset.data.map((dataPoint, index) => ({ ...dataPoint, t: moment(data[0].data[0].t).add(index, 'days').format(dateStandardOutputFormat) }))
      if (minMax.min > dataset.data.length) minMax.min = dataset.data.length
      if (minMax.max < dataset.data.length) minMax.max = dataset.data.length
    })

    data.forEach((dataset, index) => dataset.data = [...dataset.data].splice(0, Math.min(minMax.min * 2 + 1, minMax.max)))

    return data
  }

  const sameDatasetSize = (data) => {
    const dataPointPrototype = { t: 0, y: "", y_original: "" }

    let minDate = moment(data[0].data[0].t)
    let maxDate = moment(data[0].data[0].t)
    data.forEach(dataset => {
      moment(dataset.data[0].t).isBefore(minDate) && (minDate = moment(dataset.data[0].t))
      moment(dataset.data[dataset.data.length - 1].t).isAfter(maxDate) && (maxDate = moment(dataset.data[dataset.data.length - 1].t))
    })

    data.forEach(dataset => {
      let currentDate = moment(dataset.data[0].t)
      let diff = currentDate.diff(minDate, 'days')

      let i = 1
      while (i <= diff) {
        dataset.data.unshift({ ...dataPointPrototype, t: currentDate.subtract(1, 'days').format(dateStandardOutputFormat) })
        i++
      }
    })

    return data
  }

  const cleanData = aggregate_data_by_date(data)

  const statusPerDay = getChartJSDataset(
    dataSetBE,
    cleanData,
    store.normalizePopulations ? normalize_y_axis_per_population : _ => _,
    _ => _,
    store.commonOrigin ? normalize_x_axis_origin : _ => _)

  const statusPerDayITA = getChartJSDataset(
    dataSetITA, 
    cleanData,
    store.normalizePopulations ? normalize_y_axis_per_population : _ => _,
    _ => _,
    store.commonOrigin ? normalize_x_axis_origin : _ => _)

    const dataSetITA_greyed = dataSetITA.map(dataset => ({ ...dataset, greyed: true }))

  const normalizedBEvsITA = getChartJSDataset(
    [...dataSetBE, ...dataSetITA_greyed],
    cleanData,
    store.normalizePopulations ? normalize_y_axis_per_population : _ => _,
    _ => _,
    store.commonOrigin ? normalize_x_axis_origin : sameDatasetSize
  )

  return (
    <Layout>
      <SEO title={"Covid-19 Status in Belgium : " + [...statusPerDay.datasets[0].data].pop().t} />
      <DataChart title="Status per day in Belgium" dataset={statusPerDay}></DataChart>
      <DataChart title="Status per day in Italy (for reference)" dataset={statusPerDayITA}></DataChart>
      <DataChart
        title="Status per day in Belgium (with ghost Italy data)"
        noDataCards={true}
        events={[...eventsBE, ...eventsITA]}
        dataset={normalizedBEvsITA}
        isLinear={true}
      ></DataChart>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
query MyQuery {
          allCovid19DataBe {
          edges {
          node {
      DATE
      TOTAL_IN
      TOTAL_IN_ICU
      DEATHS
      NEW_OUT
    }
  }
}
allCovid19DataIta(filter: {deceduti: {gte: 10}}) {
  edges {
    node {
      deceduti
      dimessi_guariti
      terapia_intensiva
      totale_ospedalizzati
      data
    }
  }
}
}
`