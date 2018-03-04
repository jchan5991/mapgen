var axios = require('axios')

var CentroidGen= function(minNumOfCentroid, randVariable, q, r) {

  let min= 2; let centreVariable= 5;
  let xmax= 4; let ymax= 6;


  let numOfCentroids= Math.floor(Math.random()*randVariable+minNumOfCentroid);
  let centroids= [];

  let Regions= ['dirt', 'grass', 'mars', 'sand', 'stone'];

  for(let i=1; i<= numOfCentroids; i++)
  {
      let tmp= Regions[Math.floor(Math.random()*Regions.length)];
      centroids.push(tmp);
      //Regions.splice(Regions.indexOf(tmp),1);
  }

  let centroids_coord= {};

  for (let centroid of centroids)
  {
    centroids_coord[centroid]={ 'q': q.min+Math.random()*(q.max-q.min),
                         'r': r.min+Math.random()*(r.max-r.min)
                       };
  }

  return [centroids, centroids_coord];
}



var MapGen= function(centroidData, data) {
  var centroids= centroidData[0];
  var centroids_coord= centroidData[1];

  for(let id in data)
  {
    let tile_distance= {};
    for (let centroid of centroids)
    {
       let q= Math.abs(data[id].cell['q']-centroids_coord[centroid].q);
       let r= Math.abs(data[id].cell['r']-centroids_coord[centroid].r);

      tile_distance[q+r/2]= centroid;
      //tile_distance[centre]= x+y/2;
    }

    let chosen= Math.min(...Object.keys(tile_distance).map(Number));

    if (tile_distance[chosen]=='dirt') {
      data[id].cell['t']= 0;


    } else if (tile_distance[chosen]=='grass') {

      data[id].cell['t']=1;

      let woodCtrlVar=20;
      let livestockCtrlVar= 20;

        if (Math.random()*woodCtrlVar < 1)
          data[id].resources.push('Wood');
        else if (Math.random()*livestockCtrlVar < 1)
          data[id].resources.push('Livestock');
        else {
          data[id].resources.push('Fruits');
        }

    } else if (tile_distance[chosen]=='mars') {
      data[id].cell['t']=2;
    } else if (tile_distance[chosen]=='sand') {
      data[id].cell['t']=3;

      let oilCtrlVar=20;
        if (Math.random()*oilCtrlVar < 1)
          data[id].resources.push('Oil');

    } else if (tile_distance[chosen]=='stone') {
      data[id].cell['t']=4;

      let ironCtrlVar=20;
      let coalCtrlVar=20;

        if (Math.random()*ironCtrlVar < 1)
          data[id].resources.push('Iron Ore');
        else if (Math.random()*coalCtrlVar < 1)
          data[id].resources.push('Coal');
        else {
          data[id].resources.push('Ore')
        }

    } else
      console.log('Error with algor');

      /*
      t: 1,2,3 - Dirt normal
      t: 4,5,6 - Dirt with Trees

      t: 7,8,9 - Grass normal
      t: 10,11,12 - Grass with Trees

      t: 13,14,15 - Sand normal
      t: 16,17,18 - Sand with Rocks

      t: 19,20,21 - Stone normal
      t: 22,23,24 - Stone with rock


      */


    }
}

axios.get('http://localhost:8080/query/plots').then(
  function(response) {
    var data = response.data

        if (data!=null) {
          var qarr= [];
          var rarr= [];


          for (let id in data) {
            qarr.push(data[id].cell['q']);
            rarr.push(data[id].cell['r']);
          }

          let q_obj= {'min': Math.min(...qarr), 'max': Math.max(...qarr)};
          let r_obj= {'min': Math.min(...rarr), 'max': Math.max(...rarr)};


          let minNumOfCentroid= 2;
          let randVariable= 5;

          MapGen(CentroidGen(minNumOfCentroid,randVariable,q_obj,r_obj), data);

          var data2= []
          for (let id in data) {
            var e = {
                        'terrain':data[id].cell['t'],
                        'resources': data[id].resources,
                        'cell': {
                                  'q': data[id].cell['q'],
                                  'r': data[id].cell['r']
                                }

                      }

            data2.push(e)
          }

          console.log(JSON.stringify(data2));
    }
}).catch(ex => console.log(ex));
