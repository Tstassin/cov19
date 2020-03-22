import moment from 'moment'

const dateStandardOutputFormat = 'MMMM DD, YYYY'

const defaultDataOptions = {
    showLine: true,
}

const getDataPoints = (data, { name, dataDateName, dataDateFormat, ...rest }, dataName, normalizer) => (
    data[name].edges.map(({ node }) => {
        let normalizerResult
        if (normalizer) {
            normalizerResult = normalizer(node[dataName], rest)
        }
        return (
            {
                t: moment(node[dataDateName], dataDateFormat).format(dateStandardOutputFormat),
                y: normalizerResult ? normalizerResult.normalized : node[dataName],
                y_original: normalizerResult ? normalizerResult.original : node[dataName],
            }
        )
    })
)

const getChartJSDataset = (dataSet, data, normalizer) => (
    {
        datasets: dataSet.map(({ dataLabel, dataName, dataColor, type, dataNode, legend, greyed }) => (
            {
                borderColor: dataColor.value,
                backgroundColor: type && type === 'bar' && (greyed ? '#ccc' : dataColor.value),
                dataName: dataName,
                data: getDataPoints(data, dataNode, dataName, normalizer),
                dataColor: dataColor,
                hoverBackgroundColor: type && type === 'bar' && dataColor.value,
                label: dataLabel,
                legend: legend,
                offset: true,
                order: (type && type === 'bar') ? 2 : 1,
                type: type && type,
                ...defaultDataOptions
            }
        )),
        datasetsIndex: [...dataSet].reduce((current, item, index) => { current[item.dataName] = index; return current }, {})
    }
)

export default getChartJSDataset