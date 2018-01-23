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

    if (tile_distance[chosen]=='dirt')
      data[id].cell['t']= 0;
    else if (tile_distance[chosen]=='grass')
      data[id].cell['t']=1;
    else if (tile_distance[chosen]=='mars')
      data[id].cell['t']=2;
    else if (tile_distance[chosen]=='sand')
      data[id].cell['t']=3;
    else if (tile_distance[chosen]=='stone')
      data[id].cell['t']=4;
    else
      console.log('Error with algor');

      /*
      dirt- normal/ tree
      grass- normal/ tree
      sand- normal/ rock
      stone- normal/ rock
      */


    }
}

axios.get('http://localhost:8080/query/plots').then(
  function(response) {
    var data = response.data

        if (data!=null) {
          var qarr= [];
          var q_obj;
          var rarr= [];
          var r_obj;

          for (let id in data) {
//            console.log("Id: " + id)
//            console.log("Data: " + data)

  //          data[id].cell['t']=0;
            qarr.push(data[id].cell['q']);
            rarr.push(data[id].cell['r']);
          }

          q_obj= {'min': Math.min(...qarr), 'max': Math.max(...qarr)};
          r_obj= {'min': Math.min(...rarr), 'max': Math.max(...rarr)};

          //console.log(CentroidGen(2,5,q_obj,r_obj))

                    MapGen(CentroidGen(2,5,q_obj,r_obj), data)
          var data2= []
          for (let id in data) {
            var e = {
                        'cell': {
                                'q': data[id].cell['q'],
                                  'r': data[id].cell['r']
                            },
                            'terrain':data[id].cell['t'],
                            'resources': []
                      }

                      data2.push(e)

            //console.log("Data: " + JSON.stringify(data[id].cell))
            //data2[id].cell['q']= data[id].cell['q']
            //console.log("q: " + data2[id].cell['q'])
            //data2[id].cell.q= data[id].cell['q']
            //data2[id].cell.r= data[id].cell['r']
            //data2[id].cell.t= data[id].cell['t']
          }

                      console.log(data2)




/*          var data2= data.map(plot => {
            var plot = {
              q: plot.cell.q,
              r: plot.cell.r,
              t: plot.cell.t
            }
          })
*/


//          console.log(JSON.stringify(data2));
  //        console.log(q_obj);
  //        console.log(r_obj);
        }


}

).catch(ex => console.log(ex));

//getJSON('http://localhost:8080/query/plots',
//);
