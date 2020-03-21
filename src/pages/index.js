import React from "react"
import { graphql } from "gatsby"

import colors from "../config/colors"
import Layout from "../components/layout"
import SEO from "../components/seo"
import DataChart from "../components/data-chart"
import getChartJSDataset from "../utils/datasets"

import "./mystyles.scss"

const IndexPage = ({ data }) => {

  const dataBE = {
    name: 'allCovid19DataBe',
    dataDateName: 'date',
    dataDateFormat: "DD/MM/YYYY",
    population: 11400000,
  }

  const dataITA = {
    name: 'allCovid19DataIta',
    dataDateName: 'data',
    dataDateFormat: "YYYY-MM-DD HH:mm:ss",
    population: 60480000,
  }

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

  const legends = {
    hospitalized: "Number of people receiving medical care in hospitals on given day",
    icu: "Number of people receiving medical care in Intensive Care Units on given day",
    released: "Number of people officially cured of Covid-19 after being hospitalized on given day",
    released_total: "Total number of people officially cured of Covid-19 after being hospitalized up to given day",
    deceased: "Total number of people officially deceased with Covid-19 up to given day",
  }

  const dataSetBE = [
    {
      dataName: 'hospitalized',
      dataLabel: 'Hospitalized',
      dataColor: colors.success,
      type: 'bar',
      dataNode: dataBE,
      legend: legends.hospitalized,
    },
    {
      dataName: 'icu',
      dataLabel: 'ICU',
      dataColor: colors.warning,
      type: 'bar',
      dataNode: dataBE,
      legend: legends.icu,
    },
    {
      dataName: 'released',
      dataLabel: 'Released',
      dataColor: colors.info,
      type: 'bar',
      dataNode: dataBE,
      legend: legends.released,
    },
    {
      dataName: 'deceased',
      dataLabel: 'Deceased',
      dataColor: colors.danger,
      dataNode: dataBE,
      legend: legends.deceased,
    },
  ]

  const dataSetITA = [
    {
      dataName: 'totale_ospedalizzati',
      dataLabel: 'Totale Ospedalizzati',
      dataColor: colors.success,
      dataNode: dataITA,
      type: 'bar',
      legend: legends.hospitalized,
    },
    {
      dataName: 'terapia_intensiva',
      dataLabel: 'Terapia Intensiva',
      dataColor: colors.warning,
      dataNode: dataITA,
      type: 'bar',
      legend: legends.icu,
    },
    {
      dataName: 'dimessi_guariti',
      dataLabel: 'Dimessi Guariti',
      dataColor: colors.info,
      dataNode: dataITA,
      legend: legends.released_total,
    },
    {
      dataName: 'deceduti',
      dataLabel: 'Deceduti',
      dataColor: colors.danger,
      dataNode: dataITA,
      legend: legends.deceased,
    },
  ]

  const statusPerDay = getChartJSDataset(dataSetBE, data)
  const statusPerDayITA = getChartJSDataset(dataSetITA, data)

  const dataSetITA_greyed = dataSetITA.map(dataset => ({ ...dataset, greyed: true }))

  const normalizer = (value, params) => {
    !value && (value = 0)
    return { original: value, normalized: (value / params.population) * 100000 }
  }

  const normalized = getChartJSDataset([...dataSetBE, ...dataSetITA_greyed], data, normalizer)
  
  return (
    <Layout>
      <SEO title={"Covid-19 Status in Belgium : " + [...statusPerDay.datasets[0].data].pop().t} />
      <DataChart title="Status per day in Belgium" dataset={statusPerDay} events={eventsBE}></DataChart>
      <DataChart title="Status per day in Italy (for reference)" dataset={statusPerDayITA} events={eventsITA}></DataChart>
      <DataChart 
      title="Status per day in Belgium (with ghost Italy data)"
      subtitle="Data normalized per 100.000 citizens"
      noDataCards={true} 
      events={[...eventsBE, ...eventsITA]} 
      dataset={normalized}
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
allCovid19DataIta(filter: {data: {gt: "2020-03-01"}}) {
  edges {
    node {
      deceduti
      dimessi_guariti
      isolamento_domiciliare
      nuovi_attualmente_positivi
      ricoverati_con_sintomi
      tamponi
      terapia_intensiva
      totale_attualmente_positivi
      totale_casi
      totale_ospedalizzati
      data
    }
  }
}
}
`