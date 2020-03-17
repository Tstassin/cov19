module.exports = {
  siteMetadata: {
    title: `Covid19 Status in Belgium`,
    description: `Charting relevant Covid19 data in Belgium to help people further understand the situation and raise awareness`,
    author: `@tstassin`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
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
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-source-json',
      options: {
        // name the gatsby node
        name: 'covid19Data',
        // url for JSON endpoint
        uri: 'https://raw.githubusercontent.com/eschnou/covid19-be/master/covid19-belgium.json',
        // image location to process images. Default: "image.url"
        //image_location: "image.url",
        key: 'data'
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
}
