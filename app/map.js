define('app/map', [], function() {
  /*
    PLAYER: 1,
    TILE: 2,
    ENEMY1: 3,
    ENEMY2: 4,
    VICTORY: 5
  */
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
            [2,2,2,2,2,2,2, , ,2,2,2, , ,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2, , ,2,2,2,3,3,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2]
        ]

        maps[0] = [
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , ,2, , , , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2, , , , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2, , , , ,2, , , , , , , , , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , ,2],
            [ , ,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2, , ,2, , , , , , , , , , , , , , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2,2, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2, , , , ,2, , ,2,2,2,2,2,2,2,2,2,2, , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2,2,2, , , ,2, , , , , , , , , , , , ,2, , ,2, , , , , , , , , , , , , , , , , , , , ,2,2,2,2,2, , , , , , , , , , , , , ,2, , ,2,2,2,2,2,2,2,2,2,2, , , , , , , , , , , , , , , ,2],
            [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2, , , , , , , , , , , , , , , ,2,2,2,2,2,2,2,2,2,2, , , , , , , , , , , , , ,2, , ,2,2,2,2,2,2,2,2,2,2, , , , , , , , , , , , , ,5, ,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2, , , , ,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2, , , , ,2,2,2,2,2,2,2,2,2,2, , ,2,2,2,2,2,2,2,2,2,2, , , ,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2]
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