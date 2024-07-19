import { getMaxHeights } from "./maxCoordinatesHeight"; 

const run = async () => {
  const maxHeights = await getMaxHeights();

  const latKeys = Object.keys(maxHeights).sort();
  latKeys.forEach((lat) => {
    const longKeys = Object.keys(maxHeights[lat]).sort();
    longKeys.forEach((long) => {
      console.log(`{ lat: '${lat}', long: '${long}', alt: ${maxHeights[lat][long].alt} }`);
    })
  })
}

run();