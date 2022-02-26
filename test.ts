import { googleCloud } from './api/libs/googleCloud'

const test = async () => {
  const [datasets] = await googleCloud.datasetServiceClient.listDatasets({
    parent: googleCloud.location,
  })

  // eslint-disable-next-line no-console
  console.log(datasets)
}

test()
