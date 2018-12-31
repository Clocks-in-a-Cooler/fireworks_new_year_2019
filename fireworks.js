//reload the page if the windows size changes
window.onresize = (event) => {
    document.location.reload(true);
}

//canvas and its context
var canvas = document.querySelector("canvas");
var ctxt   = canvas.getContext("2d");
var width  = window.innerWidth;
var height = window.innerHeight;

//a nice touch.
addEventListener("touchstart", (e) => {
    var x = e.touches[0].clientX;
    var y = e.touches[0].clientY;
    
    if (y <= bottom_limit) {
        return;
    } else {
        entities.push(new Firework_rocket(x, y, touch_colour));
    }
});

addEventListener("mousedown", (e) => {
    var x = e.clientX;
    var y = e.clientY;
    
    if (y <= bottom_limit) {
        return;
    } else {
        entities.push(new Firework_rocket(x, y, click_colour));
    }
});

function random_number(start, end) {
    var adder      = Math.min(start, end);
    var multiplier = Math.abs(start - end);
    
    return Math.floor(Math.random() * multiplier + adder);
}

function random_element(array) {
    return array[random_number(0, array.length)];
}

//handling animation
var last_time = null;
var lapse     = 0;

function animate(time) {
    if (last_time == null) {
        lapse = 0;
    } else {
        lapse = time - last_time;
    }
    
    last_time = time;
    
    if (last_time > next_time) {
        entities.push(new Firework_rocket());
        next_time = last_time + random_number(100, 200);
    }
    
    draw_frame(lapse);
    
    requestAnimationFrame(animate);
}

function draw_frame(lapse) {
    ctxt.fillStyle = get_colour(background_colour, 0.1);
    ctxt.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    entities = entities.filter((e) => { return e.active; });
    
    entities.forEach((e) => {
        e.get_new_position(lapse);
        e.draw(ctxt);
    });
}

//initializer
function init() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    
    calculate(window.innerHeight);
    
    animate();
}

function calculate(height) {
    bottom_limit = height * 0.85;
    top_limit    = height * 0.15;
}

//variables and stuff
var gravity = 0.005;
var explode = 0.5;

var thrust   = -0.05; //thrust has to be negative, since the fireworks are moving UP
var friction = 0.025;

var bottom_limit, top_limit;

var entities = [];

var fire_delay = random_number(750, 1250);
var next_time  = 0;

var background_colour = {r: 0, g: 0, b: 0}; //black
var firework_colours = [
    //from red to purple, plus white and silver
    {r: 255, g: 192, b: 203}, //pink
    {r: 220, g:  20, b:  60}, //crimson, or red
    {r: 255, g:  69, b:   0}, //redorange, or just orange
    {r: 255, g: 165, b:   0}, //brighter orange
    {r: 255, g: 255, b:   0}, //yellow
    {r: 255, g: 215, b:   0}, //gold
    {r: 124, g: 252, b:   0}, //lawngreen
    {r: 152, g: 251, b: 152}, //palegreen
    {r:   0, g: 206, b: 209}, //darkturquoise
    {r: 176, g: 224, b: 230}, //powderblue
    {r: 221, g: 160, b: 221}, //violet
    {r: 216, g: 191, b: 216}, //thistle
    {r: 255, g: 255, b: 255}, //white
    {r: 255, g: 248, b: 220}, //cornsilk
    {r: 220, g: 220, b: 220}, //gainsboro
    {r: 192, g: 192, b: 192}, //silver
];
var click_colour = {r: 240, g: 230, b: 130}; //khaki
var touch_colour = {r: 102, g: 205, b: 170}; //mediumaquamarine


var explosion_sizes = ["small", "medium", "large", "extra large"];
var explosion_angles = { //angles for each explosion size
    "small": [ 0, Math.PI / 3, 2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 5 * Math.PI / 3], //six
    "medium": [ 0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4], //eight
    "large": [0, Math.PI / 5, 2 * Math.PI / 5, 3 * Math.PI / 5, 4 * Math.PI / 5, Math.PI, 6 * Math.PI / 5, 7 * Math.PI / 5, 8 * Math.PI / 5, 9 * Math.PI / 5],//ten
    "extra large": [0, Math.PI / 6, Math.PI / 3, Math.PI / 2, 2 * Math.PI / 3, 5 * Math.PI / 6, Math.PI, 7 * Math.PI / 6, 4 * Math.PI / 3, 3 * Math.PI / 2, 5 * Math.PI / 3, 11 * Math.PI / 6], //twelve
};

function get_colour(colour, alpha) {
    if (alpha == undefined) {
        return "rgb(" + colour.r + ", " + colour.g + ", " + colour.b + ")";
    } else {
        return "rgba(" + colour.r + ", " + colour.g + ", " + colour.b + ", " + alpha + ")";
    }
}

//handling the firework while it's going up
//it will explode when it reaches a maximum height
function Firework_rocket(x, y, colour) {
    this.x = x || random_number(0, width);
    this.y = y || window.innerHeight;
    this.r = 3;
    this.a = (5 * Math.PI / 9) - Math.random() * (Math.PI / 9);
    
    this.explosion_size = random_element(explosion_sizes);
    
    this.active = true;
    
    this.max_height = random_number(bottom_limit, top_limit);
    
    this.colour = colour || random_element(firework_colours);
    
    this.v = { x: 0, y: 0, };
    
    //functions of the firework rocket
    this.get_new_position = (lapse) => {
        if (this.y < this.max_height) {
            this.active = false;
            this.explode();
        } else {
            this.v.x += this.get_friction().x;
            this.v.y += this.get_friction().y;
            this.v.x += this.get_thrust().x;
            this.v.y += this.get_thrust().y;
            
            this.x += this.v.x * lapse;
            this.y += this.v.y * lapse;
        }
        
    };
    
    this.get_friction = () => {
        return {
            x: -this.v.x * friction,
            y: -this.v.y * friction,
        };
    };
    
    this.get_thrust = () => {
        return {
            x: Math.cos(this.a) * thrust,
            y: Math.sin(this.a) * thrust,
        }
    };
    
    this.draw = (context) => {
        context.beginPath();
        context.fillStyle = get_colour(this.colour);
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    };
    
    this.explode = () => {
        explosion_angles[this.explosion_size].forEach((s) => {
            entities.push(new Firework_particle(this.x, this.y, s, this.colour, this.explosion_size));
        });
    };
}

//after the firework blows itself to pieces
function Firework_particle(x, y, a, colour, size) {
    this.x = x;
    this.y = y;
    this.r = 4;
    
    a -= (Math.PI / 18) + Math.random() * (Math.PI / 9);
    
    this.v = {x: Math.cos(a), y: Math.sin(a),};
    
    this.colour = colour;
    
    this.max_lifetime = (function(s) {
        switch (s) {
            case "small":
                return 125;
                break;
            case "medium":
                return 250;
                break;
            case "large":
                return 375;
                break;
            case "extra large":
                return 500;
                break;
            default:
                return 400;
        }
    })(size);
    
    this.lifetime = 0;
    this.active   = true;
    
    this.get_new_position = (lapse) => {
        if (this.lifetime > this.max_lifetime) {
            this.active = false;
        } else {
            this.lifetime += lapse;
        }
        
        this.v.y += gravity * lapse;
        
        this.x += this.v.x * lapse;
        this.y += this.v.y * lapse;
    };
    
    this.draw = (context) => {
        context.fillStyle = get_colour(this.colour);
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    };
}