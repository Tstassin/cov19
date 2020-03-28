module.exports = {
  siteMetadata: {
    title: `Covid-19 Status in Belgium`,
    description: `Charting relevant Covid19 data in Belgium to help people further understand the situation and raise awareness`,
    author: `@tstassin`,
    siteUrl: 'https://cov19.be'
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },{
      resolve: `gatsby-transformer-csv`,
      options: {
        delimiter: ';',
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-cov19`,
        short_name: `cov19`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `static/cov19-favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-source-json',
      options: {
        // name the gatsby node
        name: 'covid19DataBE',
        // url for JSON endpoint
        uri: 'https://raw.githubusercontent.com/eschnou/covid19-be/master/covid19-belgium.json',
        // image location to process images. Default: "image.url"
        //image_location: "image.url",
        key: 'data'
      }
    },
    {
      resolve: 'gatsby-source-json',
      options: {
        // name the gatsby node
        name: 'covid19DataITA',
        // url for JSON endpoint
        uri: 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json',
        // image location to process images. Default: "image.url"
        //image_location: "image.url",
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
}
