$(function(){
  setTimeout(function() {
    $('.text-animation').removeClass('hidden');
  }, 500)

  $('#audio').on('ended', function() {
    $('.audiowraper').css({'background':'url(audio/voice_stop.png) no-repeat center bottom','background-size':'cover'});
  })
  var audio = document.getElementById('audio');
  audio.volume = .3;
  $('.audiowraper').click(function() {
    event.stopPropagation();
    if(audio.paused){
      $('.audiowraper').css({'background':'url(audio/voice_play.png) no-repeat center bottom','background-size':'cover'});
      audio.play();
      return;
    }else{
      $('.audiowraper').css({'background':'url(audio/voice_stop.png) no-repeat center bottom','background-size':'cover'});
      audio.pause();
    }
  });
})

main = function(selector) {
  var listener = new main.listener();
  var layers = Array.prototype.slice.call(selector.querySelectorAll(".layer"));
  var capable = 'WebkitPerspective' in document.body.style || 'MozPerspective' in document.body.style || 'msPerspective' in document.body.style || 'OPerspective' in document.body.style || 'perspective' in document.body.style;
  if (capable) {
    selector.classList.add('capable');
  }
  layers.forEach(function(el, i) {
    if (!el.querySelector('.dimmer')) {
      el.innerHTML += '<div class="dimmer"></div>';
    }
  })

  function show(target, direction) {
    var layers = Array.prototype.slice.call(selector.querySelectorAll(".layer"));
    selector.classList.add('animate');
    direction = direction || (target > getIndex() ? 'right' : 'left');
    if (typeof target === 'string') target = parseInt(target);
    if (typeof target !== 'number') target = getIndex(target);
    target = target = Math.max(Math.min(target, layers.length), 0);
    if (layers[target] && !layers[target].classList.contains('show')) {
      layers.forEach(function(el, i) {
        el.classList.remove('left', 'right');
        el.classList.add(direction);
        if (el.classList.contains('show')) {
          el.classList.remove('show');
          el.classList.add('hide');
        } else {
          el.classList.remove('hide');
        }
      });
      layers[target].classList.add('show');
      listener.dispatch(layers[target], target);
    }
  }

  function pre() {
    var index = getIndex() - 1;
    show(index >= 0 ? index : layers.length + index, 'left')
  }

  function next() {
    show((getIndex() + 1) % layers.length, 'right');
  }

  function getIndex(target) {
    var index = 0;
    layers.forEach(function(layer, i) {
      if ((target && target == layer) || (!target && layer.classList.contains('show'))) {
        index = i;
        return;
      }
    });
    return index;
  }

  function getTotal() {
    return layers.length;
  }

  return {
    show: show,
    pre: pre,
    next: next,
    getIndex: getIndex,
    getTotal: getTotal,
    listener: listener
  }
}

main.listener = function() {
  this.listeners = [];
}

main.listener.prototype.add = function(callback) {
  this.listeners.push(callback);
}

main.listener.prototype.dispatch = function() {
  var args = Array.prototype.slice.call(arguments);
  this.listeners.forEach(function(f, i) {
    f.apply(null, args);
  });
}

var m = main(document.querySelector('.main'));
var bullets = document.body.querySelector('.bullets');
var len = m.getTotal();
for (var i = 0; i < len; i++) {
  var bullet = document.createElement('li');
  bullet.className = i === 0 ? 'active' : '';
  bullet.setAttribute('index', i);
  bullet.onclick = function(e) {
    m.show(e.target.getAttribute('index'));
  }
  bullet.ontouchstart = function(e) {
    m.show(e.target.getAttribute('index'));
  }
  bullets.appendChild(bullet);
}

m.listener.add(function(layer, index) {
  var bullets = document.body.querySelectorAll('.bullets li');
  var l = bullets.length;
  for (var i = 0; i < l; i++) {
    bullets[i].className = i === index ? 'active' : '';
  }
});

document.addEventListener('keyup', function(e) {
  if (e.keyCode === 37) m.pre();
  if (e.keyCode === 39) m.next();
}, false);

