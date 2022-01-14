(() => {
  //original code: https://codepen.io/AdrianSandu/pen/MyBQYz

  const FORMAT = (new URLSearchParams(window.location.search)).get('format') || '000-0000-0000';
  const RING_NUMBER = FORMAT.length;

  //slots 
  const SLOTS_PER_REEL = 10;  //digits
  const PANEL_WIDTH = 40;  //hard-coded in css (px)
  const REEL_RADIUS = Math.round( ( PANEL_WIDTH / 2) / Math.tan( Math.PI / SLOTS_PER_REEL ) ); 
  const SLOT_ANGLE = 360 / SLOTS_PER_REEL;
  const OFFSET = 4;  //don't ask me why...
  const OFFSET_DEG = SLOT_ANGLE * OFFSET;

  //generate rings html and spins' css and slots
  let spinCss = '';
  [...FORMAT].forEach((digit, idx) => {
    const ring = document.createElement('div');
    ring.id = `ring${idx}`;
    ring.className = 'ring';

    spinCss += `
.spin-${idx} { transform: rotateX(${-3600-OFFSET_DEG - SLOT_ANGLE*idx}deg); }
@keyframes spin-${idx} {
  0%   { transform: rotateX(${SLOT_ANGLE}deg); }
  100% { transform: rotateX(${-3600-OFFSET_DEG - SLOT_ANGLE*idx}deg); }
}
`;

    createSlots(ring, digit == '-' ? false : true);
    $('#rotate').append(ring);
  });

  //apply generated css
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(spinCss));
  document.getElementsByTagName('head')[0].appendChild(style);

  //init first result
  $('#result').text([...FORMAT].map(s => s == '-' ? '-' : '0').join(''));

  // hook start button
  $('.go').on('click',function(){
    const TIMER = 2;
    spin(TIMER);

    //remove whole(!) result
    $('#result').text(Array(RING_NUMBER).fill('?').join(''));
  })


  function createSlots (ring, isDigit) {
    //var seed = getSeed();
    const seed = 0;
    for (var i = 0; i < SLOTS_PER_REEL; i ++) {
      var slot = document.createElement('div');
      slot.className = 'slot';

      // compute and assign the transform for this slot
      var transform = `rotateX(${SLOT_ANGLE * i}deg) translateZ(${REEL_RADIUS}px)`;
      slot.style.transform = transform;

      // setup the number to show inside the slots the position is randomized to 
      const digit = isDigit ? (seed + i) % SLOTS_PER_REEL : '-';
      $(slot).append(`<p>${digit}</p>`);

      // add the poster to the row
      ring.append(slot);
    }
  }

  function spin(timer) {
    let result = '';
    for(var i = 0; i < RING_NUMBER; i ++) {
      let oldSeed = -1;
      /*
      checking that the old seed from the previous iteration is not the same as the current iteration;
      if this happens then the reel will not spin at all
      */
      const ring = $(`#ring${i}`);
      const oldClass = ring.attr('class');
      if(oldClass.length > 4) 
        oldSeed = parseInt(oldClass.slice(10));

      var seed = getSeed();
      while(oldSeed == seed) 
        seed = getSeed();

      //get result
      let number = seed + OFFSET;
      if(number > 9) number -= 10;
      const result = ring.children()[number].innerText;

      ring
      .css('animation','back-spin 1s, spin-' + seed + ' ' + (timer + i*Math.random()) + 's')
      .attr('class','ring spin-' + seed)
      .on('animationend webkitAnimationEnd', {i, result}, e => {
        const prevResult = $('#result').text();
        $('#result').text(prevResult.slice(0, e.data.i) + e.data.result + prevResult.slice(e.data.i + 1));
      });
    }
  }

  function getSeed() {
    // generate random number smaller than 13 then floor it to settle between 0 and 12 inclusive
    return Math.floor(Math.random()*(SLOTS_PER_REEL));
  }

})();
