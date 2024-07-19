//import {getAllPointsAltitudes} from './coordinates-puller';
import {readCoordinatesFromFile} from './coordinateFormatter';

const run = async () => {
  const heights = await readCoordinatesFromFile()
}

run()
