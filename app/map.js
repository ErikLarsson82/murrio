define('app/map', [], function() {
  /*
    PLAYER: 1,
    TILE: 2,
    ENEMY1: 3,
    ENEMY2: 4,
    VICTORY: 5
    TILE3: 6
    GRANPA: 7
    CLOUD1: 8
    CLOUD2: 9
    BUSH1: 'A'
    BUSH1: 'B'
  */
  const A = 'A'
  const B = 'B'
  return {
    getMap: function(idx) {

        var maps = [];

        //Testbed
        maps[99] = [
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , ,2, , , , , , , ,2, , , , , , , , ,2, , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , ,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [ , , , , , , , , , , , , , , , , ,5, , , , , , , , , , , , , , , ,5, , , , , , , , ],
            [6,6,6,6,6,6,6, , ,2,2,2, , ,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2, , ,2,2,2,3,3,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2]
        ]

        maps[0] = [
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , , , , , , , , , , , , ,2, , , , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2, , , , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , ,6, , , , , , , , , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , ,8, , , , , ,9, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6],
            [ , ,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , ,6, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , ,A, , ,B, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6,6, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , ,6, , ,2,2,2,2,2,2,2,2,2,2, , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6,6,6, , , ,6, , , , , , , , , , , , ,6, , ,6, , , , , , , , , , , , , , , , , , , , ,2,2,2,2,2, , , , , , , , , , , , , ,6, , ,2,2,2,2,2,2,2,2,2,2, , , , , , , , , , , , , , , , , , ,6],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6,6,6,6, , , ,6,6,6,6,6,6,6,6,6,6,6,6,6,6, , ,6, , , , , , , , , , , , , , , ,2,2,2,2,2,2,2,2,2,2, , , , , , , , , , , , , ,6, , ,2,2,2,2,2,2,2,2,2,2, , , , , , , , , , , , , ,5, ,7, , ,6],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2, , , , ,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2, , , , ,2,2,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
        ]

        maps[1] = [
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , ,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , , , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,5],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2, , , ,2, , , , , , , ,5],
            [ , ,2, , , , ,2, , , , , , , , , , , , , , , , , , , , , ,2, , , ,2, , , , , , , ,5],
            [2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2]
        ]
        return maps[idx];
    }
  }
})