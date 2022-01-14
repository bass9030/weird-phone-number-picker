
let dies = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

$(window).on('load', () => {
    $('#roll').click(() => {
        console.log("roll");
        for(let i = 0; i < 11; i++) {
            const isHold = $('#hold-' + i).is(':checked');
            if(!isHold) {
                dies[i] = Math.floor(Math.random() * 10);
                console.log(dies[i]);
                console.log($('.die')[i])
                if(dies[i] == 0) $($('.die')[i]).html('');
                else $($('.die')[i]).html('<img src="dies/' + dies[i] + '.png">');
            }
        }
    });

    $('#sumbit').click(() => {
        let result = '';
        let i = 0;
        dies.forEach((e) => {
            result += e + '';
            if(i == 2 || i == 6) result += '-';
            i++;
        })
        alert(result);
    });
})