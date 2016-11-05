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
    DEATH: 'C'
  */
  const A = 'A'
  const B = 'B'
  const C = 'C'
  return {
    getMap: function() {

        var maps = [];

        //Testbed
        /*maps[99] = [
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
        ]*/

        maps[0] = [
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , ,2, , , , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2, , , , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , ,6, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9, , , , , , , , , , , , , , , , , , , ,9, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , , , , , , ],
            [ , , ,8, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,8, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,8, , , ,8, , , , , , , , , , , , , , ,9, , , , , ,6, , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,8, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,8, , , , , , , , , , , ,6, , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , , , , , , ],
            [ , ,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,B, , , , , , , , , , , , , , , , ,6, , , , , , , , , ,A, , , , , , , , , , , , , , , , , , , , ,6, , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,B, ,A, , , , , , , , , , , , , , ,6, , ,6, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , , , , , , ],
            [ , , , , , , , , ,B, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6,6, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6, , , , ,6, , ,2,2,2,2,2,2,2,2,2,2, , , ,6, , , , , , , , , , , , , , ,6, , , , , , , , , ],
            [ , , , , , ,A, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6,6,6,A, , ,6, , , , , , , , , , , , ,6, , ,6, , , , , , , , , , , , ,A, , , , , , , ,2,2,2,2,2, , , , , , , , , , , , , ,6, , ,2,2,2,2,2,2,2,2,2,2, , , ,6, , , , , , , , , , , , , , ,6, , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,6,6,6,6, , , ,6,6,6,6,6,6,6,6,6,6,6,6,6,6, , ,6, , , , , , , , , , , , , , , ,2,2,2,2,2,2,2,2,2,2, , , , , , , , , , , , , ,6, , ,2,2,2,2,2,2,2,2,2,2, , , ,6, , , , , , , ,7, ,5, , , , ,6, , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2, , , , , , , , , ,2,2,2,2,2,2,2,2,2,2,2,2,2, , , , ,2,2,2,2,2, ,2,2, ,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , , , , , , , , ],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,2,2,2,2, , , , , , , , , ,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,2,2,2,2,2,3,2,2,3,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3],
            [ , , , , , , , , , , , , , , , , ,2, , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2, , , , , , , , , ,2, , , , , , , , , , , , , , , , , , , , , , , , , ,2, , ,2, , , , , , , , ,2, , , ,2, , , , , , , , , , , , , , , , , , , , , , , , ],
            [ , , , , , , , , , , , , , , , , ,2,C,C,2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2,C,C,C,C,C,C,C,C,C,2, , , , , , , , , , , , , , , , , , , , , , , , , ,2,C,C,2, , , , , , , , ,2,C,C,C,2, , , , , , , , , , , , , , , , , , , , , , , , ],
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
            [ , ,2, , ,7,5,2, , , , , , , , , , , , , , , , , , , , , ,2, , , ,2, , , , , , , ,5],
            [2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2]
        ]
        return maps;
    }
  }
})