$('.snowman').click(function(){
  var state = $(this).css('animation-play-state');
  if (state == 'paused') {
    $(this).css('animation-play-state','running');
  } else {
    $(this).css('animation-play-state','paused');
  }
});

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = canvas.parentNode.offsetWidth;
canvas.height = canvas.parentNode.offsetHeight;
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();
var boHeight = canvas.height / 10;
var posHeight = canvas.height / 1.2;
var step = 0;
var lines = ["rgba(0,222,255, 0.2)", "rgba(157,192,249, 0.2)", "rgba(0,168,255, 0.2)"];

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  step++;
  for (var j = lines.length - 1; j >= 0; j--) {
    ctx.fillStyle = lines[j];
    var angle = (step + j * 50) * Math.PI / 180;
    var deltaHeight = Math.sin(angle) * boHeight;
    var deltaHeightRight = Math.cos(angle) * boHeight;
    ctx.beginPath();
    ctx.moveTo(0, posHeight + deltaHeight);
    ctx.bezierCurveTo(canvas.width / 2, posHeight + deltaHeight - boHeight, canvas.width / 2, posHeight + deltaHeightRight - boHeight, canvas.width, posHeight + deltaHeightRight);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(0, posHeight + deltaHeight);
    ctx.closePath();
    ctx.fill();
  }
  requestAnimFrame(loop);
}
loop();

var numDrop = 600;

function randRange(minNum, maxNum) {
  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum)
}

function createRain() {
  for (var i = 0; i < numDrop; i++) {
    var dropLeft = randRange(0, 1600);
    var dropTop = randRange(-1000, 1400);
    $('.rain').append('<div class="drop" id="drop' + i + '"></div>');
    $('#drop' + i).css('left', dropLeft);
    $('#drop' + i).css('top', dropTop);
  }
  ifRain = true;
}

var ifRain = false;
$('.umb').click(function(){
  if (ifRain) {
    for (var i = 0; i < numDrop; i++) {
      $('#drop' + i).remove();
    }
    ifRain = false;
  } else {
    createRain();
  }
});

var images = ['images/eleven/1.png','images/eleven/2.png','images/eleven/3.png','images/eleven/4.png','images/eleven/5.png']
var current = 0;
function cloak(i) {
  $('#face').attr('src',images[i]);
}
$('#face').click(function(){
  // $('#shadow').css("z-index","10");
  cloak(current%5);
  // setTimeout(function(){
  //   $('#shadow').css("z-index","-10");
  // },500);
  current++;
});

var clipping = {
  top: 0,
  right: 300,
  bottom: 0,
  left: 0
};

$('#dropman').click(function () {
  var blackhole = $('.blackhole');
  var dropman = $('#dropman');
  blackhole.css('animation','blackholeappear 2s linear 1');
  setTimeout(function(){
    dropman.animate({
      clip: clipping,
      bottom: '-160px'
    }, 2000 );
    blackhole.height(30);
    blackhole.width(100);
  },1950);
});

$('.blackhole').click(function () {
  var blackhole = $('.blackhole');
  blackhole.css('animation-name', 'blackholedisappear');
  setTimeout(function(){
    blackhole.height(0);
    blackhole.width(0);
  },1900);
});

$('.sun').click(function () {
  $('.sun').hide('drop',1000);
  $('#canvas').animate({
    backgroundColor: 'rgb(2,35,91)'
  },3000);
  $('.moon').show('drop',4000);
});

$('.moon').click(function () {
  $('.moon').hide('drop',1000);
  $('#canvas').animate({
    backgroundColor: 'rgb(196,228,253)'
  },3000);
  $('.sun').show('drop',4000);
});

$('.blade').click(function(){
  var state = $(this).css('animation-play-state');
  if (state == 'paused') {
    $(this).css('animation-play-state','running');
  } else {
    $(this).css('animation-play-state','paused');
  }
});

$('.fly').click(function(){
  var state = $(this).css('animation-play-state');
  if (state == 'paused') {
    $(this).css('animation-play-state','running');
  } else {
    $(this).css('animation-play-state','paused');
  }
});
