var axios = require('axios')

var CentroidGen= function(minNumOfCentroid, randVariable, q, r) {

//  let min= 2; let centreVariable= 5;
//  let xmax= 4; let ymax= 6;


  let numOfCentroids= Math.floor(Math.random()*randVariable+minNumOfCentroid);
  let centroids= [];

//  let Regions= ['dirt', 'grass', 'mars', 'sand', 'stone'];

  let Regions= ['Forest', 'Desert', 'Mountain']

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



var MapGen= function(centroidData, data, mapsize) {
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

        if (tile_distance[chosen]=='Forest')
        {
          data[id].cell['t']= 'Forest';

          let woodCtrlVar=20;
          let livestockCtrlVar= 20;

          if (Math.random()*woodCtrlVar < 1)
            data[id].resources.push('Wood');
          else if (Math.random()*livestockCtrlVar < 1)
            data[id].resources.push('Livestock');

        } else if (tile_distance[chosen]=='Mountain')
        {
          data[id].cell['t']='Mountain';

          let ironCtrlVar=20;
          let coalCtrlVar=20;

          if (Math.random()*ironCtrlVar < 1)
            data[id].resources.push('IronOre');
          else if (Math.random()*coalCtrlVar < 1)
            data[id].resources.push('Coal');
        } else if (tile_distance[chosen]=='Desert')
        {
          data[id].cell['t']='Desert';

          let oilCtrlVar=20;
            if (Math.random()*oilCtrlVar < 1)
              data[id].resources.push('Oil');
        } else
          console.log('Error in MapGen')
    }

/*
    if (tile_distance[chosen]=='Forest')
    {
      data[id].cell['t']= 'Forest';
      //dirt plain
      // dirt tree
      // dirt rock

    } else if (tile_distance[chosen]=='Forest')
    {

      data[id].cell['t']=1;

      let woodCtrlVar=20;
      let livestockCtrlVar= 20;

        if (Math.random()*woodCtrlVar < 1)
          data[id].resources.push('Wood');
        else if (Math.random()*livestockCtrlVar < 1)
          data[id].resources.push('Livestock');
        else
        {
          //data[id].resources.push('Fruits');
        }

        // grass plain
        // grass tree
        // grass Wood
        // grass rock
        // grass Livestock

    }
   else if (tile_distance[chosen]=='mars')
    {
      data[id].cell['t']=2;
    }
    else if (tile_distance[chosen]=='sand')
    {
      data[id].cell['t']=2;

      let oilCtrlVar=20;
        if (Math.random()*oilCtrlVar < 1)
          data[id].resources.push('Oil');

      // sand rock
      // sand plain
      // sand tree
      // sand Oil

    }
    else if (tile_distance[chosen]=='stone')
    {
      data[id].cell['t']=3;

      let ironCtrlVar=20;
      let coalCtrlVar=20;

        if (Math.random()*ironCtrlVar < 1)
          data[id].resources.push('IronOre');
        else if (Math.random()*coalCtrlVar < 1)
          data[id].resources.push('Coal');
        else {
          //data[id].resources.push('Ore')
        }

    }
    else
      console.log('Error with algor');

    }
    */
}

axios.get('http://localhost:8080/query/plots').then(
  function(response) {
    var data = response.data

        if (data!=null) {
          var qarr= [];
          var rarr= [];
//          var size=0;

          for (let id in data) {
            qarr.push(data[id].cell['q']);
            rarr.push(data[id].cell['r']);
//            size += 1;
          }

//            console.log('Size of Map: '+size);

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
          console.log(data2)
          //console.log(JSON.stringify(data2, null, 4));
    }
}).catch(ex => console.log(ex));
