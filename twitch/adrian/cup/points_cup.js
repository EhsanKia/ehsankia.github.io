"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* globals $, p2, PIXI, ReconnectingWebSocket, Raygun, _ */

// getQueryParameter checks to see if a query parameter is present, and
// if so, return its value (or true for simple flags).
var urlHashes;
var getQueryParameter = function getQueryParameter(p) {
  urlHashes = urlHashes || window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
  for (var i = 0; i < urlHashes.length; i++) {
    var hash = urlHashes[i].split("=");
    if (hash[0] === p) {
      return hash[1] || true;
    }
  }
};

var test;

$(function () {
  // Globals.
  var muted = false;

  var muteLessThan = 0;

  // PIXI and p2 globals.
  var renderer, stage, container, world, debugDrawGraphics;

  // All active gems and text objects.
  var gems = [],
      texts = [];

  var emoteTiers = {
    1: 'popcorn',
    100: 'caramel_popcorn',
    1000: 'burnt_popcorn',
    5000: 'nathouleon',
    10000: 'dinocreep',
  };

  var sfx;

  // Scrolling text values that are waiting for an open lane to display in.
  var pendingTexts = [];

  // Used to keep track of which message this is, used for sorting gems.
  var messageID = 0;

  // Set when a modification to the gems array happens, triggers a depth sort on next update.
  var needsDepthSort = false;

  var gemMaterial = new p2.Material();
  var cupMaterial = new p2.Material();

  // Constants
  var width = $("body").width();
  var height = $("body").height();
  var MAXIMUM_TEXT_DISPLAY = 5;
  var TEXT_DISPLAY_START = height;
  var GEM_DROP_POINT = width / 2 + 45;
  var GEM_RADIUS = 12;

  function debugRenderWorld(world, renderer) {
    renderer.clear();

    var colors = [0x000000, 0xFFFF00, 0x1CE6FF, 0xFF34FF, 0xFF4A46, 0x008941, 0x006FA6, 0xA30059, 0xFFDBE5, 0x7A4900, 0x0000A6, 0x63FFAC, 0xB79762, 0x004D43, 0x8FB0FF, 0x997D87, 0x5A0007, 0x809693, 0xFEFFE6, 0x1B4400, 0x4FC601, 0x3B5DFF, 0x4A3B53, 0xFF2F80, 0x61615A, 0xBA0900, 0x6B7900, 0x00C2A0, 0xFFAA92, 0xFF90C9, 0xB903AA, 0xD16100, 0xDDEFFF, 0x000035, 0x7B4F4B, 0xA1C299, 0x300018, 0x0AA6D8, 0x013349, 0x00846F, 0x372101, 0xFFB500, 0xC2FFED, 0xA079BF, 0xCC0744, 0xC0B9B2, 0xC2FF99, 0x001E09, 0x00489C, 0x6F0062, 0x0CBD66, 0xEEC3FF, 0x456D75, 0xB77B68, 0x7A87A1, 0x788D66, 0x885578, 0xFAD09F, 0xFF8A9A, 0xD157A0, 0xBEC459, 0x456648, 0x0086ED, 0x886F4C, 0x34362D, 0xB4A8BD, 0x00A6AA, 0x452C2C, 0x636375, 0xA3C8C9, 0xFF913F, 0x938A81, 0x575329, 0x00FECF, 0xB05B6F, 0x8CD0FF, 0x3B9700, 0x04F757, 0xC8A1A1, 0x1E6E00, 0x7900D7, 0xA77500, 0x6367A9, 0xA05837, 0x6B002C, 0x772600, 0xD790FF, 0x9B9700, 0x549E79, 0xFFF69F, 0x201625, 0x72418F, 0xBC23FF, 0x99ADC0, 0x3A2465, 0x922329, 0x5B4534, 0xFDE8DC, 0x404E55, 0x0089A3, 0xCB7E98, 0xA4E804, 0x324E72, 0x6A3A4C];

    var rotate = function rotate(v, rads) {
      var c = Math.cos(rads);
      var s = Math.sin(rads);

      return [c * v[0] - s * v[1], s * v[0] + c * v[1]];
    };

    for (var bi in world.bodies) {
      var body = world.bodies[bi];

      renderer.beginFill(colors[bi], 1);
      for (var si in body.shapes) {
        var shape = body.shapes[si];
        switch (shape.type) {
          case p2.Shape.CIRCLE:
            renderer.drawCircle(shape.position[0] + body.position[0], height - (shape.position[1] + body.position[1]), shape.radius);
            break;
          case p2.Shape.CONVEX:
            var verts = [];
            var rotatedPosition = rotate(shape.position, body.angle);
            for (var i = 0; i < shape.vertices.length; ++i) {
              var rotated = rotate(shape.vertices[i], body.angle);

              verts.push(rotatedPosition[0] + body.position[0] + rotated[0]);
              verts.push(height - (rotatedPosition[1] + body.position[1] + rotated[1]));
            }
            renderer.drawPolygon(verts);
            break;
          default:
            console.log(body.shapes[si]);
            break;
        }
      }
      renderer.endFill();
    }
  }

  // Utility
  function getPointsThreshold(amount) {
    // Points threshold.
    var threshold = 1;
    if (amount >= 10000) {
      threshold = 10000;
    } else if (amount >= 5000) {
      threshold = 5000;
    } else if (amount >= 1000) {
      threshold = 1000;
    } else if (amount >= 100) {
      threshold = 100;
    }

    return threshold;
  }

  function depthSort(a, b) {
    return (a.depth || 0) - (b.depth || 0);
  }

  function setPointFromPosition(point, position) {
    point.x = position[0];
    point.y = position[1];
  }

  function webGLDetect(return_context) {
    if (window.WebGLRenderingContext) {
      var canvas = document.createElement("canvas"),
          names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
          context = false;

      for (var i = 0; i < 4; i++) {
        try {
          context = canvas.getContext(names[i]);
          if (context && typeof context.getParameter === "function") {
            // WebGL is enabled
            if (return_context) {
              // return WebGL object if the function's argument is present
              return { name: names[i], gl: context };
            }
            // else, return just true
            return true;
          }
        } catch (e) {
          console.log(e);
        }
      }

      // WebGL is supported, but disabled
      return false;
    }

    // WebGL not supported
    return false;
  }

  function randomRange(low, high) {
    return Math.random() * (high - low) + low;
  }

  function rotation(mag, rad) {
    return [Math.cos(rad) * mag, Math.sin(rad) * mag];
  }

  // Gem handles the animation of the individual gems.

  var Gem = function () {
    function Gem(physical, kernel, popcorn, tier, amount, extra) {
      _classCallCheck(this, Gem);

      this.physical = physical;
      this.kernel = kernel;
      this.popcorn = popcorn;
      this.renderable = kernel;
      this.extra = extra;

      // Set to true when the gem begins falling under the influence of gravity.
      this.falling = false;

      this.tier = tier;

      this.amount = amount;

    }

    _createClass(Gem, [{
      key: "sync",
      value: function sync() {
        setPointFromPosition(this.renderable.position, this.physical.position);
        this.renderable.rotation = this.physical.angle;
      }
    }, {
      key: "update",
      value: function update(dt) {
        if (this.falling) {
          // Die when the gem falls out of bounds.
          if (this.physical.position[0] < 0 - GEM_RADIUS || this.physical.position[0] > width + GEM_RADIUS || this.physical.position[1] < 0 - GEM_RADIUS) {
            this.dead = true;
          }

          if (this.falling && this.physical.position[1] < TEXT_DISPLAY_START - 40 * MAXIMUM_TEXT_DISPLAY && !this.hasRenderBody) {
            var gemShape = new p2.Circle({ radius: GEM_RADIUS, material: gemMaterial });
            this.physical.addShape(gemShape);
            this.hasRenderBody = true;
          }
          if (this.physical.mass >= this.tier && this.physical.mass > 0) {
            this.physical.mass = this.physical.mass - dt * this.tier;
            this.physical.updateMassProperties();
          }
        } else {
          // Update the position, and then turn on physics when we hit the rim of the cup.
          this.physical.position[0] -= dt * 100;

          // Once it reaches the drop point, let physics happen.
          if (this.physical.position[0] < GEM_DROP_POINT && this.falling === false) {
            this.physical.mass = Math.round(this.amount * Math.sqrt(this.tier));
            this.physical.damping = 0.01;
            this.physical.angularDamping = 0.1;
            this.physical.type = p2.Body.DYNAMIC;
            this.physical.velocity = rotation(randomRange(10, 50), randomRange(0, Math.PI / 2) + Math.PI / 2);
            this.physical.updateMassProperties();
            this.falling = true;
            this.kernel.visible = false;
            this.popcorn.visible = true;
            this.renderable = this.popcorn;
            if (this.physical.amount >= 10000) {
              this.physical.mass = this.physical.mass * 100;
              this.physical.updateMassProperties();
            }
          }
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        world.removeBody(this.physical);
        container.removeChild(this.renderable);
        this.renderable.destroy();
      }
    }]);

    return Gem;
  }();

  // ScrollingText is a listing of renderable text / emote image objects that move across the screen.


  var ScrollingText = function () {
    function ScrollingText(rank, renderables) {
      _classCallCheck(this, ScrollingText);

      this.rank = rank;
      this.renderables = renderables;
    }

    _createClass(ScrollingText, [{
      key: "update",
      value: function update(dt) {
        for (var i = 0; i < this.renderables.length; ++i) {
          this.renderables[i].position.x -= dt * 100;
        }

        // Kill this object when the last member goes offscreen.
        var last = this.renderables[this.renderables.length - 1];
        if (last.width + last.position.x < 0) {
          this.dead = true;
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _.each(this.renderables, function (r) {
          container.removeChild(r);
          r.destroy();
        });
      }
    }]);

    return ScrollingText;
  }();

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function addGem(x, y, tier, depth, amount) {
    // Add a box
    var body = new p2.Body({
      mass: 0,
      position: [x, y - GEM_RADIUS],
      angularVelocity: randomRange(-1 / 2, 1 / 2)
    });

    world.addBody(body);

    var emoteName = emoteTiers[tier] || 'dinocreep';
    if (tier === 1) emoteName += getRandomInt(1, 8);
    emoteName += '.png';
    var popcorn = new PIXI.Sprite.fromImage(emoteName);
    popcorn.name = emoteName;
    popcorn.anchor.x = 0.5;
    popcorn.anchor.y = 0.5;
    popcorn.scale = new PIXI.Point(0.3, 0.3);
    popcorn.depth = depth;
    popcorn.visible = false;

    var kernelName = 'kernel' + getRandomInt(1, 3) + '.png';
    var kernel = new PIXI.Sprite.fromImage(kernelName);
    kernel.name = kernelName;
    kernel.anchor.x = 0.5;
    kernel.anchor.y = 0.5;
    kernel.scale = new PIXI.Point(0.3, 0.3);
    kernel.depth = depth;

    // Add the box to our container
    container.addChild(kernel);
    container.addChild(popcorn);

    var res = new Gem(body, kernel, popcorn, tier, amount);
    gems.push(res);

    needsDepthSort = true;
    return res;
  }

  function addText(username, msg, emotes, bits) {
    // if (sfx.paused && bits >= 100) sfx.play();
    pendingTexts.push({
      username: username,
      message: msg,
      emotes: emotes,
      bits: bits
    });
  }

  function createTextScroll() {
    var i, j;

    if (pendingTexts.length === 0) {
      return;
    }

    // Find an open lane.
    var exists = {};
    for (i = 0; i < texts.length; ++i) {
      exists[texts[i].rank] = 1;
    }

    var nextRank = undefined;
    for (i = 0; i < MAXIMUM_TEXT_DISPLAY; ++i) {
      if (exists[i] === undefined) {
        nextRank = i;
        break;
      }
    }

    // This shouldn't really happen
    if (nextRank === undefined) {
      return;
    }

    var text = pendingTexts[0];
    pendingTexts.splice(0, 1);

    // This is a list of { emote-id, indices: [start, end] }
    var emoteListing = [];

    // Split the emotes field on /
    text.emotes = text.emotes || "";
    if (text.emotes !== "") {
      var emotes = text.emotes.split("/");
      for (i = 0; i < emotes.length; ++i) {
        // Invert this index, turning it into starting-char -> emote id, length.
        var data = emotes[i];

        // This is a
        var idValsSplit = data.split(":");

        // Turn the values into a a list.
        var values = idValsSplit[1].split(",");

        // Turn the values into integer pairs of start and ending points.
        var inds = _.map(values, function (v) {
          var indices = v.split("-");
          return [parseInt(indices[0], 10), parseInt(indices[1], 10)];
        });

        // Add each emote index pair to the list.
        _.each(inds, function (v) {
          emoteListing.push({
            id: idValsSplit[0],
            indices: v
          });
        });
      }
    }

    // This sorts the emotes from first to last in order of appearance.
    emoteListing = _.sortBy(emoteListing, function (a) {
      return a.indices[0];
    });

    // Then reverse them, since replacing the last emote does not change indices of prior emotes.
    emoteListing = emoteListing.reverse();
    var replaceRange = function replaceRange(msg, b, e) {
      return msg.substr(0, b) + "\x01" + msg.substr(e + 1);
    };

    var message = text.message;
    for (i = 0; i < emoteListing.length; ++i) {
      var range = emoteListing[i];
      message = replaceRange(message, range.indices[0], range.indices[1]);
    }

    // Split on 0x01, which gives us a set of messages seperated by emotes.
    var splitMessage = message.split("\x01");
    var cheerTypes = [
        "cheer", "okaycheer", "kappa", "dansgame", "elegiggle", "trihard", "kreygasm", "4head","swiftrage",
        "notlikethis", "failfish", "vohiyo", "pjsalt", "mrdestructoid", "bday", "ripcheer", "streamlabs", "muxy"
    ];
    var cheerRegexText = '(?:^|\\s)(?:' + cheerTypes.join('|') + ')(\\d+)(?=$|\\s)';
    var givepointsRegex = new RegExp(cheerRegexText, 'g');
    var amountRegex = new RegExp(cheerRegexText);

    // Begin assembling the {prefix, emote} table.
    var messageTable = [];
    var forwardEmoteListing = emoteListing.reverse();

    // At the end there is a sentinel '0' emote, which is no emote.
    forwardEmoteListing.push({
      id: "0"
    });

    var total = 0;
    var expected = text.bits;

    // At this point, splitMessage is a list of text fragments. Between each fragment is an emote.
    for (i = 0; i < splitMessage.length; ++i) {
      var part = splitMessage[i];
      console.log(part);

      // Then, look for givepoints objects
      var matches = part.match(givepointsRegex);
      var splits = part.replace(givepointsRegex, "\x01").split("\x01");

      // Splits is now a list of text fragments, between each of which is a givepoints command.
      for (j = 0; j < splits.length - 1; ++j) {
        var matchResults = matches[j].match(amountRegex);
        console.log(matchResults);
        var amount = parseInt(matchResults[1], 10);
        console.log(amount);

        if (total + amount > expected) {
          // Skip this one, as it exceeds the number of bits in the message.
          messageTable.push({
            prefix: splits[j].trim() + matches[j],
            emote: { id: "0" }
          });
        } else {
          // Push each fragment, with a gem afterwards.
          messageTable.push({
            prefix: splits[j].trim(),
            emote: { id: "-1" },
            amount: amount
          });

          total += amount;
        }
      }

      // Push the final message, with the emote afterwards.
      messageTable.push({
        prefix: splits[splits.length - 1].trim(),
        emote: forwardEmoteListing[i]
      });
    }

    // Prepend the username.
    messageTable[0].prefix = text.username + ": " + messageTable[0].prefix;

    // Begin constructing the display objects.
    var resultingTextObjects = [];
    var properties = { font: '24px Arial', fill: 0xFFFFFF, stroke: 0x000000, strokeThickness: 5, align: 'left', lineJoin: "round" };
    var currentOffset = width + 100;
    var textHeight = TEXT_DISPLAY_START - 40 * nextRank;

    for (i = 0; i < messageTable.length; ++i) {
      var msg = messageTable[i];

      // If there is a non-empty prefix, generate a text object.
      if (msg.prefix.length !== 0) {
        var textDisplay = new PIXI.Text(msg.prefix, properties);
        textDisplay.scale = new PIXI.Point(1, -1);
        textDisplay.position = new PIXI.Point(currentOffset, textHeight);

        container.addChild(textDisplay);
        currentOffset += textDisplay.width;
        resultingTextObjects.push(textDisplay);
      }

      if (msg.emote.id === "-1") {
        // If the emote is a gem, add a gem.
        var tier = getPointsThreshold(msg.amount);
        addGem(currentOffset + 15, textHeight, tier, messageID * 10000 + tier + i, msg.amount);
        currentOffset += GEM_RADIUS * 2 + 10;
      } else if (msg.emote.id === "0") {
        // Do nothing.
      } else {
        // This is an emote, construct a sprite.
        var emoteDisplay = new PIXI.Sprite.fromImage('/points/emote/' + msg.emote.id);
        emoteDisplay.scale = new PIXI.Point(1, -1);

        // These pixel adjustments were experimentally derived.
        emoteDisplay.position = new PIXI.Point(currentOffset + 5, textHeight);
        currentOffset += 38;

        container.addChild(emoteDisplay);
        resultingTextObjects.push(emoteDisplay);
      }
    }

    texts.push(new ScrollingText(nextRank, resultingTextObjects));
    messageID++;
    needsDepthSort = true;
  }

  function handlePointsGiven(json) {
    addText(json.viewer.name, json.user_message, json.extra.emotes, json.extra.amount);
  }

  function killAllGems() {
    _.each(gems, function (g) {
      g.dead = true;
    });
  }

  function impulseAllGems() {
    _.each(gems, function (g) {
      g.physical.velocity = rotation(randomRange(300, 600), randomRange(0, Math.PI / 2) + Math.PI / 4);
    });
  }

  function update(dt) {
    if (needsDepthSort) {
      container.children.sort(depthSort);
      needsDepthSort = false;
    }

    gems = _.filter(gems, function (g) {
      if (g.dead) {
        g.destroy();
      }

      return !g.dead;
    });

    for (var i = 0; i < gems.length; i++) {
      gems[i].update(dt);
      gems[i].sync();
    }

    texts = _.filter(texts, function (t) {
      if (t.dead) {
        t.destroy();
      }

      return !t.dead;
    });

    if (texts.length < MAXIMUM_TEXT_DISPLAY) {
      createTextScroll();
    }

    for (i = 0; i < texts.length; ++i) {
      texts[i].update(dt);
    }
  }

  function init() {
    sfx = $('#money-audio')[0];
    sfx.volume = 0.5;

    var cupWidth = 250;
    var cupBottomWidth = 125;
    var cupHeight = 157;

    var cupPosition = [width / 2, 0]; // Center,Bottom of the cup physically.
    var cupRadiusAdjust = 10; // Since the gems are larger than their collision bounds, this forces the sides of the cup inwards so gems don't poke out.
    var cupRightAdjust = 5; // The right needs a bit more adjustment inwards.
    var cupBottomHeight = 20; // The height of the solid glass at the bottom of the cup.
    var cupSideLength = 140;
    var cupSideThickness = 10;

    // Graphical coordinate system
    // We use a container inside the stage for all our content
    // +X is right, +Y is Down.
    // Physical coordinate system
    // +X is right, -Y is down.
    // Origin of a draw is the top right corner.

    startWebsocket();
    // Init p2.js
    world = new p2.World({
      gravity: [0, -98.20]
    });

    world.addContactMaterial(new p2.ContactMaterial(gemMaterial, gemMaterial, { relaxation: 0.8, friction: 0, restitution: 0.2, stiffness: p2.Equation.DEFAULT_STIFFNESS * 100 }));
    world.addContactMaterial(new p2.ContactMaterial(gemMaterial, cupMaterial, { relaxation: 0.8, friction: 0, restitution: 0.2, stiffness: Number.MAX_VALUE }));

    var cupBottom = new p2.Body({
      position: [cupPosition[0], cupPosition[1] + cupBottomHeight + cupRadiusAdjust - 25]
    });

    cupBottom.addShape(new p2.Box({ width: cupBottomWidth, height: cupBottomHeight, material: cupMaterial }));
    world.addBody(cupBottom);

    var angle = 1;
    var cupLeft = new p2.Body({
      angle: Math.PI - angle,
      position: [cupPosition[0] - cupBottomWidth / 2 + cupRadiusAdjust, cupPosition[1] + cupRadiusAdjust]
    });
    cupLeft.addShape(new p2.Box({ width: cupSideLength * 2, height: cupSideThickness, material: cupMaterial }));
    world.addBody(cupLeft);

    var cupRight = new p2.Body({
      angle: angle,
      position: [cupPosition[0] + cupBottomWidth / 2 - cupRadiusAdjust - cupRightAdjust, cupPosition[1] + cupRadiusAdjust]
    });
    cupRight.addShape(new p2.Box({ width: cupSideLength * 2, height: cupSideThickness, material: cupMaterial }));
    world.addBody(cupRight);

    // Initialize the stage
    if (webGLDetect()) {
      console.log("Using webgl renderer");
      renderer = new PIXI.WebGLRenderer(width, height, { transparent: true });
    } else {
      console.log("Using canvas renderer");
      renderer = new PIXI.CanvasRenderer(width, height, { transparent: true });
    }

    stage = new PIXI.Container();

    // Add this before the container so that it's behind the gems
    var cupBack = new PIXI.Sprite.fromImage('cup-back.png');
    cupBack.position.x = cupPosition[0] - cupWidth / 2;
    cupBack.position.y = height - cupPosition[1] - cupHeight;

    stage.addChild(cupBack);

    container = new PIXI.Container(), container.scale.y = -1; // Flip container to match coordinate space
    stage.addChild(container);

    // Add transform to the container
    //container.position.x =  renderer.width/2; // center at origin
    container.position.y = renderer.height;

    // Add the canvas to the DOM
    document.body.appendChild(renderer.view);

    var cupFront = new PIXI.Sprite.fromImage('cup-front.png', true);
    cupFront.position.x = cupPosition[0] - cupWidth / 2;
    cupFront.position.y = height - cupPosition[1] - cupHeight;
    stage.addChild(cupFront);

    debugDrawGraphics = new PIXI.Graphics();
    stage.addChild(debugDrawGraphics);

    test = addText;
    animate();
    try {
      unserializeState();
    } catch (e) {
      delete localStorage["gem_state"];
    }
  }

  // Animation loop
  var start = 0;
  var accumulate = 0;
  var frameNumber = 0;
  function animate(t) {
    t = t || 0;
    var dt = t - start;

    accumulate += dt;

    var updates = 0;
    while (accumulate > 1 / 60 && updates < 3) {
      world.step(1 / 60);
      update(1 / 60, frameNumber++);

      accumulate -= 1 / 60;
      updates++;
    }

    if (getQueryParameter("physicsrender")) {
      debugRenderWorld(world, debugDrawGraphics);
    }

    start = t;
    requestAnimationFrame(animate);

    // Render scene
    renderer.render(stage);
  }

  // Gem state serialization
  function serializeState() {
    var result = [];
    for (var i = 0; i < gems.length; ++i) {
      var gem = gems[i];
      result.push({
        name: gem.name,
        position: gem.physical.position,
        falling: gem.falling,
        velocity: gem.physical.velocity,
        mass: gem.physical.mass,
        angularVelocity: gem.physical.angularVelocity,
        angle: gem.physical.angle,
        tier: gem.tier,
        depth: gem.renderable.depth
      });
    }

    localStorage.setItem("gem_state", JSON.stringify(result));
  }

  function unserializeState() {
    var state = JSON.parse(localStorage.getItem("gem_state"));
    if (state === null) {
      return;
    }

    for (var i = 0; i < state.length; ++i) {
      var data = state[i];

      var gemShape = new p2.Circle({ radius: GEM_RADIUS, material: gemMaterial });
      var body = new p2.Body({
        mass: data.mass,
        position: [data.position[0], data.position[1]],
        angularVelocity: data.angularVelocity,
        velocity: [data.velocity[0], data.velocity[1]],
        angle: data.angle,
        damping: 0.1,
        angularDamping: 0.1
      });

      body.addShape(gemShape);
      world.addBody(body);

      var gem = new PIXI.Sprite.fromImage(data.name);
      gem.name = data.name
      gem.scale = new PIXI.Point(0.3, 0.3);
      gem.anchor.x = 0.5;
      gem.anchor.y = 0.5;
      gem.depth = data.depth;

      container.addChild(gem);

      var res = new Gem(body, gem, gem, data.tier, data.depth, data.amount);
      res.falling = data.falling;

      gems.push(res);
    }

    needsDepthSort = true;
    messageID = state.length + 1;
  }

  // Websocket eventing loop
  function startWebsocket() {
    var socket = null;
    if (window.WebSocket) {
      var uri = 'a.muxy.io/ws/undefined/' + window.settingsID + '/cup';
      if (window.location.protocol === "http:") {
        uri = "ws://" + uri;
      } else {
        uri = "wss://" + uri;
      }

      var reconnectionTimeout = null;
      var PING_TIMEOUT = 10 * 1000;

      // Every 3 minutes, send a proof of life message to the server.
      var proofOfLifeInterval = null;
      var proofOfLifeID = 0;
      var PROOF_OF_LIFE_TIMEOUT = 60 * 1000 * 3;

      var proofOfLife = function proofOfLife() {
        if (socket) {
          socket.send(proofOfLifeID++);
        }
      };

      var reconnect = function reconnect() {
        if (socket) {
          socket.close();
        }

        clearTimeout(reconnectionTimeout);
        reconnectionTimeout = setTimeout(reconnect, PING_TIMEOUT);

        socket = new ReconnectingWebSocket(uri);
        console.log("Establishing connection to websocket server...");

        socket.onopen = function () {
          proofOfLifeID = 0;
          clearInterval(proofOfLifeInterval);
          proofOfLifeInterval = setInterval(proofOfLife, PROOF_OF_LIFE_TIMEOUT);

          socket.onmessage = function (event) {
            var json = {};

            try {
              json = JSON.parse(event.data);
              if (json.type === "command") {
                if (json.extra.type === "ping") {
                  clearTimeout(reconnectionTimeout);
                  reconnectionTimeout = setTimeout(reconnect, PING_TIMEOUT);
                  return;
                }

                if (json.extra.type === "reset_points") {
                  if (json.extra.target && json.extra.target === "cup") {
                    impulseAllGems();
                  }
                  return;
                }
              }

              if (json.type === "points_given") {
                handlePointsGiven(json);
              }

              if (json.type === "session_change") {
                if (json.extra.islive) {
                  killAllGems();
                }
              }
            } catch (err) {
              Raygun.send(err, json);
              console.error(err);
            }
          };

          socket.onerror = function (event) {
            Raygun.send("Websocket Error", event);
          };
        };
      };

      reconnect();
    } else {
      $("#chrome-version-error").removeClass("hidden-error");
      Raygun.send("Browser does not support websockets.");
    }
  }

  // Debugging niceties.
  if (getQueryParameter("debug")) {
    // Let user manually trigger points.
    $("body").on("keypress", function (ev) {
      var charCode = ev.which ? ev.which : ev.keyCode;
      var val = 1;

      switch (String.fromCharCode(charCode)) {
        case "1":
          val = 1;
          break;
        case "2":
          val = 100;
          break;
        case "3":
          val = 1000;
          break;
        case "4":
          val = 5000;
          break;
        case "5":
          val = 10000;
          break;
        case " ":
          impulseAllGems();
          return;
        default:
          return;
      }

      if (val === 1) {
        addText("demo", "Here you go cheer1 hello cheer1 hello cheer1 testing bla cheer1 cheer1 cheer1 cheer1 cheer1 cheer1 cheer1 cheer1 cheer1 cheer1 cheer1 cheer1", "", 15);
      } else {
        addText("demo", "Here you go cheer" + val, "", val);
      }
    });

    // Background debugging.
    $("body").css("background-color", "black");
    var log = $("<div>").css({
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      "z-index": -10
    });
    $("body").prepend(log);

    console.old = console.log;

    console.log = function (l) {
      var o = $("<pre>").css("color", "white").text(l);
      log.prepend(o);
    };
    console.error = function (l) {
      var o = $("<pre>").css("color", "red").text(l);
      log.prepend(o);
    };

    console.log("Debug mode enabled, press 1-5 to drop gems and space to explode the cup");
    console.log("WebGL is " + (webGLDetect() ? "enabled" : "disabled"));
  }

  if (getQueryParameter("mute") === true) {
    muted = true;
  } else if (parseInt(getQueryParameter("mute")) > 0) {
    muteLessThan = parseInt(getQueryParameter("mute"));
  }

  $(window).unload(function () {
    serializeState();
  });

  init();
});