import { getMaxHeights } from "./maxCoordinatesHeight"; 

const run = async () => {
  const maxHeights = getMaxHeights();
  console.log(JSON.stringify(maxHeights));
}

run();