module.exports = {
  siteMetadata: {
    title: `Covid-19 Status in Belgium`,
    description: `Displaying data related to Covid19 in Belgium, to better assess the healthcare overflow risk in hospitals.`,
    author: `@tstassin`,
    siteUrl: 'https://cov19.be'
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    /*{
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    {
      resolve: `gatsby-transformer-csv`,
      options: {
        delimiter: ';',
      },
    },*/
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
        uri: 'https://epistat.sciensano.be/Data/COVID19BE_HOSP.json',
        // image location to process images. Default: "image.url"
        //image_location: "image.url",
      }
    },
    {
      resolve: 'gatsby-source-json',
      options: {
        // name the gatsby node
        name: 'covid19DataBE',
        // url for JSON endpoint
        uri: 'https://epistat.sciensano.be/Data/COVID19BE_MORT.json',
        // image location to process images. Default: "image.url"
        //image_location: "image.url",
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
}
